const create = document.querySelector('.create-new');
const input = document.querySelector('.file-input');
const photo = document.querySelector('.photo');
const title = document.getElementById('title-input');
const caption = document.getElementById('caption-input');
const image = document.querySelector('.file-input');
const cardSection = document.querySelector(".card-section");
const search = document.getElementById('search-input');
const show = document.querySelector('.show');
const favorites = document.querySelector('.favorites');
const titleCount = document.querySelector('.title-count');
const captionCount = document.querySelector('.caption-count');

const reader = new FileReader();
let cardArr = JSON.parse(localStorage.getItem('cards')) || [];
let favoriteArray = [];

favorites.addEventListener('click', favoriteFilter);
cardSection.addEventListener('click', buttonCheck);
cardSection.addEventListener('keydown', enterKey);
cardSection.addEventListener('focusout', textChange);
window.addEventListener('load', appendCards(cardArr));
create.addEventListener('click', createElement);
search.addEventListener('keyup', detectArray);
show.addEventListener('click', showButton);
title.addEventListener('keyup', enableButton);
caption.addEventListener('keyup', pCount);
input.addEventListener('change', enableButton);

function appendCards(array) {
  cardArr = []
  array.forEach(function (obj) {
    const card = new Card(obj.id, obj.title, obj.caption, obj.image, obj.favorite);
    cardArr.push(card);
  })
  checkTen();
}

function checkTen () {
  const tenArray = cardArr.slice(-10);
  favoriteAmount(), showCards(tenArray);
}

function showCards (array) {
  cardSection.innerHTML = '';
  array.forEach(card => newCard(card));
  checkAlbum();
}

function createElement(e) {
  e.preventDefault();
  if (input.files[0]) {
    reader.readAsDataURL(input.files[0]); 
    reader.onload = addCard
  }
}

function addCard(e) {
  const card = new Card(Date.now(), title.value, caption.value, e.target.result, false);
  cardArr.push(card)
  card.saveToStorage(cardArr);
  checkTen(), clearInputs(), enableButton();
}

function clearInputs () {
  titleCount.innerText = '';
  captionCount.innerText = '';
  title.value = '';
  caption.value = '';
  input.value = '';
}

function newCard(card) {
  cardSection.insertAdjacentHTML('afterbegin',
    `<article class="card" id="${card.id}">
      <section>
        <h3 class="title" contenteditable="true">${card.title}</h3>
      </section>
      <section class="photo">
        <img class="image" src="${card.image}">
      </section>
      <section>
        <p class="caption" contenteditable="true">${card.caption}</p>
      </section>
      <section class="two-buttons">
        <button class="trash"></button>
        <button class="heart-${card.favorite.toString()}"></button>
      </section>
    </article>`);
}

function buttonCheck (e) {
  e.preventDefault();
  const cardId = parseInt(e.target.parentElement.parentElement.id)
  const index = cardArr.findIndex(card => card.id === cardId);
  const targetButton = e.target.className
  if (targetButton === 'trash') deleteCard(cardId, index);
  if (targetButton === 'heart-true' || targetButton === 'heart-false') {
    favoriteUpdate(targetButton, index);
  }
}

function deleteCard(thisId, index) {
  cardArr[index].deleteFromStorage(index, cardArr);
  const wholeCard = document.getElementById(thisId);
  wholeCard.remove(), checkTen();
}

function favoriteUpdate (name, index) {
  name === 'heart-false' ? event.target.classList.replace('heart-false','heart-true') : cardArr[index].updateCard(false);
  name === 'heart-false' ? cardArr[index].updateCard(true) : event.target.classList.replace('heart-true', 'heart-false');
  favoriteAmount();
}

function favoriteFilter (e) {
  e.preventDefault();
  favoriteArray = cardArr.filter(card => card.favorite === true);
  showCards(favoriteArray);
  favDisplatBtn();
}

function favDisplatBtn () {
  if (favorites.innerText[8]) {
    favorites.innerText = "Show All";
    show.disabled = true;
  } else {
    show.disabled = false;
    favoriteAmount(), checkTen();
  }
}
 
function favoriteAmount () {
  let amount = 0;
  cardArr.forEach(card =>{
    if (card.favorite === true) amount++;
  })
  favorites.innerText = `View ${amount} Favorites`;
}

function enterKey (e) {
  const key = event.keyCode;
  if (key === 13) textChange(e);
}

function textChange (e) {
  e.preventDefault();
  const category = e.target.className;
  if (category !== 'trash') {
  const cardId = parseInt(e.target.parentElement.parentElement.id)
  const index = cardArr.findIndex(card => card.id === cardId);
  let newText = event.target.innerText;
  cardArr[index].updateCard(newText, category);
  }
}

function detectArray (e) {
  e.preventDefault();
  let arrayToFilter = [];
  favorites.innerText === "Show All" ? arrayToFilter = favoriteArray : arrayToFilter = cardArr;
  searchFilter(arrayToFilter, e);
}

function searchFilter (array, e) {
  let inputText = e.target.value.toLowerCase();
  let filteredArray = array.filter(function(card) {
      return card.title.toLowerCase().includes(inputText) || card.caption.toLowerCase().includes(inputText);
  })
  showCards(filteredArray);
}

function showButton (e) {
  e.preventDefault();
  show.innerText === "Show More" ? showCards(cardArr) : checkTen();
  show.innerText === "Show More" ? show.innerText = "Show Less" : show.innerText = "Show More";
}

function enableButton(e) {
  const titleLen = title.value.length;
  titleLen && input.files[0] ? create.disabled = false : create.disabled = true;
  if (e && e.target.id === 'title-input') h3Count(e); 
}

function h3Count (e) {
  let length = e.target.value.length;
  length > 0 ? titleCount.innerText = ` | Character Count ${length}` : titleCount.innerText = '';
  length > 18 ? titleCount.classList.add('over') : titleCount.classList.remove('over');
  if (length > 18) create.disabled = true;
}

function pCount (e) {
  let length = e.target.value.length;
  length > 0 ? captionCount.innerText = ` | Character Count ${length}` : captionCount.innerText = '';
  length > 60 ? captionCount.classList.add('over') : captionCount.classList.remove('over');
  if (length > 60) create.disabled = true;
}

function checkAlbum () {
  if (cardArr.length === 0) {
    cardSection.innerHTML = '<h2>Please Add an Image</h2>';
  }
}