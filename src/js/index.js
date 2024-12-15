import "../css/styles.scss";

let dataSlider = [{
    url: "images/banner-1.png"
  }, {
    url: "images/banner-2.png"
  }, {
    url: "images/banner-3.png"
}];

// Проверяем, что массив возвращает объекты
function initSlider(options) {
    if (!dataSlider || !dataSlider.length) return;


  options = options || {
    dots: true,
  };

  let sliderImages = document.querySelector(".slider-section__photo-area"),
      sliderDots = document.querySelector(".slider-section__slider_dots");
  

  initImages();
  initAutoplay();
  
  if (options.dots) {
    initDots();
  }

  function initImages() {
    dataSlider.forEach((image, index) => {
      let imageDiv = `<img class="slider-section__photo n${index} ${index === 0? "active" : ""}" src="${dataSlider[index].url}" data-index="${index}" alt="Изображение в слайдере">`;
      sliderImages.innerHTML += imageDiv;
    });
  }
  
  function initDots() {
    dataSlider.forEach((image, index) => {
      let dot = `<div class="slider-section__slider_dots_dot n${index} ${index === 0? "active" : ""}" data-index="${index}"></div>`;
      sliderDots.innerHTML += dot;
    });
    sliderDots.querySelectorAll(".slider-section__slider_dots_dot").forEach(dot => {
      dot.addEventListener("click", function() {
        moveSlider(this.dataset.index);
      })
    })
  }

  function moveSlider(num) {
    sliderImages.querySelector(".active").classList.remove("active");
    sliderImages.querySelector(".n" + num).classList.add("active");
    if (options.dots) {
      sliderDots.querySelector(".active").classList.remove("active");
      sliderDots.querySelector(".n" + num).classList.add("active");
    }
  }

  function initAutoplay() {
    setInterval(() => {
        let curNumber = +sliderImages.querySelector(".active").dataset.index;
        let nextNumber;
        nextNumber = curNumber === dataSlider.length - 1? 0 : curNumber + 1;
        moveSlider(nextNumber);
    }, options.autoplayInterval);
  }
  
}

let sliderOptions = {
  dots: true,
  autoplayInterval: 5000
};

document.addEventListener("DOMContentLoaded", function() {
  initSlider(sliderOptions);
});

// ------------------- render
let noImage = "images/no_photo.png";
let ratingStarFilled = "images/star-filled.svg";
let ratingStar = "images/star.svg";

const renderBooksList = (data, clearNode) => {
  let targetNode = document.querySelector('.books-section__books-cards');
  
  if (clearNode) {
    targetNode.innerHTML = '';
  }

  data.items.forEach(item => {
  
    let thumbnailData = null;
    let bookId = item.id;
  
    let authorsNode ='';
    let titleNode = '';
    let ratingNode = '';
    let descriptionNode = '';
    let priceNode = '';
    let productHtml = '';

    if (item.volumeInfo.imageLinks) {
      thumbnailData = item.volumeInfo.imageLinks.thumbnail;
    } else {
      thumbnailData = noImage;
    }

    if (item.volumeInfo.authors) {
      let authorsListData = item.volumeInfo.authors;
      let output = '';

      authorsListData.forEach((item, index, arr) => {
        if (index === arr.length - 1) {
          output += `${item}`;
        } else {
          output += `${item}, `;
        }
      });

      authorsNode = `<div class="book-card__authors" data-book-info="author">${output}</div>`;
    }

    if (item.volumeInfo.title) {
      let titleData = item.volumeInfo.title;
      titleNode = `<div class="book-card__title" data-book-info="title">${titleData}</div>`;
    }

    if (item.volumeInfo.averageRating) {
      let ratingsCountData = item.volumeInfo.ratingsCount;
      ratingNode = `<div class="book-card__rating">
                      <div class="book-card__stars">
                        <img src=${ratingStarFilled} alt="Icon" class="star">
                        <img src=${ratingStarFilled} alt="Icon" class="star">
                        <img src=${ratingStarFilled} alt="Icon" class="star">
                        <img src=${ratingStar} alt="Icon" class="star">
                        <img src=${ratingStar} alt="Icon" class="star">
                      </div>
                      <div class="book-card__review-counter">${ratingsCountData} review</div>
                    </div>`;
    }

    if (item.volumeInfo.description && item.volumeInfo.description.length > 90) {
      let descriptionData = item.volumeInfo.description;
      let description = descriptionData.slice(0, 91) + '...';
      descriptionNode = `<div class="book-card__description" data-book-info="description">${description}</div>`;
    } else if (item.volumeInfo.description) {
      let descriptionData = item.volumeInfo.description;
      descriptionNode = `<div class="book-card__description" data-book-info="description">${descriptionData}</div>`;
    }

    if (item.saleInfo.listPrice) {

      let priceData = item.saleInfo.listPrice.amount;
      const currency = 99;
      let priceValue = Math.floor(priceData * 100 / currency) / 100;

      priceNode = `<div class="book-card__price">
                    <span class="book-card__currency">$</span><span class="book-card__value" data-book-info="price">${priceValue}</span>
                  </div>`;
    }

    productHtml = `<div class="book-card">
                      <img src="${thumbnailData}" alt="Обложка книги" class="book-card__image" data-book-info="thumbnail">
                      <div class="book-card__info">
                        ${authorsNode}
                        ${titleNode}
                        ${ratingNode}
                        ${descriptionNode}
                        ${priceNode}
                        <button class="book-card__button button" data-book-info="id" data-bookid="${bookId}">Buy now</button>
                      </div>
                    </div>`;

    targetNode.insertAdjacentHTML('beforeend', productHtml);
  });
};

// ------------------ main
const loadButton = document.querySelector('.btn-load');
const categories = document.querySelectorAll('.navigation-books-menu__item');
const url = 'https://www.googleapis.com/books/v1/volumes';
const apiKey = 'AIzaSyBj5qKUUjQKUTInaKHxvhLjwEZI1qbeFUU';
const httpRequestParam = {
  category: 'Architecture',
  startIndex: 0,
  maxResults: 6,
  langRestrict: 'en',
};

const selectCategory = (category) => {
  let currentCategoryNode = document.querySelector('.navigation-books-menu__item_active');
  let newCategoryNode = category;

  currentCategoryNode.classList.remove('navigation-books-menu__item_active');
  newCategoryNode.classList.add('navigation-books-menu__item_active');
};

const getHttpRequestParam = (resetStartIndex) => {
  let currentCategoryNode = document.querySelector('.navigation-books-menu__item_active');
  let currentCategoryName = currentCategoryNode.dataset.category;

  httpRequestParam.category = currentCategoryName;

  if (resetStartIndex === true) {
    httpRequestParam.startIndex = 0;
  }

  return httpRequestParam;
};

const useRequest = (url, getParam, callback, clearNode) => {
  let link = `${url}?q="subject:${httpRequestParam.category}"&${apiKey}&printType=books&startIndex=${httpRequestParam.startIndex}&maxResults=${httpRequestParam.maxResults}&langRestrict=${httpRequestParam.langRestrict}`;

  fetch(link)
  .then(response => response.json())
  .then((data) => {
    callback(data, clearNode);
  })
  .catch(err => console.log(err.message));
};

categories.forEach(category => category.addEventListener('click', (event) => {
  event.preventDefault();

  selectCategory(category);

  const getParam = getHttpRequestParam(true);


  useRequest(url, getParam, renderBooksList, true);
}));

// loadButton.addEventListener('click', () => {
//   const getParam = getHttpRequestParam();

//   getParam.startIndex += 6;

//   useRequest(url, getParam, renderBooksList, false);
// });

useRequest(url, httpRequestParam, renderBooksList, false);
