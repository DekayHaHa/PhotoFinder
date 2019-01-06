class Card {
  constructor (id, title, caption, image, favorite) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.image = image;
    this.favorite = false;
  }
  saveToStorage (array) {
    localStorage.setItem("cards", JSON.stringify(array));
  }
  deleteFromStorage (index) {
    cardArr.splice(index, 1);
    this.saveToStorage(cardArr);
  }
  updateCard (boolean) {
    this.favorite = boolean;
    this.saveToStorage(cardArr)
    console.log(cardArr)
  }
}