// Banners
function getBanners(callback) {
  // Creating Our XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Making our connection
  var url = "http://localhost:3002/banners";
  xhr.open("GET", url, true);

  // function execute after request is successful
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseText);
    }
  };
  // Sending our request
  xhr.send();
}

var banners = getBanners(function (responseBanners) {
  var banners = JSON.parse(responseBanners);
  console.log(banners);
  var carouselItems = document.querySelectorAll(".carousel-item");
  console.log(carouselItems);

  for (let i = 0; i < banners.length; i++) {
    let carouselImage = document.createElement("img");
    carouselImage.src = banners[i].bannerImageUrl;
    carouselImage.alt = banners[i].bannerImageAlt;
    carouselItems[i].appendChild(carouselImage);
  }
});

// Categories
function getCategories(callback) {
  // Creating Our XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Making our connection
  var url = "http://localhost:3002/categories";
  xhr.open("GET", url, true);

  // function execute after request is successful
  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callback(this.responseText);
    }
  };
  // Sending our request
  xhr.send();
}

var categories = getCategories(function (responseCategories) {
  var categories = JSON.parse(responseCategories);

  //sorting
  categories.sort(function (a, b) {
    return a.order - b.order;
  });
  categories.shift();

  var gridImageItems = document.querySelectorAll(".grid-item-image");
  var gridHeadings = document.querySelectorAll(".grid-heading");
  var gridDescriptions = document.querySelectorAll(".grid-description");

  for (let i = 0; i < categories.length; i++) {
    let gridImage = document.createElement("img");
    gridImage.src = categories[i].imageUrl;
    gridImage.alt = categories[i].name;
    gridImage.className += "grid-image";
    gridImageItems[i].appendChild(gridImage);

    gridHeadings[i].innerHTML = categories[i].name;
    gridDescriptions[i].innerHTML = categories[i].description;
  }
});

// Carousel functionality
var slidePosition = 1;
SlideShow(slidePosition);

// forward/back controls
function plusSlides(n) {
  SlideShow((slidePosition += n));
}

//  images controls
function currentSlide(n) {
  SlideShow((slidePosition = n));
}

function SlideShow(n) {
  var i;
  var slides = document.getElementsByClassName("carousel-item");
  var circles = document.getElementsByClassName("dots");
  if (n > slides.length) {
    slidePosition = 1;
  }
  if (n < 1) {
    slidePosition = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < circles.length; i++) {
    circles[i].className = circles[i].className.replace(" enable", "");
  }
  if (slides[slidePosition - 1]) {
    slides[slidePosition - 1].style.display = "block";
  }
  circles[slidePosition - 1].className += " enable";
}
