/* ===============================
   post.js
   טעינת פוסט בודד
   =============================== */

/* אלמנט ה־DOM של הפוסט */
const postContainer = document.getElementById("post");

/* פונקציה שמופעלת ע״י auth.js */
function loadPost() {
  if (!postId) return;

  firebase.database()
    .ref("posts/" + postId)
    .once("value")
    .then(snapshot => {
      if (!snapshot.exists()) {
        postContainer.innerHTML = "<p>הפוסט לא נמצא.</p>";
        return;
      }

      const p = snapshot.val();

      postContainer.innerHTML = `
        <div class="post">
          <h3>${escapeHTML(p.title)}</h3>
          <p>${escapeHTML(p.text)}</p>
          <small>מאת: ${escapeHTML(p.author)}</small>
        </div>
      `;
    })
    .catch(() => {
      postContainer.innerHTML = "<p>שגיאה בטעינת הפוסט.</p>";
    });
}

/* ===============================
   הגנה בסיסית מ־XSS
   =============================== */
function escapeHTML(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}