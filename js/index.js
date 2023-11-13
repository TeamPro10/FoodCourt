document.addEventListener("click", function (event) {
  var checkbox = document.getElementById("checkbox");
  if (event.target !== checkbox) {
    checkbox.checked = false;
  }
});
const menuRef = firebase.database().ref("foodItems");

// Initial loading of items
menuRef.on("value", function (snapshot) {
  clearpresentitems(); // Clear existing items before displaying new ones
  snapshot.forEach(function (child) {
    child.forEach(function (child2) {
      const menuItem2 = child2.val();
      const category = "Food"; //pendinggggggg
      displayMenuItems(menuItem2, category);
    });
  });
});

function category(category) {
  document.getElementById("F-menu").style.display = "none";
  menuRef.on("value", function (snapshot) {
    clearpresentitems(); // Clear existing items before displaying new ones
    snapshot.forEach(function (child) {
      if (category === child.key) {
        child.forEach(function (child2) {
          const menuItem2 = child2.val();
          displayMenuItems(menuItem2, category);
        });
      }
    });
  });
}

function displayMenuItems(menuItem, category) {
  const imagedisplay = document.getElementById("veg");
  const Foodcategory = document.getElementById("Veg");
  let crtedpath;
  const generalcategory = category;
  const getcategory = menuItem.FoodType;
  if (menuItem && menuItem.imagePath) {
    console.log(menuItem.imagePath);

    crtedpath = "../Food-Images/" + menuItem.imagePath;
    console.log(crtedpath);
  } else {
    console.error("menuItem or imagePath is undefined.");
  }

  const inputFieldId = `input-${menuItem.foodName}`;

  const image = `
      <div class="food1">
        <img src="${crtedpath}" alt="Menu Image" id="food-img"><br>
        <button class="btn" onclick="add('${menuItem.foodName}',${menuItem.cost},'${inputFieldId}', '${crtedpath}')">Add</button> <br>
        <br><br>
        <span id="qty">Quantity:</span>
        <div class="quantity">
            <button class="minus" onclick="minus('${inputFieldId}')">-</button>
            <input type="number" class="input-box" id="${inputFieldId}" value="1" min="1" max="10">
            <button class="plus" onclick="plus('${inputFieldId}')">+</button>
        </div>
      </div>
      <div class="content" id="content">
        ${menuItem.vegNonVeg === "veg"
      ? `
          <img src="../Images/vegetarian.png" alt="no_img"  id="img1"><br>
        `
      : `
          <img src="../Images/non-vegetarian.png" alt="no_img"  id="img1"><br>
        `
    }
        <span id="nam">${menuItem.foodName}</span><br>
        <span id="rs">Rs.${menuItem.cost}</span><br>
        <p>${menuItem.description}</p>
      </div>
    `;

  imagedisplay.innerHTML += image;

  const buttons = `
      <div>
        <button id="MtoC"><a href="/Html/Order.html">Move to cart</a></button>
      </div><hr>
    `;

  imagedisplay.innerHTML += buttons;

  if (isNaN(getcategory)) {
    Foodcategory.innerHTML = generalcategory;
  } else {
    Foodcategory.innerHTML = getcategory;
  }
}

function clearpresentitems() {
  const imagedisplay = document.getElementById("veg");
  imagedisplay.innerHTML = "";
}

function minus(inputFieldId) {
  const inputField = document.getElementById(inputFieldId);
  let value = parseInt(inputField.value);
  if (value > 1) {
    value--;
    inputField.value = value;
  }
}

function plus(inputFieldId) {
  const inputField = document.getElementById(inputFieldId);
  let value = parseInt(inputField.value);
  if (value < 10) {
    value++;
    inputField.value = value;
  }
}


function redirectToCheckoutPage() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length > 0) {
    var queryString = cart
      .map(function (item) {
        return encodeURIComponent(item.name) + "=" + encodeURIComponent(item.quantity) + "&imagePath=" + encodeURIComponent(item.imagePath);
      })
      .join("&");

    window.location.href = "/checkout.html?" + queryString;
  } else {
    alert("Your cart is empty. Add items to your cart before proceeding.");
  }
}

function add(foodName, cost, inputFieldId, imagePath) {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var selectElement = document.getElementById(inputFieldId);
  var qnty = parseInt(selectElement.value);

  if (!isNaN(cost)) {
    cart.push({
      name: foodName,
      price: cost,
      quantity: qnty,
      imagePath: imagePath,
    });
    notification(foodName + " added to Cart");
    localStorage.setItem("cart", JSON.stringify(cart));
  } else {
    console.error("Cost is NaN. Cannot set the order.");
  }
}

function notification(foodName) {
  const notification = document.getElementById("notification");
  const text = document.getElementById("notificationText");

  notification.style.display = "block";
  text.textContent = foodName;

  setTimeout(function () {
    notification.style.display = "none";
  }, 3000);
}

document.getElementById("restaurant_menu").addEventListener("click", function () {
  document.getElementById("F-menu").style.display = "block";
});

document.getElementById("M-cancel").addEventListener("click", function () {
  document.getElementById("F-menu").style.display = "none";
});

// *******************login/logout***************************************************

let username = localStorage.getItem("inputValue"); // Retrieve the username here

if (username) {
  document.getElementById("loginsts").textContent = "logout";
} else {
  document.getElementById("loginsts").textContent = "login";
}

function redirectToProfile() {
  
  if (username) {
    console.log("move to profile");
    window.location.href = `profile.html`;
  } else {
    alert("NOT ALLOWED. Login!!");
  }
}

// Add the click event listener to both elements
// document.getElementById("logo").addEventListener("click", redirectToProfile());
// document.getElementById("logo2").addEventListener("click", redirectToProfile());

document.getElementById("loginsts").addEventListener("click", function () {
  console.log(username);
  if (username) {
    localStorage.removeItem("inputValue");
    window.location.href = `login.html`;

    // You may want to redirect the user to a login page or do something else here
  } else {
    window.location.href = `login.html`;
  }
});

// ********************************************************************************************