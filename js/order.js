// Function to display cart items from local storage
document.addEventListener("click", function (event) {
  var checkbox = document.getElementById("checkbox");
  if (event.target !== checkbox) {
    checkbox.checked = false;
  }
});

function displayCartItems() {
  var cart = JSON.parse(localStorage.getItem("cart"));

  // Clear the cart list before adding items
  var cartList = document.querySelector(".menu ul");
  cartList.innerHTML = ""; // Remove all items from the cart

  if (cart && cart.length > 0) {
    var totalAmount = 0;
    var itemQuantities = {}; // To track item quantities
    let heighestorderqunty = {}; //This is the quntity of food item in object array for finding heighest ordered fooditem
    // Loop through the cart items and consolidate items with the same name
    cart.forEach(function (item) {
      heighestorderqunty[(item.name)] = item.quantity;
      console.log(heighestorderqunty);

      localStorage.setItem("quantity", JSON.stringify(heighestorderqunty));

     
      // console.log(retrievedArray[item.name]);

      if (itemQuantities[item.name]) {
        // If the item already exists in the cart, update its quantity and total price
        itemQuantities[item.name].quantity += item.quantity;
        itemQuantities[item.name].totalPrice += item.quantity * item.price;
        // document.querySelector(".cancel").style.display="block";
      } else {
        // If it's a new item, add it to the itemQuantities object
        itemQuantities[item.name] = {
          quantity: item.quantity,
          totalPrice: item.quantity * item.price,
        };
      }
    });
   
    // Loop through the itemQuantities object and display consolidated items
    for (var itemName in itemQuantities) {
      var itemData = itemQuantities[itemName];
      var listItem = document.createElement("li");
      
      listItem.innerHTML = `<h3>${itemName} (Qty: ${itemData.quantity})</h3>
                                      <p>Rs. ${itemData.totalPrice.toFixed(
        2
      )}</p>
      <button class="cancel-item" onclick="removeItem('${itemName}')">cancel</button>`;
      cartList.appendChild(listItem);

      totalAmount += itemData.totalPrice; // Update the total amount
      
    }
    
    // Update the total amount
    var totalAmountSpan = document.querySelector(".cart span");
    totalAmountSpan.textContent = "Total amt: Rs. " + totalAmount.toFixed(2);
    localStorage.setItem("totalAmount", totalAmount.toFixed(2));


    // Apply CSS styles (if needed) to the total amount span
    totalAmountSpan.style.fontSize = "24px"; // Adjust the font size as needed
    totalAmountSpan.style.textAlign = "center";
  } else {
    cartList.textContent = "Cart is Empty!! Add food items";
  }
}

function removeItem(itemName) {
  var count=  parseInt(JSON.parse(localStorage.getItem("fooditemcount")));
  count=count-1;
  var cart = JSON.parse(localStorage.getItem("cart"));
  cart = cart.filter((item) => item.name !== itemName);
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("fooditemcount", JSON.stringify(count));
  displayCartItems();
}

// Function to clear the cart and refresh the page
function clearCart() {
  localStorage.removeItem("fooditemcount")
  // Clear items from local storage
  localStorage.removeItem("cart");

  // Reload the page to clear the cart display
  location.reload();
}

// Call the displayCartItems function when the page loads
window.addEventListener("load", displayCartItems);

// Add click event listener to the "Clear Cart" button
document.getElementById("clear-cart").addEventListener("click", clearCart);

// Add click event listener to the "Pay" button
document.getElementById("pay").addEventListener("click", function () {
  // Redirect to the payment page when the button is clicked
  var cart = JSON.parse(localStorage.getItem("cart"));
  var orderTime = document.getElementById("order-time").value;

  if (!cart || cart.length === 0) {
    alert("Cart is empty!! Add food Items");
  } else if (!orderTime) {
    alert("Please select the delivery time");
  } else {
    // Check if the selected time is within the allowed range (10:30 to 18:00)
    var selectedTime = new Date("2000-01-01 " + orderTime);
    var lowerLimit = new Date("2000-01-01 10:30");
    var upperLimit = new Date("2000-01-01 18:00");

    if (selectedTime >= lowerLimit && selectedTime <= upperLimit) {
      // Include Firebase code to send order details
      // Assuming you have a function like sendOrderToFirebase(cart, orderTime) for this purpose
      // sendOrderToFirebase(cart, orderTime);
      localStorage.setItem("time", selectedTime); // Move to the payment page
      console.log("Order-Time :", selectedTime);
      window.location.href = "./payment (1).html";
    } else {
      alert("Delivery time must be between 10:30 and 18:00");
    }
  }


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
