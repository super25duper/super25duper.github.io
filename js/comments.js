/* ===============================
   comments.js
   תגובות ראשיות (Live)
   =============================== */

const commentsBox = document.getElementById("comments");

/* מאזין Live לתגובות */
function listenComments() {
  if (!postId) return;

  firebase.database()
    .ref("comments/" + postId)
    .on("child_added", snap => {
      renderComment(snap.key, snap.val());
    });
}

/* רינדור תגובה בודדת */
function renderComment(commentId, c) {
  const time = new Date(c.time).toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const color = userColor(c.author);

  const div = document.createElement("div");
  div.className = "comment";
  div.style.borderRightColor = color;

  div.innerHTML = `
    <div class="comment-meta">
      <span class="comment-author">${escapeHTML(c.author)}</span>
      <span class="comment-time">${time}</span>
    </div>

    <p>${escapeHTML(c.text)}</p>

    <div class="comment-actions-line">
      <button onclick="openReply('${commentId}')">השב</button>
      <span class="reply-count" id="rc-${commentId}">
        טוען תגובות…
      </span>
    </div>

    <div class="replies hidden" id="replies-${commentId}"></div>
  `;

  commentsBox.appendChild(div);

  updateReplyCount(commentId);
}

/* ספירת תגובות (replies) */
function updateReplyCount(commentId) {
  firebase.database()
    .ref("replies/" + postId + "/" + commentId)
    .once("value")
    .then(snap => {
      const count = snap.numChildren();
      const el = document.getElementById("rc-" + commentId);
      if (!el) return;

      el.innerHTML =
        count > 0
          ? `${count} תגובות <span class="arrow">▾ הצג</span>`
          : "אין תגובות";

      if (count > 0) {
        el.onclick = () => toggleReplies(commentId);
      }
    });
}