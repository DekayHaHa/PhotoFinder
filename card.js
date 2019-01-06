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
  deleteFromStorage (index, array) {
    array.splice(index, 1);
    this.saveToStorage(array);
  }
  updateCard (array, boolean) {
    this.favorite = boolean;
    this.saveToStorage(array)
  }
}