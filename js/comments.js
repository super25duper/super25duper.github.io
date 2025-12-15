/* ===============================
   comments.js
   תגובות ראשיות (Live)
   =============================== */

/* קונטיינר תגובות */
const commentsBox = document.getElementById("comments");

/* מניעת רינדור כפול */
const renderedComments = new Set();

/* מאזין Live לתגובות */
function listenComments() {
  if (!postId || !commentsBox) return;

  firebase.database()
    .ref("comments/" + postId)
    .off(); // ביטחון: לא מאזין כפול

  firebase.database()
    .ref("comments/" + postId)
    .on("child_added", snap => {
      if (!snap.exists()) return;

      const commentId = snap.key;

      // ⛔ לא מרנדרים פעמיים
      if (renderedComments.has(commentId)) return;

      renderedComments.add(commentId);
      renderComment(commentId, snap.val());
    });
}

/* רינדור תגובה בודדת */
function renderComment(commentId, c) {
  if (!commentsBox) return;

  const time = new Date(c.time).toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const color = userColor(c.author);

  const div = document.createElement("div");
  div.className = "comment";
  div.dataset.id = commentId;
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

  updateReplyCount(commentId);
}

/* ספירת תגובות (replies) */
function updateReplyCount(commentId) {
  firebase.database()
    .ref("replies/" + postId + "/" + commentId)
    .once("value")
    .then(snap => {
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
    })
    .catch(() => {
      const el = document.getElementById("rc-" + commentId);
      if (el) el.textContent = "שגיאה";
    });
}