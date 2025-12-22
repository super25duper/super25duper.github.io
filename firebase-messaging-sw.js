console.log("🔥 SW VERSION 3 WITH ICON + HEADS UP 🔥");

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

messaging.setBackgroundMessageHandler(function (payload) {
  const title = payload.notification?.title || "פורום";
  const body  = payload.notification?.body  || "";

  return self.registration.showNotification(title, {
    body,

    // ✅ אייקונים
    icon: "./icons/forum-192.png",
    badge: "./icons/badge-72.png",

    // 🔔 ניסיון לגרום ל-Heads-Up
    requireInteraction: true,
    renotify: true,
    tag: "forum-alert",

    // מידע פנימי
    data: payload.data || {}
  });
});

// לחיצה על ההתראה
self.addEventListener("notificationclick", event => {
  event.notification.close();

  const url =
    event.notification.data?.clickUrl || "./forum.html";

  event.waitUntil(
    clients.openWindow(url)
  );
});