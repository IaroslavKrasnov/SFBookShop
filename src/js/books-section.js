const key = "AIzaSyBj5qKUUjQKUTInaKHxvhLjwEZI1qbeFUU";

let currentPage = 0;
const countBooks = 6;
let activeCategory = document.querySelector(".navigation-books-menu__item.navigation-books-menu__item_active").innerText;

const cartStorage = JSON.parse(localStorage.getItem("cart") ?? "[]");
// document.querySelector(".header__buttons__cart-count").textContent = cartStorage.length;
const contentWrapper = document.querySelector(".main");
const btnMore = contentWrapper.querySelector(".button.button_load");



const getBooks = (startPage, countBooks) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q="subject:${activeCategory}"&${key}&printType=books&startIndex=${startPage}&maxResults=${countBooks}&langRestrict='en'`)
  .then((response) => response.json())
  .then((json) => json["items"])
  .catch(() => console.log(error));
};

const showBooks = async () => {
  let books = await getBooks(currentPage * countBooks, countBooks);
  currentPage++;
  books.forEach((book) => {
    let img = book.volumeInfo.imageLinks?.thumbnail ?? "images/no_photo.png";
    let author = book.volumeInfo.authors;
    let title = book.volumeInfo.title;
    let averageRating = book.volumeInfo?.averageRating ?? "";
    let ratingsCount = book.volumeInfo?.ratingsCount ?? "";
    let description = book.volumeInfo?.description ?? "";
    let saleAbility = book.saleInfo.saleability;
    let price = "Unavailable";
    let priceType = "";

    if (saleAbility === "FOR_SALE") {
      price = book.saleInfo.retailPrice?.amount;
      priceType = book.saleInfo.retailPrice?.currencyCode;    
    }

    const newBook = `<article class = "book-card">
        <img class = "book-card__image" src = "${img}" alt = "Обложка книги"/>
        <div class = "book-card__info">
          <div class="book-card__authors">${author}</div>
          <div class="book-card__title">${title}</div>
          <div class="book-card__rating">
              <div class="book-card__star-counter">${averageRating}</div>
              <img class ="book-card__star-image" src = "images/star-filled.svg" alt = "Иконка звезды рейтинга"/>
              <div class="book-card__review-counter">${ratingsCount}</div>
              <div class="book-card__review-counter-text">review</div>
          </div>
          <div class="book-card__description">${description}</div>
          <div class="book-card__price">
              <div class="book-card__currency">${priceType}</div>
              <div class="book-card__value">${price}</div>
          </div>
          <button class = "button book-card__button" data-id = "${book.id}">${cartStorage.includes(book.id) ? "IN THE CARD" : "BUY NOW"}</button> 
        </div>           
    </article>`;

    document.querySelector(".books-section__books-cards").innerHTML += newBook;

  })
}

export {currentPage, countBooks, activeCategory, cartStorage, contentWrapper, btnMore, showBooks};