var create = document.querySelector('.create-new');
var input = document.querySelector('.file-input');
var photo = document.querySelector('.photo');
var title = document.getElementById('title-input');
var caption = document.getElementById('caption-input');
var image = document.querySelector('.file-input');
var cardSection = document.querySelector(".card-section");
var search = document.getElementById('search-input');
var show = document.querySelector('.show');
var cardArr = JSON.parse(localStorage.getItem('cards')) || [];
var reader = new FileReader();

cardSection.addEventListener('click', buttonCheck);
cardSection.addEventListener('keydown', enterKey);
cardSection.addEventListener('focusout', textChange);
window.addEventListener('load', appendCards(cardArr));
create.addEventListener('click', createElement);
search.addEventListener('keyup', searchFilter);
show.addEventListener('click', showButton)

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
  favoriteAmount();
  showCards(tenArray);
}

function showCards (array) {
  clearCards();
  array.forEach(card => newCard(card));
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
  checkTen();
}

function newCard(card) {
  cardSection.insertAdjacentHTML('afterbegin',
    `<article class="card" id="${card.id}">
      <section>
        <h3 class="title" contenteditable='true'>${card.title}</h3>
      </section>
      <section class="photo">
        <img class="image" src="${card.image}">
      </section>
      <section>
        <p class="caption" contenteditable='true'>${card.caption}</p>
      </section>
      <section class="two-buttons">
        <div class="trash"></div>
        <div class="heart-${card.favorite.toString()}"></div>
      </section>
    </article>`);
}

function clearCards () {
  cardSection.innerHTML = '';
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
  cardArr[index].deleteFromStorage(index);
  const wholeCard = document.getElementById(thisId);
  wholeCard.remove();
  checkTen();
}

function favoriteUpdate (name, index) {
  if (name === 'heart-false') {
    event.target.classList.replace('heart-false','heart-true');
    cardArr[index].updateCard(true);
  } else if (name === 'heart-true') {
    event.target.classList.replace('heart-true', 'heart-false');
    cardArr[index].updateCard(false);
  }
  favoriteAmount();
}

function favoriteFilter () {
  const favoriteArray = cardArr.filter(card => card.favorite === true);
  filteredCards(favoriteArray);
}
 
function favoriteAmount () {
  let amount = 0;
  cardArr.forEach(card =>{
    if (card.favorite === true) {
      amount++
    }
  })
  document.querySelector('.favorite-amount').innerText = amount;
}

function enterKey (e) {
  e.preventDefault();
  const key = event.keyCode;
  if (key === 13) textChange(e);
}

function textChange (e) {
  // e.preventDefault();
  const cardId = parseInt(e.target.parentElement.parentElement.id)
  const index = cardArr.findIndex(card => card.id === cardId);
  const category = e.target.className;
  // console.log(cardId);
  let newText = event.target.innerText;
  console.log(category, newText);
  cardArr[index].updateCard(newText, category);
}

function searchFilter (e) {
  let inputText = e.target.value;
  inputText = inputText.toLowerCase();
  let filteredArray = cardArr.filter(function(card) {
    if (card.title.toLowerCase().includes(inputText) || card.caption.toLowerCase().includes(inputText)) {
      return card;
    }
  })
  filteredCards(filteredArray);
}

function showButton (e) {
  e.preventDefault();
  if (show.innerText === "Show More") {
    showCards(cardArr);
    show.innerText = "Show Less";
  } else {
    checkTen();
    show.innerText = "Show More";
  }
}

// document.querySelector(".save-button").addEventListener("click", ideaClass);
// document.querySelector('.filter-buttons-section').addEventListener('click', buttonDetect);
// window.addEventListener("load", cardPersist);
// var ideaArray = []; 

// function cardPersist() {
//   Object.keys(localStorage).forEach(function(card){
//     var item = JSON.parse(localStorage.getItem(card)); 
//     var newIdea = new Idea(item.id, item.title, item.body, item.quality);  
//     ideaArray.push(newIdea);
//     newCard(newIdea);
//   });
// }

// function ideaClass() {
//   var titleInput = document.getElementById("title-input");
//   var bodyInput = document.getElementById("body-input");
//   var newIdea = new Idea(Date.now(), titleInput.value, bodyInput.value);
//   ideaArray.push(newIdea); 
//   newIdea.saveToStorage();
//   newCard(newIdea);
//   clearFields();
// }

// function newCard(idea) {
//   var cardSection = document.querySelector(".card-section");
//   cardSection.insertAdjacentHTML('afterbegin',
//     `<article class="card"  id="${idea.id}">
//     <h2 class="title" data-id="${idea.id}" contenteditable="true" onfocusout="cardChange('title')" onkeydown="enterKey('title')">${idea.title}</h2>
//     <p class="body" data-id="${idea.id}" contenteditable="true" onfocusout="cardChange('body')" onkeydown="enterKey('body')">${idea.body}</p>
//     <section class="button-corral">
//     <div class="vote">
//     <img class="downvote" onclick="qualityChangeDown(${idea.id})" src="images/downvote.svg">
//     <img class="upvote" onclick="qualityChangeUp(${idea.id})" src="images/upvote.svg">
//     <p class="quality-text">Quality: <span id="quality">${idea.quality}</span></p>
//     </div>
//     <img class="delete" data-id="${idea.id}" onclick="deleteCard(${idea.id})" src="images/delete.svg">
//     </section>
//     </article>`);
// }

// function clearFields() {
//   var titleInput = document.getElementById("title-input");
//   var bodyInput = document.getElementById("body-input");
//   let bodyCount = document.querySelector(".body-count");
//   let titleCount = document.querySelector(".title-count");
//   bodyCount.innerText = "";
//   titleCount.innerText = "";
//   titleInput.value = "";
//   bodyInput.value = "";
// }

// function enterKey (category) {
//   let key = event.keyCode;
//   if (key === 13) { 
//     cardChange(category);
//   }
// }

// function deleteCard(thisId) {
//   console.log(thisId)
//   let cardDelete = ideaArray.find(idea => idea.id === thisId);
//   let index = ideaArray.findIndex(idea => idea.id === thisId);
//   ideaArray.splice(index,1);
//   let wholeCard = document.getElementById(thisId.toString());
//   wholeCard.remove();
//   cardDelete.deleteFromStorage();
// }

// function qualityChangeDown(cardId) {
//   let card = ideaArray.find(idea => idea.id === cardId);
//   let quality = card.quality;
//   if (quality === "plausible") {
//     card.updateQuality(0);
//     event.target.parentElement.childNodes[5].childNodes[1].innerText = "swill";
//   }
//   if (quality === "genius") {
//     card.updateQuality(1);
//     event.target.parentElement.childNodes[5].childNodes[1].innerText = "plausible";
//   }
// }

// function qualityChangeUp(cardId) {
//   let card = ideaArray.find(idea => idea.id === cardId);
//   let quality = card.quality;
//   if (quality === "swill") {
//     card.updateQuality(1);
//     event.target.parentElement.childNodes[5].childNodes[1].innerText = "plausible";
//   }
//   if (quality === "plausible") {
//     card.updateQuality();
//     event.target.parentElement.childNodes[5].childNodes[1].innerText = "genius";
//   }
// }

// function cardChange(category) {
//     let cardId = JSON.parse(event.target.dataset.id);
//     let card = ideaArray.find(idea => idea.id === cardId);
//     let newText = event.target.innerText;
//     card.updateContent(newText, category);
// }

// function searchFilter (text) {
//   let filteredArray = ideaArray.filter(function(idea) {
//     let inputText = text.toLowerCase();
//     if (idea.title.toLowerCase().includes(inputText) || idea.body.toLowerCase().includes(inputText)) {
//       return idea;
//     }
//   })
//   clearCards();
//   filteredIdeas(filteredArray);
// }

// function clearCards () {
//   var cardSection = document.querySelector(".card-section");
//   cardSection.innerHTML = "";
// }

// function filteredIdeas (array) {
//   array.forEach(function (idea) {
//     newCard(idea);
//   })
// }

// function showButton () {
//   event.preventDefault();
//   var cardHolder = document.getElementById("max-height");
//   if (event.target.innerText === "Show More") {
//     cardHolder.classList.remove("max-height");
//     event.target.innerText = "Show Less";
//   } else {
//     cardHolder.classList.add("max-height")
//     event.target.innerText = "Show More"
//   }
// }


// function characterCount (value) {
//   let bodyCount = document.querySelector(".body-count");
//   let titleCount = document.querySelector(".title-count");
//   if (event.target.id === "body-input") {
//     value.length === 0 ? bodyCount.innerText = "" : bodyCount.innerText = ` | Character Count ${value.length}`;
//   } 
//   if (event.target.id === "title-input") {
//     value.length === 0 ? titleCount.innerText = "" : titleCount.innerText = ` | Character Count ${value.length}`;
//   }
// }

// function buttonDetect(e) {
//   e.preventDefault();
//     var targetButton = event.target
//     if (targetButton.innerText === 'Swill') {
//       qualityFilter('swill');
//       }
//     if (targetButton.innerText === 'Plausible') {
//       qualityFilter('plausible');
//     }
//     if (targetButton.innerText === 'Genius') {
//       qualityFilter('genius');
//     }
//     if (targetButton.innerText === 'Reset') {
//     clearCards();  
//     filteredIdeas(ideaArray);  
//   }
// }
//   function qualityFilter(type) {
//   let filteredArray = ideaArray.filter(function(idea) {
//     if (idea.quality === type) {
//       return idea; 
//     } 
//   })
//   clearCards();
//   filteredIdeas(filteredArray);
// }