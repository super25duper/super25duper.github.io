/* ===============================
   comments.js
   תגובות ראשיות (Live)
   =============================== */

let commentsBox = null;

/* מניעת רינדור כפול */
const renderedComments = new Set();

/* אתחול אחרי שה־DOM מוכן */
document.addEventListener("DOMContentLoaded", () => {
  commentsBox = document.getElementById("comments");
});

/* מאזין Live לתגובות */
function listenComments() {
  if (!postId || !commentsBox) {
    console.warn("commentsBox not ready");
    return;
  }

  const ref = firebase.database().ref("comments/" + postId);
  ref.off();

  ref
    .orderByChild("time")
    .on("child_added", snap => {
      if (!snap.exists()) return;

      const commentId = snap.key;
      if (renderedComments.has(commentId)) return;

      renderedComments.add(commentId);
      renderComment(commentId, snap.val());
    });
}

/* רינדור תגובה */
function renderComment(commentId, c) {
  if (!commentsBox) return;

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
      <button type="button" onclick="openReply('${commentId}')">השב</button>
      <span class="reply-count" id="rc-${commentId}">
        טוען תגובות…
      </span>
    </div>

    <div class="replies hidden" id="replies-${commentId}"></div>
  `;

  commentsBox.appendChild(div);
  listenReplyCount(commentId);
}

/* ספירת replies */
function listenReplyCount(commentId) {
  const ref = firebase.database()
    .ref("replies/" + postId + "/" + commentId);

  ref.off();
  ref.on("value", snap => {
    const el = document.getElementById("rc-" + commentId);
    if (!el) return;

    const count = snap.numChildren();

    if (count > 0) {
      el.innerHTML = `${count} תגובות <span class="arrow">▾ הצג</span>`;
      el.onclick = () => toggleReplies(commentId);
    } else {
      el.textContent = "אין תגובות";
      el.onclick = null;
    }
  });
}