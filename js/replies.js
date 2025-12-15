/* ===============================
   replies.js
   תגובות על תגובות (Live)
   =============================== */

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
  box.innerHTML = "<div class='loader'></div>";
  counter.innerHTML = counter.innerHTML.replace("▾", "▴");

  listenReplies(commentId);
};

/* מאזין Live ל־replies */
function listenReplies(commentId) {
  const box = document.getElementById("replies-" + commentId);
  if (!box) return;

  box.innerHTML = "";

  firebase.database()
    .ref("replies/" + postId + "/" + commentId)
    .off();

  firebase.database()
    .ref("replies/" + postId + "/" + commentId)
    .on("child_added", snap => {
      renderReply(commentId, snap.val());
    });
}

/* רינדור reply */
function renderReply(commentId, r) {
  const box = document.getElementById("replies-" + commentId);
  if (!box) return;

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

  box.appendChild(div);
}

/* פתיחת קומפוזר reply */
window.openReply = function (commentId) {
  const box = document.getElementById("replies-" + commentId);
  if (!box) return;

  box.classList.remove("hidden");

  box.innerHTML = `
    <div class="reply-composer">
      <textarea id="reply-text-${commentId}" placeholder="כתוב תגובה..."></textarea>
      <div class="reply-actions">
        <button onclick="sendReply('${commentId}')">שלח</button>
        <button onclick="toggleReplies('${commentId}')">ביטול</button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const ta = document.getElementById("reply-text-" + commentId);
    if (ta) ta.focus();
  }, 200);
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
      updateReplyCount(commentId);
      listenReplies(commentId);
    });
};