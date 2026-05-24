// ============================================================================
// 1. MODULE INITIALIZATION & EXPRESS CONFIG
// ============================================================================
const express = require('express');
const http = require('http');            
const { Server } = require('socket.io'); 

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// ============================================================================
// 2. IN-MEMORY APPLICATION DATABASE COLLECTIONS
// ============================================================================
// Key: socket.id, Value: { characterName, characterSeries, nickname, joinedAt, lastMessageAt }
const activeSessions = new Map(); 

// Key: nickname (lowercase), Value: { characterName, characterSeries }
const rememberedUsers = new Map();

const whispers = [];

// Fully synced pool matching all 42 frontend capabilities for substitution logic
const SERVER_ANIME_CHARACTERS = [
    "Naruto Uzumaki", "Satoru Gojo", "Monkey D. Luffy", "Eren Yeager", "Mikasa Ackerman", 
    "Killua Zoldyck", "Nezuko Kamado", "Tanjiro Kamado", "Roronoa Zoro", "Vegeta", 
    "Kakashi Hatake", "Saitama", "Son Goku", "Sasuke Uchiha", "Itachi Uchiha", 
    "Ryomen Sukuna", "Megumi Fushiguro", "Nobara Kugisaki", "Ichigo Kurosaki", "Rukia Kuchiki", 
    "Light Yagami", "L Lawliet", "Levi Ackerman", "Gon Freecss", "Hisoka Morow", 
    "Izuku Midoriya", "Katsuki Bakugo", "Shoto Todoroki", "Zenitsu Agatsuma", "Inosuke Hashibira", 
    "Kyojuro Rengoku", "Vinsmoke Sanji", "Nico Robin", "Ken Kaneki", "Anya Forger", 
    "Loid Forger", "Yor Forger", "David Martinez", "Lucy", "Rimuru Tempest", 
    "Edward Elric", "Roy Mustang"
];

// ============================================================================
// 3. REAL-TIME EVENT PIPELINES
// ============================================================================
io.on('connection', (socket) => {
  console.log(`⚡ A user connected! Unique ID: ${socket.id}`);

  // --- NEW ENGINE EVENT: REAL-TIME NICKNAME INTERCEPT LOOKUP ---
  socket.on('check_returning_nickname', (nameToCheck) => {
    if (!nameToCheck) return;
    const cleanKey = nameToCheck.trim().toLowerCase();
    
    if (rememberedUsers.has(cleanKey)) {
        const savedProfile = rememberedUsers.get(cleanKey);
        // Feed the matched configurations back into the frontend pre-login display module
        socket.emit('persona_confirmed', {
            characterName: savedProfile.characterName,
            characterSeries: savedProfile.characterSeries,
            isReturning: true
        });
    }
  });

  // --- EVENT 1: ASSIGN PERSONA CHANNELS ---
  socket.on('assign_persona', (data) => {
    const rawNickname = (data.nickname || "").trim();
    const cleanNicknameKey = rawNickname.toLowerCase();

    // 1. Process returning validation structures
    if (cleanNicknameKey && rememberedUsers.has(cleanNicknameKey)) {
        const savedProfile = rememberedUsers.get(cleanNicknameKey);
        
        activeSessions.set(socket.id, {
            characterName: savedProfile.characterName,
            characterSeries: savedProfile.characterSeries,
            nickname: rawNickname,
            joinedAt: new Date()
        });

        console.log(`♻️ Returning User: ${rawNickname} re-entered as ${savedProfile.characterName}`);
        
        socket.emit('persona_confirmed', {
            characterName: savedProfile.characterName,
            characterSeries: savedProfile.characterSeries,
            isReturning: true
        });

        io.emit('online_count', activeSessions.size);
        return socket.emit('whisper_history', whispers.slice(-50));
    }

    // 2. Fallback handling checking for active user collisions
    let targetedCharacter = data.characterName || "Anonymous Otaku";
    let targetedSeries = data.characterSeries || "Chit-Chat Network";
    
    const takenCharacters = Array.from(activeSessions.values()).map(u => u.characterName);
    
    if (takenCharacters.includes(targetedCharacter)) {
        const availablePool = SERVER_ANIME_CHARACTERS.filter(char => !takenCharacters.includes(char));
        
        if (availablePool.length === 0) {
            return socket.emit('error_message', 'The chatroom is completely full! All anime personas are taken.');
        }

        // Dynamically shift persona handle to prevent runtime overlapping active clients
        targetedCharacter = availablePool[Math.floor(Math.random() * availablePool.length)];
        targetedSeries = "Alternative Allocation"; 
    }

    // Secure memory state allocation
    activeSessions.set(socket.id, {
      characterName: targetedCharacter,
      characterSeries: targetedSeries,
      nickname: rawNickname,
      joinedAt: new Date()
    });

    if (cleanNicknameKey) {
        rememberedUsers.set(cleanNicknameKey, {
            characterName: targetedCharacter,
            characterSeries: targetedSeries
        });
    }

    console.log(`👤 New User: ${targetedCharacter} has entered the room.`);

    socket.emit('persona_confirmed', {
        characterName: targetedCharacter,
        characterSeries: targetedSeries,
        isReturning: false
    });

    io.emit('online_count', activeSessions.size);
    socket.emit('whisper_history', whispers.slice(-50));
  });

  // --- EVENT 2: SEND WHISPER ---
  socket.on('send_whisper', (msgData) => {
    const userSession = activeSessions.get(socket.id);
    if (!userSession) {
      return socket.emit('error_message', 'You must choose a character first!');
    }

    const now = Date.now();
    if (userSession.lastMessageAt && (now - userSession.lastMessageAt) < 2000) {
      return socket.emit('error_message', 'Slow down! You are whispering too fast.');
    }
    userSession.lastMessageAt = now;

    const newWhisper = {
      whisper_id: 'w_' + Math.random().toString(36).substring(2, 9), 
      author_character_name: userSession.characterName,
      character_series: userSession.characterSeries,
      content_text: cleanContent(msgData.text), 
      applied_theme_class: msgData.themeClass || 'theme-default',
      created_at: new Date(),
      total_likes_count: 0,
      liked_by_sockets: [], 
      comments: []          
    };

    whispers.push(newWhisper);
    if (whispers.length > 100) whispers.shift();

    io.emit('new_whisper', newWhisper);
  });

  // --- EVENT 4: LIKES ---
  socket.on('like_whisper', (whisperId) => {
    const whisper = whispers.find(w => w.whisper_id === whisperId);
    if (!whisper) return;

    const likedIndex = whisper.liked_by_sockets.indexOf(socket.id);
    let likedByMe = false;

    if (likedIndex > -1) {
      whisper.liked_by_sockets.splice(likedIndex, 1);
      whisper.total_likes_count = Math.max(0, whisper.total_likes_count - 1);
    } else {
      whisper.liked_by_sockets.push(socket.id);
      whisper.total_likes_count++;
      likedByMe = true;
    }

    socket.emit('like_confirmed', {
      whisperId: whisperId,
      likedByMe: likedByMe,
      total_likes_count: whisper.total_likes_count
    });

    io.emit('update_whisper', whisper);
  });

  // --- EVENT 5: COMMENTS ---
  socket.on('new_comment', (commentData) => {
    const userSession = activeSessions.get(socket.id);
    if (!userSession) return socket.emit('error_message', 'You must choose a character before replying.');

    const whisper = whispers.find(w => w.whisper_id === commentData.whisperId);
    if (!whisper) return;

    whisper.comments.push({
      author: userSession.characterName,
      content: cleanContent(commentData.text), 
      timestamp: new Date()
    });

    io.emit('update_whisper', whisper);
  });

  socket.on('request_refresh', () => {
    socket.emit('whisper_history', whispers.slice(-50));
  });

  // --- EVENT 3: DISCONNECT ---
  socket.on('disconnect', () => {
    const user = activeSessions.get(socket.id);
    if (user) {
      console.log(`❌ ${user.characterName} left the room.`);
      activeSessions.delete(socket.id);
    }
    io.emit('online_count', activeSessions.size);
  });
});

// Safe filter validation utility routine
function cleanContent(text) {
  if (typeof text !== 'string') return "";
  const bannedWords = ['badword1', 'spamlink', 'toxictext']; 
  let cleanedText = text;
  bannedWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    cleanedText = cleanedText.replace(regex, '***');
  });
  return cleanedText;
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Real-time server is running on http://localhost:${PORT}`);
});