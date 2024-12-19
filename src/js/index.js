import "../css/styles.scss";
import { initSlider, sliderOptions } from "./slider";
import {currentPage, countBooks, activeCategory, cartStorage, contentWrapper, btnMore, showBooks} from "./books-section";

// Slider initialization
document.addEventListener("DOMContentLoaded", function() {
  initSlider(sliderOptions);
});

// Book section initialization
showBooks();

// cart
document.querySelector(".header__buttons__cart-count").textContent = cartStorage.length;

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("book-card__button")) {
    const id = event.target.dataset.id;
    if (cartStorage.includes(id)) {
      cartStorage.splice(cartStorage.indexOf(id), 1);
      event.target.innerText = "BUY NOW";      
    } else {
      cartStorage.push(id);
      event.target.innerText = "IN THE CART";
    }
    localStorage.setItem("cart", JSON.stringify(cartStorage));
    document.querySelector(".header__buttons__cart-count").textContent = cartStorage.length;    
  }  
});


// categories
contentWrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("navigation-books-menu__item")) {
    contentWrapper.querySelector(".navigation-books-menu__item.navigation-books-menu__item_active") ?.classList?.remove("navigation-books-menu__item_active");
    e.target.classList.add("navigation-books-menu__item_active");
    contentWrapper.querySelector(".books-section__books-cards").innerHTML = "";
    activeCategory = e.target.innerText;
    currentPage = 0;
    showBooks();
  }
})

btnMore.addEventListener("click", (e) => {
  currentPage += countBooks;
  showBooks()
})