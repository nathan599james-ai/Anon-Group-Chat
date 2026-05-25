// ============================================================================
// 1. MODULE INITIALIZATION & EXPRESS CONFIG
// ============================================================================
const express = require('express');
const http = require('http');            
const { Server } = require('socket.io'); 
const fs = require('fs'); // Added for permanent JSON file tracking
const path = require('path');

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

// File path where user-character assignments are saved across server restarts
const DATA_FILE = path.join(__dirname, 'remembered_users.json');

// ============================================================================
// 2. DATABASE COLLECTIONS & STORAGE LAUNCHERS
// ============================================================================
// Active online instances (Key: socket.id, Value: user details)
const activeSessions = new Map(); 

// Master storage map (Key: nickname lowercase, Value: { characterName, characterSeries })
let rememberedUsers = new Map();

// Helper to load profiles from file on boot
function loadRememberedUsers() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const rawData = fs.readFileSync(DATA_FILE, 'utf8');
      const parsed = JSON.parse(rawData);
      rememberedUsers = new Map(Object.entries(parsed));
      console.log(`💾 Loaded ${rememberedUsers.size} persistent user records safely from disk.`);
    } else {
      console.log("ℹ️ No profile database found. Initializing a clean storage pipeline.");
    }
  } catch (error) {
    console.error("⚠️ Failed to read persistent user file storage profiles:", error);
  }
}

// Helper to save profiles to file whenever a new user registers
function saveRememberedUsers() {
  try {
    const obj = Object.fromEntries(rememberedUsers);
    fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), 'utf8');
  } catch (error) {
    console.error("⚠️ Local file system disk backup sequence failed:", error);
  }
}

// Initialize the persistent database files instantly on launch
loadRememberedUsers();

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

  // --- REAL-TIME NICKNAME INTERCEPT LOOKUP ---
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

    if (!rawNickname) {
        return socket.emit('error_message', 'Nickname is required to enter the room!');
    }

    // 1. Process returning validation structures
    if (rememberedUsers.has(cleanNicknameKey)) {
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
            nickname: rawNickname, // Ensure nickname passes back securely
            saveToLocal: true,
            isReturning: true
        });

        io.emit('online_count', activeSessions.size);
        return socket.emit('whisper_history', whispers.slice(-50));
    }

    // 2. Strict Exclusivity Check: Collect ALL characters claimed by anyone, online OR offline
    const globallyClaimedCharacters = Array.from(rememberedUsers.values()).map(u => u.characterName);
    
    let targetedCharacter = data.characterName || "Anonymous Otaku";
    let targetedSeries = data.characterSeries || "Chit-Chat Network";
    
    // Check if the requested character belongs to someone else already
    if (globallyClaimedCharacters.includes(targetedCharacter)) {
        // Filter out any characters that have been claimed globally by ANY registered user
        const availablePool = SERVER_ANIME_CHARACTERS.filter(char => !globallyClaimedCharacters.includes(char));
        
        if (availablePool.length === 0) {
            return socket.emit('error_message', 'The chatroom is completely full! All anime personas have been permanently claimed.');
        }

        // Dynamically assign an unallocated character from the free pool
        targetedCharacter = availablePool[Math.floor(Math.random() * availablePool.length)];
        targetedSeries = "Alternative Allocation"; 
    }

    // 3. Allocate profile inside active session memory maps
    activeSessions.set(socket.id, {
      characterName: targetedCharacter,
      characterSeries: targetedSeries,
      nickname: rawNickname,
      joinedAt: new Date()
    });

    // Save the nickname-to-character block to our persistent runtime tracker maps
    rememberedUsers.set(cleanNicknameKey, {
        characterName: targetedCharacter,
        characterSeries: targetedSeries
    });

    // Flush change to the local JSON file so it isn't wiped if Render resets
    saveRememberedUsers();

    console.log(`👤 New User Registered: ${rawNickname} has claimed ${targetedCharacter}!`);

    socket.emit('persona_confirmed', {
        characterName: targetedCharacter,
        characterSeries: targetedSeries,
        nickname: rawNickname,
        saveToLocal: true,
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
    const userSession = activeSessions.get(socket.id);
    if (!userSession) return socket.emit('error_message', 'Active session missing. Re-enter chatroom.');

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

    // 1. First send direct feedback to the person who clicked it
    socket.emit('like_confirmed', {
      whisperId: whisperId,
      likedByMe: likedByMe,
      total_likes_count: whisper.total_likes_count
    });

    // 2. Broadcast the global update packet out to all alternative screens
    io.emit('update_whisper', whisper);
  });

  // --- EVENT 5: COMMENTS ---
  socket.on('new_comment', (commentData) => {
    const userSession = activeSessions.get(socket.id);
    if (!userSession) return socket.emit('error_message', 'You must choose a character before replying.');

    const whisper = whispers.find(w => w.whisper_id === commentData.whisperId);
    if (!whisper) return;

    // Fixed comment input mapping connection check
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