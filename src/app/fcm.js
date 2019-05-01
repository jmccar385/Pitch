importScripts('www.gstatic.com/firebasejs/<insert-version-here>/firebase-app.js');
importScripts('www.gstatic.com/firebasejs/<insert-version-here>/firebase-messaging.js');

firebase.initializeApp({
'messagingSenderId': '82436193294'
});

const messaging = firebase.messaging();