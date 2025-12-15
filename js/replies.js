/* ===============================
   replies.js
   תגובות על תגובות (Live)
   =============================== */

/* מניעת רינדור כפול */
const renderedReplies = {};

/* פתיחה / סגירה של replies */
window.toggleReplies = function (commentId) {
  const box = document.getElementById("replies-" + commentId);
  const counter = document.getElementById("rc-" + commentId);

  if (!box || !counter) return;

  /* סגירה */
  if (!box.classList.contains("hidden")) {
    box.classList.add("hidden");
    counter.innerHTML = counter.innerHTML.replace("▴", "▾");
    return;
  }

  /* פתיחה */
  box.classList.remove("hidden");
  counter.innerHTML = counter.innerHTML.replace("▾", "▴");

  // מבנה פנימי קבוע
  box.innerHTML = `
    <div class="replies-list" id="replies-list-${commentId}"></div>
    <div class="reply-composer hidden" id="reply-composer-${commentId}">
      <textarea id="reply-text-${commentId}" placeholder="כתוב תגובה..."></textarea>
      <div class="reply-actions">
        <button onclick="sendReply('${commentId}')">שלח</button>
        <button onclick="closeReply('${commentId}')">ביטול</button>
      </div>
    </div>
  `;

  listenReplies(commentId);
};

/* מאזין Live ל־replies */
function listenReplies(commentId) {
  const list = document.getElementById("replies-list-" + commentId);
  if (!list) return;

  renderedReplies[commentId] = new Set();
  list.innerHTML = "<div class='loader'></div>";

  const ref = firebase.database()
    .ref("replies/" + postId + "/" + commentId);

  ref.off();
  list.innerHTML = "";

  ref.on("child_added", snap => {
    if (!snap.exists()) return;

    if (renderedReplies[commentId].has(snap.key)) return;
    renderedReplies[commentId].add(snap.key);

    renderReply(commentId, snap.val());
  });
}

/* רינדור reply */
function renderReply(commentId, r) {
  const list = document.getElementById("replies-list-" + commentId);
  if (!list) return;

  const time = new Date(r.time).toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const div = document.createElement("div");
  div.className = "reply";

  div.innerHTML = `
    <div class="reply-meta">
      <span class="reply-author">${escapeHTML(r.author)}</span>
      <span class="reply-time">${time}</span>
    </div>
    <p>${escapeHTML(r.text)}</p>
  `;

  list.appendChild(div);
}

/* פתיחת קומפוזר reply */
window.openReply = function (commentId) {
  const composer = document.getElementById("reply-composer-" + commentId);
  if (!composer) return;

  composer.classList.remove("hidden");

  setTimeout(() => {
    const ta = document.getElementById("reply-text-" + commentId);
    if (ta) {
      ta.focus();
      composer.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 150);
};

/* סגירת קומפוזר reply */
window.closeReply = function (commentId) {
  const composer = document.getElementById("reply-composer-" + commentId);
  const ta = document.getElementById("reply-text-" + commentId);

  if (composer) composer.classList.add("hidden");
  if (ta) ta.value = "";
};

/* שליחת reply */
window.sendReply = function (commentId) {
  const ta = document.getElementById("reply-text-" + commentId);
  if (!ta) return;

  const text = ta.value.trim();
  if (!text) return;

  firebase.database()
    .ref("replies/" + postId + "/" + commentId)
    .push({
      text: text,
      author: username,
      time: Date.now()
    })
    .then(() => {
      ta.value = "";
      closeReply(commentId);
      updateReplyCount(commentId);
    });
};