/* ===============================
   composer.js
   קומפוזר תגובה ראשית
   =============================== */

const openMainBtn = document.getElementById("openMain");
const mainComposer = document.getElementById("mainComposer");
const mainText = document.getElementById("mainText");

/* פתיחת קומפוזר */
openMainBtn.onclick = () => {
  mainComposer.classList.remove("hidden");
  openMainBtn.style.display = "none";

  setTimeout(() => {
    mainText.focus();

    /* גלילה עדינה מעל המקלדת */
    mainComposer.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, 250);
};

/* סגירת קומפוזר */
window.closeMain = function () {
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