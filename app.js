// -------------------------
// Load grade on startup
// -------------------------
window.onload = () => {
    const grade = localStorage.getItem("tuteai_grade");
    if (!grade) {
        document.getElementById("gradeModal").classList.remove("hidden");
    } else {
        loadChatList();
    }
};

// -------------------------
// Save grade
// -------------------------
document.getElementById("saveGradeBtn").addEventListener("click", () => {
    const grade = document.getElementById("gradeSelect").value;
    localStorage.setItem("tuteai_grade", grade);
    document.getElementById("gradeModal").classList.add("hidden");
});

// -------------------------
const chatWindow = document.getElementById("chatWindow");
const chatListEl = document.getElementById("chatList");

let currentChatId = null;

// -------------------------
// Create a new chat
// -------------------------
document.getElementById("newChatBtn").onclick = () => {
    currentChatId = "chat_" + Date.now();
    localStorage.setItem(currentChatId, JSON.stringify([]));
    loadChatList();
    loadChat(currentChatId);
};

// -------------------------
// Load chat list
// -------------------------
function loadChatList() {
    chatListEl.innerHTML = "";

    for (let key in localStorage) {
        if (key.startsWith("chat_")) {
            const li = document.createElement("li");
            li.textContent = key.replace("chat_", "Chat ");
            li.onclick = () => loadChat(key);
            chatListEl.appendChild(li);
        }
    }
}

// -------------------------
// Load chat content
// -------------------------
function loadChat(id) {
    currentChatId = id;
    const msgs = JSON.parse(localStorage.getItem(id) || "[]");

    chatWindow.innerHTML = "";
    msgs.forEach(renderMessage);
}

// -------------------------
// Send message
// -------------------------
document.getElementById("sendBtn").onclick = async () => {
    const msg = document.getElementById("messageInput").value.trim();
    if (!msg) return;

    addMessage("user", msg);
    document.getElementById("messageInput").value = "";

    const grade = localStorage.getItem("tuteai_grade") || "9";

    // Apply anti-cheat rewrite
    const safePrompt = createSafePrompt(msg, grade);

    const aiResponse = await generateAIResponse(safePrompt);

    addMessage("ai", aiResponse);
};

// -------------------------
// Render messages
// -------------------------
function renderMessage(msg) {
    const div = document.createElement("div");
    div.className = "message " + (msg.role === "user" ? "user-msg" : "ai-msg");

    // Use marked.js to render markdown
    div.innerHTML = marked.parse(msg.content);

    chatWindow.appendChild(div);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addMessage(role, content) {
    const msg = { role, content };

    const msgs = JSON.parse(localStorage.getItem(currentChatId) || "[]");
    msgs.push(msg);
    localStorage.setItem(currentChatId, JSON.stringify(msgs));

    renderMessage(msg);
}

// -------------------------
// Anti-Cheat Layer
// -------------------------
function createSafePrompt(userText, grade) {
    return `
The user is in grade ${grade}. 
Your job is to **teach**, not give direct answers.

Rewrite your explanation in **the fewest steps possible**, simple, clear, age-appropriate.

If the user asks for:
- Direct answers
- Homework solutions
- Math calculations
- Test or quiz questions

You MUST NOT give the answer.  
Instead: explain the method, give hints, break down the idea.

User request: "${userText}"

Now give an explanation or lesson, NOT an answer.
`;
}
