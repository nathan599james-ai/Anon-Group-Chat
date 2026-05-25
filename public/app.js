// ============================================================================
// 1. ANIME CHARACTERS DATABASE (EXPANDED TO 42 CHARACTERS)
// ============================================================================
const ANIME_CHARACTERS = [
    { name: "Naruto Uzumaki", series: "Naruto", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Naruto" },
    { name: "Satoru Gojo", series: "Jujutsu Kaisen", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Gojo" },
    { name: "Monkey D. Luffy", series: "One Piece", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Luffy" },
    { name: "Eren Yeager", series: "Attack on Titan", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Eren" },
    { name: "Mikasa Ackerman", series: "Attack on Titan", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Mikasa" },
    { name: "Killua Zoldyck", series: "Hunter x Hunter", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Killua" },
    { name: "Nezuko Kamado", series: "Demon Slayer", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Nezuko" },
    { name: "Tanjiro Kamado", series: "Demon Slayer", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Tanjiro" },
    { name: "Roronoa Zoro", series: "One Piece", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Zoro" },
    { name: "Vegeta", series: "Dragon Ball Z", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Vegeta" },
    { name: "Kakashi Hatake", series: "Naruto", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Kakashi" },
    { name: "Saitama", series: "One Punch Man", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Saitama" },
    { name: "Son Goku", series: "Dragon Ball Z", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Goku" },
    { name: "Sasuke Uchiha", series: "Naruto", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sasuke" },
    { name: "Itachi Uchiha", series: "Naruto", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Itachi" },
    { name: "Ryomen Sukuna", series: "Jujutsu Kaisen", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sukuna" },
    { name: "Megumi Fushiguro", series: "Jujutsu Kaisen", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Megumi" },
    { name: "Nobara Kugisaki", series: "Jujutsu Kaisen", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Nobara" },
    { name: "Ichigo Kurosaki", series: "Bleach", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Ichigo" },
    { name: "Rukia Kuchiki", series: "Bleach", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rukia" },
    { name: "Light Yagami", series: "Death Note", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Light" },
    { name: "L Lawliet", series: "Death Note", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=LLawliet" },
    { name: "Levi Ackerman", series: "Attack on Titan", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Levi" },
    { name: "Gon Freecss", series: "Hunter x Hunter", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Gon" },
    { name: "Hisoka Morow", series: "Hunter x Hunter", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Hisoka" },
    { name: "Izuku Midoriya", series: "My Hero Academia", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Deku" },
    { name: "Katsuki Bakugo", series: "My Hero Academia", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Bakugo" },
    { name: "Shoto Todoroki", series: "My Hero Academia", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Todoroki" },
    { name: "Zenitsu Agatsuma", series: "Demon Slayer", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Zenitsu" },
    { name: "Inosuke Hashibira", series: "Demon Slayer", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Inosuke" },
    { name: "Kyojuro Rengoku", series: "Demon Slayer", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rengoku" },
    { name: "Vinsmoke Sanji", series: "One Piece", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Sanji" },
    { name: "Nico Robin", series: "One Piece", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Robin" },
    { name: "Ken Kaneki", series: "Tokyo Ghoul", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Kaneki" },
    { name: "Anya Forger", series: "Spy x Family", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Anya" },
    { name: "Loid Forger", series: "Spy x Family", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Loid" },
    { name: "Yor Forger", series: "Spy x Family", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Yor" },
    { name: "David Martinez", series: "Cyberpunk: Edgerunners", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=David" },
    { name: "Lucy", series: "Cyberpunk: Edgerunners", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=LucyEdgerunner" },
    { name: "Rimuru Tempest", series: "That Time I Got Reincarnated as a Slime", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Rimuru" },
    { name: "Edward Elric", series: "Fullmetal Alchemist", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Edward" },
    { name: "Roy Mustang", series: "Fullmetal Alchemist", avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Mustang" }
];

// ============================================================================
// 2. STATE VARIABLES
// ============================================================================
const socket = io(); 
let currentPersona = null;
let currentTheme = "theme-default";
let whisperDatabase = []; 

// ============================================================================
// 3. UI ELEMENT SELECTORS
// ============================================================================
const loginOverlay = document.getElementById("login-overlay");
const usernameInput = document.getElementById("username-input");
const rollIdentityBtn = document.getElementById("roll-identity-btn");
const enterChatBtn = document.getElementById("enter-chat-btn");
const identityRollArea = document.getElementById("identity-roll-area");
const identityPlaceholder = identityRollArea.querySelector(".identity-placeholder");
const identityProfile = identityRollArea.querySelector(".identity-profile");
const identityAvatar = document.getElementById("identity-avatar");
const identityName = document.getElementById("identity-name");

const appContainer = document.getElementById("app-container");
const userAvatarImg = document.getElementById("user-avatar-img");
const userProfileName = document.getElementById("user-profile-name");
const rerollBtn = document.getElementById("reroll-btn");

const whisperInput = document.getElementById("whisper-input");
const charCount = document.getElementById("char-count");
const themeButtons = document.querySelectorAll(".theme-grid .theme-btn");
const sendBtn = document.getElementById("send-btn");
const whisperFeed = document.getElementById("whisper-feed");
const feedPlaceholder = document.getElementById("feed-placeholder");
const refreshBtn = document.getElementById("refresh-btn");

// ============================================================================
// 4. LOGICAL ROUTINES
// ============================================================================
function updateIcons() {
    if (window.lucide) window.lucide.createIcons();
}

function getRandomCharacter() {
    return ANIME_CHARACTERS[Math.floor(Math.random() * ANIME_CHARACTERS.length)];
}

function rollIdentity() {
    currentPersona = getRandomCharacter();
    identityAvatar.src = currentPersona.avatar;
    identityAvatar.alt = currentPersona.name;
    identityName.textContent = `${currentPersona.name} (${currentPersona.series})`;
    
    identityPlaceholder.style.display = "none";
    identityProfile.style.display = "flex";
    identityRollArea.classList.add("revealed");
    enterChatBtn.removeAttribute("disabled");
}

function enterChatroom() {
    const optionalNickname = usernameInput.value.trim();
    if (!optionalNickname && !currentPersona) {
        alert("Please roll an identity or type your returning nickname first!");
        return;
    }

    const characterNameToSend = currentPersona ? currentPersona.name : "Anonymous Otaku";
    const characterSeriesToSend = currentPersona ? currentPersona.series : "Chit-Chat Network";

    // Switch screen visibility fields layout mappings
    loginOverlay.style.display = "none";
    appContainer.style.display = "grid"; 
    
    socket.emit('assign_persona', {
        characterName: characterNameToSend,
        characterSeries: characterSeriesToSend,
        nickname: optionalNickname
    });
}

function createWhisperCard(whisper) {
    const dateStr = new Date(whisper.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const commentsHTML = whisper.comments && whisper.comments.length > 0 
        ? whisper.comments.map(c => `
            <div class="comment-item" style="font-size: 0.85rem; background: rgba(255,255,255,0.03); padding: 6px 10px; border-radius: 6px; margin-top: 4px; border-left: 2px solid rgba(255,255,255,0.2);">
                <strong style="color: #fff;">${c.author}:</strong> 
                <span style="color: rgba(255,255,255,0.8);">${c.content}</span>
            </div>
          `).join("")
        : `<p class="no-comments-hint" style="font-size: 0.8rem; opacity: 0.4; margin: 4px 0 0 4px;">No replies yet...</p>`;

    const heartColor = whisper.likedByMe ? "#ff4757" : "currentColor";
    const heartFill = whisper.likedByMe ? "#ff4757" : "none";

    return `
        <div class="whisper-card ${whisper.applied_theme_class}" data-id="${whisper.whisper_id}" style="margin-bottom: 20px; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
            <div class="whisper-card-header" style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                <img src="${whisper.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(whisper.author_character_name)}" alt="${whisper.author_character_name}" style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); padding: 2px;" />
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0; font-size: 0.95rem; font-weight: 600; color: #fff;">${whisper.author_character_name}</h4>
                    <span style="font-size: 0.75rem; opacity: 0.6;">${whisper.character_series} • ${dateStr}</span>
                </div>
            </div>
            <div class="whisper-card-body" style="margin-bottom: 16px;">
                <p style="margin: 0; font-size: 0.95rem; line-height: 1.5; color: rgba(255,255,255,0.95); white-space: pre-wrap;">${whisper.content_text}</p>
            </div>
            <div class="whisper-actions-bar" style="display: flex; gap: 16px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 10px; margin-bottom: 12px;">
                <button class="like-action-btn" style="background: none; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 0; font-size: 0.85rem;">
                    <i data-lucide="heart" style="width: 18px; height: 18px; color: ${heartColor}; fill: ${heartFill};"></i>
                    <span>${whisper.total_likes_count || 0}</span>
                </button>
                <div style="font-size: 0.85rem; opacity: 0.6; display: flex; align-items: center; gap: 4px;">
                    <i data-lucide="message-square" style="width: 16px; height: 16px;"></i>
                    <span>${whisper.comments ? whisper.comments.length : 0} Comments</span>
                </div>
            </div>
            <div class="whisper-comments-list" style="display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px;">
                ${commentsHTML}
            </div>
            <div class="comment-input-row" style="display: flex; gap: 8px;">
                <input type="text" class="card-comment-input" placeholder="Write an anonymous reply..." style="flex-grow: 1; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 6px 12px; color: #fff; font-size: 0.85rem;" />
                <button class="submit-comment-btn" style="background: rgba(255,255,255,0.1); border: none; border-radius: 6px; padding: 6px 12px; color: #fff; cursor: pointer; font-size: 0.85rem;">Reply</button>
            </div>
        </div>
    `;
}

function renderFeed() {
    if (whisperDatabase.length === 0) {
        feedPlaceholder.style.display = "flex";
        whisperFeed.innerHTML = ""; 
        whisperFeed.appendChild(feedPlaceholder);
        return;
    }
    feedPlaceholder.style.display = "none";
    whisperFeed.innerHTML = whisperDatabase.map(w => createWhisperCard(w)).join("");
    updateIcons();
}

function submitWhisper() {
    const content = whisperInput.value.trim();
    if (!content) return;
    socket.emit('send_whisper', { text: content, themeClass: currentTheme });
    whisperInput.value = "";
    charCount.textContent = "0";
}

// ============================================================================
// 5. EVENT HOOKS
// ============================================================================
rollIdentityBtn.addEventListener("click", rollIdentity);
enterChatBtn.addEventListener("click", enterChatroom);
sendBtn.addEventListener("click", submitWhisper);

whisperInput.addEventListener("input", () => {
    charCount.textContent = whisperInput.value.length;
});

usernameInput.addEventListener("input", () => {
    const nameToCheck = usernameInput.value.trim();
    if (nameToCheck.length >= 2) {
        socket.emit('check_returning_nickname', nameToCheck);
    }
});

themeButtons.forEach(button => {
    button.addEventListener("click", () => {
        themeButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        currentTheme = button.getAttribute("data-theme");
    });
});

rerollBtn.addEventListener("click", () => {
    // Clear browser cache database profiles completely on manual sign-out
    localStorage.removeItem('savedNickname');
    localStorage.removeItem('savedCharacter');
    localStorage.removeItem('savedSeries');

    currentPersona = null;
    usernameInput.value = "";
    identityPlaceholder.style.display = "flex";
    identityProfile.style.display = "none";
    identityRollArea.classList.remove("revealed");
    enterChatBtn.setAttribute("disabled", "true");
    appContainer.style.display = "none";
    loginOverlay.style.display = "flex";
    socket.disconnect();
    socket.connect();
});

whisperFeed.addEventListener("click", (event) => {
    const card = event.target.closest(".whisper-card");
    if (!card) return;
    const whisperId = card.getAttribute("data-id");

    if (event.target.closest(".like-action-btn")) {
        socket.emit('like_whisper', whisperId);
        return;
    }

    if (event.target.closest(".submit-comment-btn")) {
        const inputField = card.querySelector(".card-comment-input");
        const commentText = inputField.value.trim();
        if (!commentText) return;
        socket.emit('new_comment', { whisperId: whisperId, text: commentText });
        inputField.value = "";
    }
});

whisperInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        submitWhisper();
    }
});

refreshBtn.addEventListener("click", () => {
    refreshBtn.style.transform = "rotate(360deg)";
    refreshBtn.style.transition = "transform 0.5s ease";
    setTimeout(() => { refreshBtn.style.transform = "none"; refreshBtn.style.transition = "none"; }, 500);
    socket.emit('request_refresh');
});

// ============================================================================
// 6. CHANNEL SYSTEM COMMUNICATIONS
// ============================================================================
socket.on('persona_confirmed', (confirmedData) => {
    // If the server confirms this profile layout configuration is brand new, save it locally!
    if (confirmedData.saveToLocal && confirmedData.nickname) {
        localStorage.setItem('savedNickname', confirmedData.nickname);
        localStorage.setItem('savedCharacter', confirmedData.characterName);
        localStorage.setItem('savedSeries', confirmedData.characterSeries);
    }

    const characterData = ANIME_CHARACTERS.find(c => c.name === confirmedData.characterName);
    
    if (characterData) {
        currentPersona = characterData;
    } else {
        currentPersona = {
            name: confirmedData.characterName,
            series: confirmedData.characterSeries,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(confirmedData.characterName)}`
        };
    }

    identityAvatar.src = currentPersona.avatar;
    identityAvatar.alt = currentPersona.name;
    identityName.textContent = `${currentPersona.name} (${currentPersona.series})`;
    identityPlaceholder.style.display = "none";
    identityProfile.style.display = "flex";
    identityRollArea.classList.add("revealed");
    enterChatBtn.removeAttribute("disabled");

    userProfileName.textContent = currentPersona.name;
    userAvatarImg.src = currentPersona.avatar;

    // Force interface shifts if triggered by page automation routines
    loginOverlay.style.display = "none";
    appContainer.style.display = "grid";
    console.log(`Successfully logged in as: ${confirmedData.characterName}`);
});

socket.on("online_count", (count) => {
    const counter = document.getElementById('active-users');
    if (counter) counter.innerText = `${count} Online Chatters`;
});

socket.on("whisper_history", (historyArray) => {
    whisperDatabase = historyArray.slice().reverse();
    renderFeed();
});

socket.on("new_whisper", (newWhisper) => {
    whisperDatabase.unshift(newWhisper);
    renderFeed();
});

socket.on("update_whisper", (updatedWhisper) => {
    const idx = whisperDatabase.findIndex(w => w.whisper_id === updatedWhisper.whisper_id);
    if (idx !== -1) {
        updatedWhisper.likedByMe = whisperDatabase[idx].likedByMe;
        whisperDatabase[idx] = updatedWhisper;
        renderFeed();
    }
});

socket.on("like_confirmed", (data) => {
    const idx = whisperDatabase.findIndex(w => w.whisper_id === data.whisperId);
    if (idx !== -1) {
        whisperDatabase[idx].likedByMe = data.likedByMe;
        whisperDatabase[idx].total_likes_count = data.total_likes_count;
        renderFeed();
    }
});

socket.on("error_message", (warningText) => {
    alert(warningText);
});

// AUTOMATION AUTO-FILL: Run this right when the page loads up!
window.addEventListener('DOMContentLoaded', () => {
    const localNickname = localStorage.getItem('savedNickname');
    const localCharacter = localStorage.getItem('savedCharacter');
    const localSeries = localStorage.getItem('savedSeries');
    
    if (localNickname && localCharacter) {
        console.log(`Found a returning identity profile: ${localNickname}`);
        const nicknameInputField = document.querySelector('#username-input');
        if (nicknameInputField) {
            nicknameInputField.value = localNickname;
            
            // Automatically sync identity details straight to the background service channels
            socket.emit('assign_persona', {
                nickname: localNickname,
                characterName: localCharacter,
                characterSeries: localSeries || "Chit-Chat Network"
            });
        }
    }
});

updateIcons();