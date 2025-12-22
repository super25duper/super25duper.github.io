console.log("🔥 SW VERSION 2 WITH ICON 🔥");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyAb6crKn7LDVhYtFMUtErtZNKEL6lfW5pA",
  authDomain: "bigone-86490.firebaseapp.com",
  projectId: "bigone-86490",
  messagingSenderId: "543555505186",
  appId: "1:543555505186:web:46f992f414561830b50e7b"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  return self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,

    // ✅ אייקון פורום
    icon: "icons/forum-192.png",

    // ✅ badge
    badge: "icons/badge-72.png",

    data: payload.data || {}
  });
});

