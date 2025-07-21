const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyA4eIpYUBjAPVUcxK-JcEYwmu6nKcrn7Lk",  // fallback for now
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "digital-offerings.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "digital-offerings",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "digital-offerings.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "992501647817",
    appId: process.env.FIREBASE_APP_ID || "1:992501647817:web:16fe0ccb14c0c3e3a04018"
  };
  
  export default firebaseConfig;