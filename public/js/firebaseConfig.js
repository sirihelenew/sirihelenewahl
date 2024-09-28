

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBxy0QD8ORm-kHd_U66v0uhbdy1TnKEwV4",
    authDomain: "sirihelenewahl.firebaseapp.com",
    projectId: "sirihelenewahl",
    storageBucket: "sirihelenewahl.appspot.com",
    messagingSenderId: "347857962806",
    appId: "1:347857962806:web:86fb0ee7948b739ca81597"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
