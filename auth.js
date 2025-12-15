/* ===============================
   auth.js
   טיפול באבטחה והתחברות
   =============================== */

/* 🚫 חסימה מיידית לדפדפן רגיל */
(function blockBrowser() {
  try {
    if (!window.AppInventor) {
      location.replace("forbidden.html");
    }
  } catch (e) {
    location.replace("forbidden.html");
  }
})();

/* משתנים גלובליים משותפים */
let payload = null;
let uid = null;
let username = null;

/* קבלת postId מה־URL */
const postId = new URLSearchParams(location.search).get("postId");
if (!postId) {
  location.replace("forbidden.html");
}

/* התחלת תהליך */
document.addEventListener("DOMContentLoaded", () => {
  waitForPayload();
});

/* ===============================
   1️⃣ קבלת payload מקודולר
   =============================== */
function waitForPayload() {
  try {
    const raw = window.AppInventor.getWebViewString();
    if (!raw) {
      return setTimeout(waitForPayload, 200);
    }
    payload = JSON.parse(raw);
  } catch (e) {
    return setTimeout(waitForPayload, 200);
  }

  loginToFirebase();
}

/* ===============================
   2️⃣ Firebase Auth
   =============================== */
function loginToFirebase() {
  if (!payload.email || !payload.password || !payload.token) {
    location.replace("forbidden.html");
    return;
  }

  firebase.auth()
    .signInWithEmailAndPassword(payload.email, payload.password)
    .then(cred => {
      uid = cred.user.uid;
      return validateToken();
    })
    .catch(() => {
      location.replace("forbidden.html");
    });
}

/* ===============================
   3️⃣ אימות token + שליפת username
   =============================== */
function validateToken() {
  return firebase.database()
    .ref("sessions/" + uid + "/token")
    .once("value")
    .then(snap => {
      if (!snap.exists() || snap.val() !== payload.token) {
        location.replace("forbidden.html");
        throw "invalid token";
      }

      return firebase.database()
        .ref("users/" + uid + "/username")
        .once("value");
    })
    .then(snap => {
      username = snap.val() || "משתמש";

      /* 🔔 נקודת כניסה להמשך */
      if (typeof loadPost === "function") loadPost();
      if (typeof listenComments === "function") listenComments();
    })
    .catch(() => {
      location.replace("forbidden.html");
    });
}