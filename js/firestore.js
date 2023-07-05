import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
    apiKey: "AIzaSyBUCXJMtM7GYvV379BNQ4uEF7abtNKurak",
    authDomain: "kanban-de58b.firebaseapp.com",
    projectId: "kanban-de58b",
    storageBucket: "kanban-de58b.appspot.com",
    messagingSenderId: "991286409819",
    appId: "1:991286409819:web:53dcbcbec6b73934d0dd7e",
    measurementId: "G-VW7ZHWFHJ8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const colRef = collection(db, 'roadmap')
getDocs(colRef)
    .then((snapshots) => {
        console.log(snapshots.docs);
    })