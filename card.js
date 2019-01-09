class Card {
  constructor (id, title, caption, image, favorite) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.image = image;
    this.favorite = favorite || false;
  }
  saveToStorage (array) {
    localStorage.setItem("cards", JSON.stringify(array));
  }
  deleteFromStorage (index, array) {
    array.splice(index, 1);
    this.saveToStorage(array);
  }
  updateCard (para1, para2) {
    para2 === undefined ? this.favorite = para1 : this[para2] = para1;
    this.saveToStorage(cardArr);
  }
}