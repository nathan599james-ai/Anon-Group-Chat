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
// 2. IN-MEMORY COLLECTIONS (Managed dynamically while server is alive)
// ============================================================================
const activeSessions = new Map(); 
const rememberedUsers = new Map();
const whispers = [];

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

  // --- NICKNAME LOOKUP INTERCEPT ---
  socket.on('check_returning_nickname', (nameToCheck) => {
    if (!nameToCheck) return;
    const cleanKey = nameToCheck.trim().toLowerCase();
    
    if (rememberedUsers.has(cleanKey)) {
        const savedProfile = rememberedUsers.get(cleanKey);
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

    if (!rawNickname) {
        return socket.emit('error_message', 'Nickname is required to enter the room!');
    }

    // 1. Process explicit client validation profile bypasses
    if (rememberedUsers.has(cleanNicknameKey)) {
        const savedProfile = rememberedUsers.get(cleanNicknameKey);
        
        activeSessions.set(socket.id, {
            characterName: savedProfile.characterName,
            characterSeries: savedProfile.characterSeries,
            nickname: rawNickname,
            joinedAt: new Date()
        });

        socket.emit('persona_confirmed', {
            characterName: savedProfile.characterName,
            characterSeries: savedProfile.characterSeries,
            isReturning: true
        });

        io.emit('online_count', activeSessions.size);
        return socket.emit('whisper_history', whispers.slice(-50));
    }

    // 2. Core Exclusivity Lockout
    const globallyClaimedCharacters = Array.from(rememberedUsers.values()).map(u => u.characterName);
    
    let targetedCharacter = data.characterName || "Anonymous Otaku";
    let targetedSeries = data.characterSeries || "Chit-Chat Network";
    
    if (globallyClaimedCharacters.includes(targetedCharacter)) {
        const availablePool = SERVER_ANIME_CHARACTERS.filter(char => !globallyClaimedCharacters.includes(char));
        
        if (availablePool.length === 0) {
            return socket.emit('error_message', 'The chatroom is completely full! All characters are permanently claimed.');
        }
        targetedCharacter = availablePool[Math.floor(Math.random() * availablePool.length)];
        targetedSeries = "Alternative Allocation"; 
    }

    // 3. Save to active run states
    activeSessions.set(socket.id, {
      characterName: targetedCharacter,
      characterSeries: targetedSeries,
      nickname: rawNickname,
      joinedAt: new Date()
    });

    rememberedUsers.set(cleanNicknameKey, {
        characterName: targetedCharacter,
        characterSeries: targetedSeries
    });

    socket.emit('persona_confirmed', {
        characterName: targetedCharacter,
        characterSeries: targetedSeries,
        isReturning: false,
        saveToLocal: true, // Signal frontend script to write to localStorage browser disk
        nickname: rawNickname
    });

    io.emit('online_count', activeSessions.size);
    socket.emit('whisper_history', whispers.slice(-50));
  });

  // --- EVENT 2: SEND WHISPER ---
  socket.on('send_whisper', (msgData) => {
    const userSession = activeSessions.get(socket.id);
    if (!userSession) return socket.emit('error_message', 'You must choose a character first!');

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

  // --- EVENT 3: DISCONNECT ---
  socket.on('disconnect', () => {
    const user = activeSessions.get(socket.id);
    if (user) activeSessions.delete(socket.id);
    io.emit('online_count', activeSessions.size);
  });
});

function cleanContent(text) {
  if (typeof text !== 'string') return "";
  return text.replace(/badword1|spamlink|toxictext/gi, '***');
}

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Real-time server running on port ${PORT}`);
});