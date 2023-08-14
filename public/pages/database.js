// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyCPO1U92qd2GEwBZHNMONmEoY9rGVWJmrs",
authDomain: "portfolio-taillow40.firebaseapp.com",
projectId: "portfolio-taillow40",
storageBucket: "portfolio-taillow40.appspot.com",
messagingSenderId: "195409349998",
appId: "1:195409349998:web:e2bf3059d0ad8cb929857f",
measurementId: "G-SKTE3WXYTQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
export function writeData(key, value) {
    set(ref(db, key),value);
}

export function readDatabase(path, callback){
    const dataRef = ref(db, path);
    onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        callback(data);
    });
}


