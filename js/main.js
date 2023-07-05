import { initializeApp } from "firebase/app";
import { collection, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";

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

const marketingRef = collection(db, 'marketing-plan/todos/todo')
const marketDiv = document.querySelector(".marketing-plan")

const roadmapRef = collection(db, 'roadmap/roads/road')
const roadmapDiv = document.querySelector(".roadmap")

const platformRef = collection(db, 'platform-launch/platforms/platform')
const platformDiv = document.querySelector(".platform-launch")


function docsAdd(ref, div) {
    getDocs(ref)
        .then((snapshots) => {
            let data = []
            snapshots.docs.forEach((doc) => {
                data.push({...doc.data()})
            })
            let title = ref._path.segments[0];
            if(title === 'platform-launch'){
                div.innerHTML = `
                <div class='pre-plan'>
                    <h4 class='status'>TODO</h4>
                    <span style='background: #44C6E7'></span>
                </div>`
            } else if(title === 'marketing-plan'){
                div.innerHTML = `
                <div class='pre-plan'>
                    <h4 class='status'>DONE</h4>
                    <span style='background: #65DFAA'></span>
                </div>
                `
            } else {
                div.innerHTML = `
                <div class='pre-plan'>
                    <h4 class='status'>DOING</h4>
                    <span style='background: #645FC6'></span>
                </div>
                `
            }
            data.forEach((el) => {
                div.innerHTML += `
                <div class="plan">
                    <h4> ${el.title}</h4> <br /> 
                    <span> ${el.subtitle} </span> <br />
                </div>`
            })
    })
}
docsAdd(marketingRef, marketDiv)
docsAdd(roadmapRef, roadmapDiv)
docsAdd(platformRef, platformDiv)

let addTask = document.querySelector(".add-task")
let newTask = document.querySelector(".new-task")
let overlay = document.querySelector(".overlay")

overlay.addEventListener("click", () => {
    newTask.classList.remove("active")
    overlay.classList.remove("active")
})

addTask.addEventListener("click", () => {
    newTask.classList.add("active")
    overlay.classList.add("active")
})