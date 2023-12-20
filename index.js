import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, where, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const colRef = collection(db, "bookmarks");

function deleteEvent() {
    const deleteBtns = document.querySelectorAll("i.delete");
    deleteBtns.forEach(btn => {
        btn.addEventListener("click", event => {
            const deleteRef = doc(db, "bookmarks", btn.dataset.id);
            deleteDoc(deleteRef)
            .then(() => {
                btn.parentElement.parentElement.parentElement.remove();
            });
        });
    });
}


function generateTemplate(response, id) {
    return `<div class="card">
                <p class="title">${response.title}</p>
                <div class="sub-info">
                    <p>
                        <span class="category ${response.category}">${response.category[0].toUpperCase()}${response.category.slice(1)}</span>
                    </p>
                    <a href="${response.link}" target="_blank"><i class="bi bi-box-arrow-up-right website"></i></a>
                    <a href="https://www.google.com/search?q=${response.title}" target="_blank"><i class="bi bi-google search"></i></a>
                    <span><i class="bi bi-trash delete" data-id="${id}"></i></span>
                </div>
            </div>`;
}

const cards = document.querySelector(".cards");

function showCard(docsRef) {
    cards.innerHTML = "";
    getDocs(docsRef)
    .then(data => {
        data.docs.forEach(document => {
            cards.innerHTML += generateTemplate(document.data(), document.id);
        });
        deleteEvent();
    })
    .catch(error => console.log(error));
}
showCard(colRef);

const addForm = document.querySelector(".add");
addForm.addEventListener("submit", event => {
    event.preventDefault();
    addDoc(colRef, {
        link: addForm.link.value,
        title: addForm.title.value,
        category: addForm.category.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addForm.reset()
        showCard(colRef);
    });
});

const categoryList = document.querySelector(".category-list");
const categorySpan = document.querySelectorAll(".category-list span");
categoryList.addEventListener("click", event => {
    if (event.target.tagName === "SPAN") {
        event.target.innerText === "All" 
            ? showCard(colRef) 
            : showCard(query(colRef, where("category", "==", event.target.innerText.toLowerCase())));
        categorySpan.forEach(span => span.classList.remove("active"));
        event.target.classList.add("active");
    }
});