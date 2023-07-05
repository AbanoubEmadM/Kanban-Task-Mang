import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";

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

const dataRef = collection(db, `${window.location.href.split('#')[1]}`)

function fetchDocs(ref) {
    getDocs(ref)
        .then((snapshots) => {
            let data = []
            snapshots.docs.forEach((doc) => {
                data.push({...doc.data()})
            })
            let div = document.querySelector(`.data-handler`)
            let subDiv = `<div class='${ref._path.segments[1]}'></div>`
            div.innerHTML += subDiv;
            let div2 = document.querySelector(`.data-handler .${ref._path.segments[1]}`)
            let title = ref._path.segments[2].split('-')[0];
                    div2.innerHTML = `
                    <div class='pre-plan'>
                        <span class='${title}-span'></span>
                        <h4>${ref._path.segments[2].split('-')[0]}</h4>
                    </div>
                `
            data.forEach((item) => {
                let itemDiv = `
                    <div class='${ref._path.segments[2]}'>
                        <h4>${item.title}</h4>
                        <p>${item.subtitle}</p>
                    </div>
                        `
                    div2.innerHTML += itemDiv
            })
    })
}

function showDocs(path) {
    let ref1 = collection(db, `${path[0]}/todos/todo`)
    let ref2 = collection(db, `${path[0]}/done/done-todos`)
    let ref3 = collection(db, `${path[0]}/doing/doing-todos`)
    fetchDocs(ref1)
    fetchDocs(ref3)
    fetchDocs(ref2)
}
showDocs(dataRef._path.segments)

//change the link of db
let links = document.querySelectorAll("aside ul li a")

links.forEach((link) => {
    link.addEventListener("click", () => {
        setInterval(() => {
            window.location.reload()
        }, 300)
    })
})

// add new task
let addTask = document.querySelector(".add-task")
let newTask = document.querySelector(".new-task")
let overlay = document.querySelector(".overlay")
let createTask = document.querySelector(".create-task")
let options = document.querySelectorAll(".status option")
let allSelects = document.querySelectorAll(".status select")
let categoriesSelect = document.querySelector(".status select#categories").value
let statusSelect = document.querySelector(".status select#state").value
let title = document.querySelector(".title input")
let subTitle = document.querySelector(".subtasks input")

overlay.addEventListener("click", () => {
    newTask.classList.remove("active")
    overlay.classList.remove("active")
})

addTask.addEventListener("click", () => {
    newTask.classList.add("active")
    overlay.classList.add("active")
})

