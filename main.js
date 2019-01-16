const input = document.querySelector('.file-input');

const reader = new FileReader();
let cardArr = JSON.parse(localStorage.getItem('cards')) || [];
let favoriteArray = [];

$('.favorites').click(favoriteFilter);
$(".card-section").on({
  "click": buttonCheck,
  "keydown": enterKey,
  "focusout": textChange
})
.on('load', appendCards(cardArr));
$('.create-new').click(createElement);
$('#search-input').keyup(detectArray);
$('.show').click(showButton);
$('#title-input').keyup(enableButton);
$('#caption-input').keyup(pCount);
$('.file-input').change(enableButton);

function appendCards(array) {
  cardArr = [];
  array.forEach(obj => {
    const card = new Card(obj.id, obj.title, obj.caption, obj.image, obj.favorite);
    cardArr.push(card);
  })
  checkTen();
}

function checkTen () {
  const tenArray = cardArr.slice(-10);
  favoriteAmount();
  showCards(tenArray);
}

function showCards (array) {
  $(".card-section").html('');
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
  const card = new Card(Date.now(), $('#title-input').val(), $('#caption-input').val(), e.target.result, false);
  cardArr.push(card)
  card.saveToStorage(cardArr);
  checkTen();
  clearInputs(); 
  enableButton();
}

function clearInputs () {
  $('.title-count, .caption-count').text('');
  $('input').val('');
}

function newCard(card) {
  $('.card-section').prepend(
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
  const wholeCard = $(thisId);
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
  if ($('.favorites').text()[8]) {
    $('.favorites').text('Show All');
    $('.show').prop('disabled', true);
  } else {
    $('.show').prop('disabled', false);
    favoriteAmount(), checkTen();
  }
}
 
function favoriteAmount () {
  let amount = 0;
  cardArr.forEach(card =>{
    if (card.favorite === true) amount++;
  })
  $('.favorites').text(`View ${amount} Favorites`);
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
  $('.favorites').text() === "Show All" ? arrayToFilter = favoriteArray : arrayToFilter = cardArr;
  searchFilter(arrayToFilter, e);
}

function searchFilter (array, e) {
  let inputText = e.target.value.toLowerCase();
  let filteredArray = array.filter(card => {
      return card.title.toLowerCase().includes(inputText) || card.caption.toLowerCase().includes(inputText);
  })
  showCards(filteredArray);
}

function showButton (e) {
  e.preventDefault();
  $('.show').text() === "Show More" ? showCards(cardArr) : checkTen();
  $('.show').text() === "Show More" ? $('.show').text("Show Less"): $('.show').text("Show More");
}

function enableButton(e) {
  const titleLen = $('#title-input').val().length
  titleLen && input.files[0] ? $('.create-new').prop('disabled', false): $('.create-new').prop('disabled', true);
  if (e && e.target.id === 'title-input') h3Count(e); 
}

function h3Count (e) {
  let length = e.target.value.length;
  length > 0 ? $('.title-count').text(` | Character Count ${length}`): $('.title-count').text(``);
  length > 18 ? $('.title-count').addClass('over') : $('.title-count').removeClass('over');
  if (length > 18) $('.create-new').prop('disabled', true);
}

function pCount (e) {
  let length = e.target.value.length;
  length > 0 ? $('.caption-count').text(` | Character Count ${length}`): $('.caption-count').text(``);
  length > 60 ? $('.caption-count').addClass('over') : $('.caption-count').removeClass('over');
  if (length > 60) $('.create-new').prop('disabled', true);
}

function checkAlbum () {
  if (cardArr.length === 0) {
    $('card-section').html('<h2>Please Add Image</h2>');
  }
}