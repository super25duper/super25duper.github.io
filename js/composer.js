/* ===============================
   composer.js
   קומפוזר תגובה ראשית
   =============================== */

const openMainBtn = document.getElementById("openMain");
const mainComposer = document.getElementById("mainComposer");
const mainText = document.getElementById("mainText");

let composerOpen = false;

/* פתיחת קומפוזר */
openMainBtn.onclick = () => {
  if (composerOpen) return;
  composerOpen = true;

  mainComposer.classList.remove("hidden");
  openMainBtn.style.display = "none";

  // נותנים למקלדת זמן להיפתח
  setTimeout(() => {
    mainText.focus();

    // גלילה בטוחה – מעל המקלדת
    setTimeout(() => {
      mainComposer.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }, 200);

  }, 150);
};

/* סגירת קומפוזר */
window.closeMain = function () {
  composerOpen = false;

  mainComposer.classList.add("hidden");
  openMainBtn.style.display = "block";
  mainText.value = "";
};

/* שליחת תגובה ראשית */
window.sendMain = function () {
  const text = mainText.value.trim();
  if (!text) return;

  firebase.database()
    .ref("comments/" + postId)
    .push({
      text: text,
      author: username,
      time: Date.now()
    })
    .then(() => {
      closeMain();
    });
};