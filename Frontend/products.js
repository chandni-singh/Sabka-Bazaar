//products
function getProducts(callback) {
  // Creating Our XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Making our connection
  var url = "http://localhost:3002/products";
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

  //Setting sidebar
  var sidebarDiv = document.querySelector(".sidebar ul");

  for (let i = 0; i < categories.length; i++) {
    let siderbarListItem = document.createElement("li");
    siderbarListItem.setAttribute("key", categories[i].key);

    let sidebarItem = document.createElement("span");
    sidebarItem.setAttribute("class", "aside-item");
    sidebarItem.setAttribute("class", "aside-link");
    sidebarItem.setAttribute("id", categories[i].id);
    sidebarItem.textContent = categories[i].name;

    siderbarListItem.appendChild(sidebarItem);
    sidebarDiv.appendChild(siderbarListItem);
  }
});

var products = getProducts(function (responseProducts) {
  var products = JSON.parse(responseProducts);
  var productContainer = document.querySelector(".product-list");
  createProductList(products, productContainer);
  var asideLinks = document.querySelectorAll(".aside-link");
  for (let i = 0; i < asideLinks.length; i++) {
    asideLinks[i].addEventListener("click", firstHandleClick);
  }

  function firstHandleClick(e) {
    let updatedProducts = products.filter(
      (p) => p.category === e.target.getAttribute("id")
    );
    createProductList(updatedProducts, productContainer);
    e.target.removeEventListener("click", firstHandleClick);
    e.target.addEventListener("click", secondHandleClick);
  }

  function secondHandleClick(e) {
    createProductList(products, productContainer);
    e.target.removeEventListener("click", secondHandleClick);
    e.target.addEventListener("click", firstHandleClick);
  }

  var priceButtons = document.querySelectorAll(".price-button");

  // Cart functions
  var cartItems = document.querySelector(".cart-items");
  var cartIcon = document.querySelector(".cart-icon");
  let closeicon = document.querySelector(".cart-footer button");
  let dropdowncart = document.querySelector(".cart-section");

  cartIcon.addEventListener("click", function () {
    showdropdown();
    displayCart();
  });
  closeicon.addEventListener("click", function () {
    hidedropdown();
  });

  let showdropdown = function () {
    dropdowncart.classList.add("dropdown-cart-visible");
  };
  let hidedropdown = function () {
    dropdowncart.classList.remove("dropdown-cart-visible");
  };

  for (let i = 0; i < priceButtons.length; i++) {
    priceButtons[i].addEventListener("click", () => {
      manageClick(products[i], "add");
      totalCost(products[i], "add");
    });
  }

  function onLoadCartNumbers() {
    let productNumbers = parseInt(localStorage.getItem("CartNumbers"));
    if (productNumbers) {
      cartItems.textContent = productNumbers;
    }
  }

  function manageClick(product, action) {
    let productNumbers = parseInt(localStorage.getItem("CartNumbers"));
    if (productNumbers) {
      if (action == "add") {
        localStorage.setItem("CartNumbers", productNumbers + 1);
        cartItems.textContent = productNumbers + 1;
        setItems(product, "add");
        return;
      } else if (action == "minus") {
        localStorage.setItem("CartNumbers", productNumbers - 1);
        cartItems.textContent = productNumbers - 1;
        setItems(product, "minus");
        return;
      } else {
        return null;
      }
    } else {
      localStorage.setItem("CartNumbers", 1);
      cartItems.textContent = 1;
    }

    setItems(product, "add");
  }

  function setItems(product, action) {
    let productsInCart = JSON.parse(localStorage.getItem("productsInCart"));

    if (productsInCart != null) {
      if (productsInCart[product.id] == undefined) {
        productsInCart = {
          ...productsInCart,
          [product.id]: { ...product, inCart: 0 },
        };
      }

      if (action == "add") {
        productsInCart[product.id].inCart += 1;
      } else if (action == "minus") {
        productsInCart[product.id].inCart -= 1;
        if (productsInCart[product.id].inCart <= 0) {
          delete productsInCart[product.id];
        }
      }
    } else {
      product.inCart = 1;
      productsInCart = { [product.id]: product };
    }

    localStorage.setItem("productsInCart", JSON.stringify(productsInCart));
  }

  function totalCost(product, action) {
    let cartCost = localStorage.getItem("totalCost");

    if (cartCost != null) {
      if (action == "add") {
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost + product.price);
      } else if (action == "minus") {
        cartCost = parseInt(cartCost);
        localStorage.setItem("totalCost", cartCost - product.price);
      } else {
        return null;
      }
    } else {
      localStorage.setItem("totalCost", product.price);
    }
  }

  onLoadCartNumbers();

  // Building cart
  function displayCart() {
    let cartItems = JSON.parse(localStorage.getItem("productsInCart"));
    let cartContainer = document.querySelector(".cart-container");

    let cartItemNumber = document.querySelector(".cart-item-number");
    cartItemNumber.textContent = localStorage.getItem("CartNumbers");

    let carttotalCost = document.querySelector(".cart-total-cost");
    carttotalCost.textContent = "Rs." + localStorage.getItem("totalCost");

    if (Object.keys(cartItems).length !== 0) {
      console.log("Inside Display cart", Object.keys(cartItems).length);
      cartContainer.innerHTML = "";
      Object.values(cartItems).map((item) => {
        cartContainer.innerHTML += `
      <div class="cart-product">
  
        <div class="cart-product-image">
          <img src="${item.imageURL}" alt="${item.name}" />
        </div>
  
        <div class="content">
          <h5 class="title">${item.name}</h5>
  
          <div class="content-price">
  
            <div class="content-price-quantity">
              
            <i class="fa-solid fa-circle-minus fa-3x icon decrement"></i>
              <span class="item-quantity" key="${item.id}">&nbsp;${
          item.inCart
        }&nbsp;</span>
              <i class="fa-solid fa-circle-plus fa-3x icon increment"></i>
              <span>X</span>
              <span>Rs.${item.price}</span>
            </div>
  
            <div class="content-price-total">
              <span>Rs.${item.inCart * item.price}</span>
            </div>
  
          </div>
  
        </div>
  
      </div>`;
      });
    }

    let itemIncrement = document.querySelectorAll(".icon.increment");
    let itemDecrement = document.querySelectorAll(".icon.decrement");
    let itemQuantity = document.querySelectorAll(".item-quantity");
    let cartProduct = document.querySelectorAll(".cart-product");
    carttotalCost.textContent = "Rs." + localStorage.getItem("totalCost");

    //increment
    for (let i = 0; i < itemIncrement.length; i++) {
      itemIncrement[i].addEventListener("click", function () {
        cartProduct = products.filter(
          (p) => itemQuantity[i].getAttribute("key") == p.id
        )[0];
        manageClick(cartProduct, "add");
        displayCart();
        totalCost(cartItems[itemQuantity[i].getAttribute("key")], "add");
        carttotalCost.textContent = "Rs." + localStorage.getItem("totalCost");
      });
    }

    //decrement
    for (let i = 0; i < itemDecrement.length; i++) {
      itemDecrement[i].addEventListener("click", function () {
        cartProduct = products.filter(
          (p) => itemQuantity[i].getAttribute("key") == p.id
        )[0];
        manageClick(cartProduct, "minus");
        displayCart();
        totalCost(cartItems[itemQuantity[i].getAttribute("key")], "minus");
        carttotalCost.textContent = "Rs." + localStorage.getItem("totalCost");
      });
    }
  }
});

function createProductList(products, productContainer) {
  productContainer.innerHTML = "";

  for (let i = 0; i < products.length; i++) {
    let productDiv = document.createElement("div");
    productDiv.className += " product";

    let productHeader = document.createElement("h3");
    productHeader.className += " product-header";
    productHeader.innerHTML = products[i].name;

    let productImage = document.createElement("img");
    productImage.className += " product-image";
    productImage.src = products[i].imageURL;
    productImage.alt = products[i].name;

    let productDetails = document.createElement("p");
    productDetails.className += " product-details";
    productDetails.innerHTML = products[i].description;

    let priceContainer = document.createElement("div");
    priceContainer.className += " price-container";

    let priceSpan = document.createElement("span");
    priceSpan.className += " price";
    priceSpan.innerHTML = "MRP Rs." + products[i].price;

    let priceButton = document.createElement("button");
    priceButton.className += " price-button";
    priceButton.innerHTML = "Buy Now";

    productDiv.appendChild(productHeader);
    productDiv.appendChild(productImage);
    productDiv.appendChild(productDetails);
    productDiv.appendChild(priceContainer);
    priceContainer.appendChild(priceSpan);
    priceContainer.appendChild(priceButton);

    productContainer.appendChild(productDiv);
  }
}
