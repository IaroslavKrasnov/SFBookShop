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