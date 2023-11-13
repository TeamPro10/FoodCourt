document.addEventListener("click", function (event) {
  var checkbox = document.getElementById("checkbox");
  if (event.target !== checkbox) {
    checkbox.checked = false;
  }
});

//opening and closing of filters
function openfilter(key, dwn, up) {
  document.getElementById(dwn).style.display = "none";
  document.getElementById(up).style.display = "block";
  document.getElementById(key).style.display = "block";
  document.getElementById(key).style.transform = "translateX(0px)";
}
function closefilter(key, dwn, up) {
  document.getElementById(up).style.display = "none";
  document.getElementById(dwn).style.display = "block";
  document.getElementById(key).style.display = "none";
  document.getElementById(key).style.transform = "translateX(-680px)";
}

function toggleCategory(cat, clickedElement) {

  const menuItems = document.querySelectorAll('.veg-nonveg');
  menuItems.forEach(item => {
    item.style.background = 'white';
    item.style.color = 'rgb(26, 65, 81)';
  });
  // Toggle background color and text color
  clickedElement.style.background = 'rgb(26, 65, 81)';
  clickedElement.style.color = 'white';


  if (cat === 'veg') {
    let elms = document.querySelectorAll('.fooditem-list')

    for (let i = 0; i < elms.length; i++) {
      if (elms[i].style.color === 'white') {
        console.log(elms[i].id)
        // let newcategory = elms[i].id + "_" + cat;
        let newcategory = [elms[i].id, cat];
        console.log(newcategory, newcategory[0]);
        category(newcategory, newcategory[0])
      }
    }

  } else if (cat === 'nonveg') {
    let elms = document.querySelectorAll('.fooditem-list')

    for (let i = 0; i < elms.length; i++) {
      if (elms[i].style.color === 'white') {
        // let newcategory = elms[i].id + "_" + cat;
        let newcategory = [elms[i].id, cat];
        console.log(newcategory, newcategory[0]);
        category(newcategory, newcategory[0])
      }
    }
  }
}
const menuRef = firebase.database().ref("foodItems2");

// Initial loading of items
menuRef.on("value", function (snapshot) {

  document.getElementById('Food').style.background = " rgb(26, 65, 81)";
  document.getElementById('Food').style.color = " white";
  clearpresentitems(); // Clear existing items before displaying new ones
  snapshot.forEach(function (child) {
    child.forEach(function (child2) {
      const menuItem2 = child2.val();
      const category = "Food"; //pendinggggggg
      displayMenuItems(menuItem2, category);
    });
  });
});

function category(category, clickedElement) {
  // console.log(category);
  let flag = 0;
  const menuItems = document.querySelectorAll('.fooditem-list');
  menuItems.forEach(item => {
    item.style.background = 'white';
    item.style.color = 'rgb(26, 65, 81)';
    if (item.id === clickedElement) {
      console.log(clickedElement);
      document.getElementById(clickedElement).style.background = 'rgb(26, 65, 81)';
      document.getElementById(clickedElement).style.color = 'white';
      flag = 1;
    }
  });
  // Highlight the clicked menu item
  if (flag === 0) {
    clickedElement.style.background = 'rgb(26, 65, 81)';
    clickedElement.style.color = 'white';

  }


  menuRef.on("value", function (snapshot) {
    clearpresentitems(); // Clear existing items before displaying new ones
    snapshot.forEach(function (child) {
      if (category === child.key || category[0] === child.key) {
        child.forEach(function (child2) {
          const menuItem2 = child2.val();
          displayMenuItems(menuItem2, category);
        });
      } else if (category === "Food" || category[0] === "Food") {
        child.forEach(function (child2) {
          const menuItem2 = child2.val();
          displayMenuItems(menuItem2, category);
        });
      }
    });
  });
}

function displayMenuItems(menuItem, category) {
  const imagedisplay = document.getElementById("fooditems-display");
  const Foodcategory = document.getElementById("Veg");
  // console.log("imagedisplay:", menuItem.foodName);
  // Create a new item div
  const itemDiv = document.createElement("div");
  itemDiv.className = "food-item";
  // console.log(category[1]);
  // const generalcategory = category;
  // const getcategory = menuItem.FoodType;
  const inputFieldId = `input-${menuItem.foodName}`;
  if(document.getElementById("veg").style.color==="white"){
    // console.log("in");
    category="veg";
  }else if(document.getElementById("nonveg").style.color==="white"){
    // console.log("in-non");
    category="nonveg";
  }
  if (category[1] === menuItem.vegNonVeg||category===menuItem.vegNonVeg) {
    itemDiv.innerHTML = `
    
      ${menuItem.vegNonVeg === "veg"
        ? `
        <img src="../Images/vegetarian.png" alt="no_img"  id="veg-nonveg" width="10vw"><br>
      `
        : `
        <img src="../Images/non-vegetarian.png" alt="no_img"  id="veg-nonveg"><br>
      `
      }
    
    <h2 id="food-Name">${menuItem.foodName}</h2>
    <h4 >Rs.<span id="price">${menuItem.cost}</span> </h4>
    <p id="description">Count:${menuItem.quantity}</p>
    <span id="qty">Quantity:</span>
    <div class="quantity">
        <button class="minus" onclick="minus('${inputFieldId}')">-</button>
        <input type="number" class="input-box" id="${inputFieldId}" value="1" min="1" max="10">
        <button class="plus" onclick="plus('${inputFieldId}')">+</button>
    </div>
   
    <button id="add" onclick="add('${menuItem.foodName}',${menuItem.cost},'${inputFieldId}')">Add</button> <br>
      `;

    // Append the item div to the container
    imagedisplay.appendChild(itemDiv);

  } else if (category[1] === menuItem.vegNonVeg||category===menuItem.vegNonVeg) {
    console.log(menuItem.vegNonVeg);
    itemDiv.innerHTML = `
    
      ${menuItem.vegNonVeg === "veg"
        ? `
        <img src="../Images/vegetarian.png" alt="no_img"  id="veg-nonveg" width="10vw"><br>
      `
        : `
        <img src="../Images/non-vegetarian.png" alt="no_img"  id="veg-nonveg"><br>
      `
      }
    
    <h2 id="food-Name">${menuItem.foodName}</h2>
    <h4 >Rs.<span id="price">${menuItem.cost}</span> </h4>
    <p id="description">Count:${menuItem.quantity}</p>
    <span id="qty">Quantity:</span>
    <div class="quantity">
        <button class="minus" onclick="minus('${inputFieldId}')">-</button>
        <input type="number" class="input-box" id="${inputFieldId}" value="1" min="1" max="10">
        <button class="plus" onclick="plus('${inputFieldId}')">+</button>
    </div>
    
    <button id="add" onclick="add('${menuItem.foodName}',${menuItem.cost},'${inputFieldId}')">Add</button> <br>
      `;

    // Append the item div to the container
    imagedisplay.appendChild(itemDiv);

  }
  else if (category === "Food" || category === "Breakfast" || category === "Meals" || category === "Chats" || category === "Ice-cream"
    || category === "Juice and Milkshakes") {
    itemDiv.innerHTML = `
    
    ${menuItem.vegNonVeg === "veg"
        ? `
      <img src="../Images/vegetarian.png" alt="no_img"  id="veg-nonveg" width="10vw"><br>
    `
        : `
      <img src="../Images/non-vegetarian.png" alt="no_img"  id="veg-nonveg"><br>
    `
      }
  
  <h2 id="food-Name">${menuItem.foodName}</h2>
  <h4 >Rs.<span id="price">${menuItem.cost}</span> </h4>
  <p id="description">Count:${menuItem.quantity}</p>
  <span id="qty">Quantity:</span>
  <div class="quantity">
      <button class="minus" onclick="minus('${inputFieldId}')">-</button>
      <input type="number" class="input-box" id="${inputFieldId}" value="1" min="1" max="10">
      <button class="plus" onclick="plus('${inputFieldId}')">+</button>
  </div>
  
  <button id="add" onclick="add('${menuItem.foodName}',${menuItem.cost},'${inputFieldId}')">Add</button> <br>
    `;

    // Append the item div to the container
    imagedisplay.appendChild(itemDiv);
  }

  // const buttons = `
  //     <div>
  //     <button >add</button><a href="/Html/Order.html">Move to cart</a></button>
  //     </div><hr>
  //   `;

  // imagedisplay.innerHTML += buttons;

  // if (isNaN(getcategory)) {
  //   Foodcategory.innerHTML = generalcategory;
  // } else {
  //   Foodcategory.innerHTML = getcategory;
  // }
}

function clearpresentitems() {
  const imagedisplay = document.getElementById("fooditems-display");
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

function add(foodName, cost, inputFieldId) {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var selectElement = document.getElementById(inputFieldId);
  var qnty = parseInt(selectElement.value);

  if (!isNaN(cost)) {
    cart.push({
      name: foodName,
      price: cost,
      quantity: qnty,

    });
    console.log(foodName, cost, qnty);
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


// Reference to the node containing food items and their counts
let FoodcountRef = firebase.database().ref("Foodcounts");
const topThreeItems = [];

// Fetch the data from the database
FoodcountRef.orderByChild("foodCount").limitToLast(3).once("value")
  .then(snapshot => {
    snapshot.forEach(childSnapshot => {
      const foodItem = childSnapshot.key;
      const foodCount = childSnapshot.val().foodCount;
      topThreeItems.push({ foodItem, foodCount });
    });

    console.log(topThreeItems);

    // Now fetch the menu items and display the top three
    menuRef.on("value", function (snapshot) {
      let container = document.querySelector(".content");
      let containerdesktopview = document.querySelector(".food-item-content");
      container.innerHTML = ""; // Clear existing items before displaying new ones
      containerdesktopview.innerHTML="";

      snapshot.forEach(function (child) {
        child.forEach(function (child2) {
          const menuItem2 = child2.val();
          const inputFieldId = `input-${menuItem2.foodName}`;
          // Check if menuItem2.foodName is in the topThreeItems array
          const isTopThree = topThreeItems.some(item => item.foodItem === menuItem2.foodName);

          if (isTopThree && container.style.display!=="none") {
            const itemDiv = document.createElement("div");
            
            if (getComputedStyle(container).display !== "none") {
              console.log(getComputedStyle(container).display)
              itemDiv.className = "heighest-ordered-food-item";
            } else {
               itemDiv.className = "food-item2";
            }
              
        
            itemDiv.innerHTML = `<h2 id="food-Name">${menuItem2.foodName}</h2>
            <h4 >Rs.<span id="price">${menuItem2.cost}</span> </h4>
            <p id="description">Count:${menuItem2.quantity}</p>
            <span id="qty">Quantity:</span>
            <div class="quantity">
                <button class="minus" onclick="minus('${inputFieldId}')">-</button>
                <input type="number" class="input-box" id="${inputFieldId}" value="1" min="1" max="10">
                <button class="plus" onclick="plus('${inputFieldId}')">+</button>
            </div>
            
            <button id="add" onclick="add('${menuItem2.foodName}',${menuItem2.cost},'${inputFieldId}')">Add</button> <br>`;
        
            if (getComputedStyle(container).display !== "none") {
                console.log(getComputedStyle(container).display)
                container.appendChild(itemDiv);
            } else {
                containerdesktopview.appendChild(itemDiv);
            }
          }
        });
      });

      // Display a message if no top three items are found
      if (container.innerHTML === "") {
        container.textContent = "No Orders Yet!!";
      }
    });
  })
  .catch(error => {
    console.error("Error fetching top three food items:", error);
  });
