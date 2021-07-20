import { initializeApp } from "firebase/app"

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_fzQ0fa0HhERlJY7JKxcvKQwQp-FX4Nw",
    authDomain: "firabase-backend-api.firebaseapp.com",
    projectId: "firabase-backend-api",
    storageBucket: "firabase-backend-api.appspot.com",
    messagingSenderId: "1085194560778",
    appId: "1:1085194560778:web:c2857153b65c4a635306f3"
};

export const firebaseApp = initializeApp(firebaseConfig);