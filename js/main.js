import { initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, query, setDoc, updateDoc } from "firebase/firestore";

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
const dataRef = collection(db, `${window.location.href.includes("#") ? window.location.href.split('#')[1] : 'marketing-plan'}`)

function fetchDocs(ref) {
    getDocs(ref)
        .then((snapshots) => {
            let data = []
            snapshots.docs.forEach((doc) => {
                data.push({...doc.data(),id:doc.id})
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
                    <div class='${ref._path.segments[2]} query' data-id='${item.id}'>
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
let title = document.querySelector(".title input")
let subTitle = document.querySelector(".subtasks input")

overlay.addEventListener("click", () => {
    newTask.classList.remove("active")
    showQuery.classList.remove("active")
    overlay.classList.remove("active")
    newBoard.classList.remove('active')
})

addTask.addEventListener("click", () => {
    newTask.classList.add("active")
    overlay.classList.add("active")
})

createTask.addEventListener("click", () => {
    let categoryPath = document.querySelector("#categories").value;
    let subCategoryPath = document.querySelector("#state").value;
    if(title.value&&subTitle.value){
        addDoc(collection(db, `${categoryPath}/${subCategoryPath}`), {
            title: title.value,
            subtitle: subTitle.value,
        })    
    }
})

//handle show query
let showQuery = document.querySelector(".show-query");
setTimeout(() => {
    let allQueries = document.querySelectorAll(".query")
    allQueries.forEach(query => {
        query.addEventListener("click", () => {
            showQuery.classList.add("active")
            showQuery.innerHTML = query.innerHTML;
            overlay.classList.add("active");
            switch(query.parentElement.className) {
                case 'todos': 
                    showQuery.innerHTML += `
                    <p>Status: </p>
                    <select>
                        <option value='todos/todo' selected>Todo</option>
                        <option value='doing/doing-todos'>Doing</option>
                        <option value='done/done-todos'>Done</option>
                    </select>
                    <button id='add'><h4>Add New Changes</h4> </button>
                    <button id='delete'><h4>Delete</h4></button>`
                    break;
                case 'doing':
                    showQuery.innerHTML += `
                    <p>Status: </p>
                    <select>
                        <option value='todos/todo' >Todo</option>
                        <option value='doing/doing-todos'selected>Doing</option>
                        <option value='done/done-todos'>Done</option>
                    </select>
                    <button id='add'><h4>Add New Changes</h4> </button>
                    <button id='delete'><h4>Delete</h4></button>`
                break;
                case 'done':
                    showQuery.innerHTML += `
                    <p>Status: </p>
                    <select>
                        <option value='todos/todo' >Todo</option>
                        <option value='doing/doing-todos'>Doing</option>
                        <option value='done/done-todos'selected>Done</option>
                    </select>
                    <button id='add'><h4>Add New Changes</h4> </button>
                    <button id='delete'><h4>Delete</h4></button>`
                break;
            }   
            let addCh = document.querySelector(".show-query #add");
            let delDoc = document.querySelector(".show-query #delete");
            let queryStatus = document.querySelector(".show-query select");
            let queryTitle = document.querySelector(".show-query h4");
            let querySubTitle = document.querySelector(".show-query p");
            let curruntPath = `${window.location.href.includes("#") ? window.location.href.split('#')[1] : 'platform-launch'}/${queryStatus.value}`
            
            addCh.addEventListener("click",() => {
                localStorage.setItem('currentStatus', queryStatus.value)
                let instantPath = `${window.location.href.includes("#") ? window.location.href.split('#')[1] : 'platform-launch'}/${localStorage.getItem("currentStatus")}`
                addDoc(collection(db, instantPath), {
                    title: queryTitle.innerHTML,
                    subtitle: querySubTitle.innerHTML,
                }).then(() => {
                    deleteDoc(doc(db, `${curruntPath}/${query.dataset.id}`)).then(() => location.reload())
                })
            })
            delDoc.addEventListener("click", () => {
                deleteDoc(doc(db, `${curruntPath}/${query.dataset.id}`)).then(() => location.reload())
            })
        })
    })
}, 1000)
let boards = document.querySelectorAll("aside li");
console.log(boards.length);
/*
boards[0].classList.add("active")
console.log(window.location.href.split('#')[1]);
boards.forEach((board) => {
    board.addEventListener("click", () => {
        boards.forEach((board) => board.classList.remove("active"))
        board.classList.add("active")
    })
})
*/
let boardsLength = document.querySelector("aside p");
boardsLength.innerHTML += ` (${boards.length})`
document.querySelector(`li.${window.location.href.includes("#") ? window.location.href.split('#')[1] : 'platform-launch'}`).classList.add("active")

let addBoard = document.querySelector(".create-new-board");
let newBoard = document.querySelector('.new-board')
let boardName = document.querySelector(".new-board input")

addBoard.addEventListener("click", () => {
    newBoard.classList.add("active")
    overlay.classList.add("active")
})

let createBoard = document.querySelector(".new-board button")

createBoard.addEventListener("click", () => {
    console.log(boardName.value);
    addDoc(collection(db,`${boardName.value}/todos/todo/`),{
        name:'test',
        age: '01'
    }).then(() => {
        addDoc(collection(db,`${boardName.value}/doing/doing-todos`),{})
        addDoc(collection(db,`${boardName.value}/done/done-todos`),{})
    })

})