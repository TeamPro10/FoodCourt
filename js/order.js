const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);
let tokenref = firebase.database().ref("Token");

var database = firebase.database();
// Reference to the root of your Firebase structure
let rootRef = database.ref("Orders");
let FoodcountRef = database.ref("Foodcounts");
let categoryRef = database.ref("foodItems2");
let username = localStorage.getItem('inputValue');
const usersRef = db.collection("Users");
let Orderdetails;
let categories = [];
if (username !== null) {
  console.log(username)
  //realtimedatabase

  Orderdetails = usersRef.doc(username).collection("orderdetails");
} else {
  console.warn("loginnn for further operation!")
}


var cart = JSON.parse(localStorage.getItem('cart'));
let cartitemcount = 0;
if (cart !== null) {
  cart.forEach(function (item) {
    cartitemcount = cartitemcount + 1;
  })
}



// Function to format hours and minutes as a 12-hour time string with AM/PM
function format12HourTime(hours, minutes) {
  var period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  // Format the time in HH:mm AM/PM
  var formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;

  return formattedTime;
}

// console.log(cartitemcount);
function placeorder() {
  let token;
  
  var cart = JSON.parse(localStorage.getItem('cart'));
  // console.log(username)
  tokenref.once("value").then(function (snapshot) {

    token = snapshot.val().token;
    // console.log(snapshot.val().token);

    console.log(token);
    if (cart && cart.length > 0) {
      // You need to implement a function to generate a unique token
      var selectedTime = localStorage.getItem("time");
      // console.log(selectedTime)
      var time;

      if (selectedTime) {
        // Convert the string representation back to a Date object
        var dateObject = new Date(selectedTime);

        // Format the time
        // console.log(dateObject)
        var time = format12HourTime(dateObject.getHours(), dateObject.getMinutes());
        // console.log("Formatted Time:", formattedTime);
      } else {
        console.log("No time found in localStorage");
      }


      // console.log(time);


      const currentDate = new Date();

      // Get individual components of the date
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
      const day = currentDate.getDate();
      var date = day + "/" + month + "/" + year;

      cart.forEach(function (item) {

        if (!categories.includes(item.category)) {
          categories.push(item.category);
          // console.log(item.category);
        }
        
      });
      let index;
      // Loop through the cart items and save each one as a separate order
      while (categories.length !== 0){
        console.log("length-cat-before:",categories.length,categories);
        cart.forEach(function (item) {
          index = categories.length - 1;
          if (categories[categories.length - 1] === item.category) {
            console.log("Token:",token);
            // console.log("FoodItem:",item.name);
            Orderdetails.doc(token.toString()).collection("items").add({
                Ordered_Food: item.name,
                quantity: item.quantity,
                Price: item.quantity * item.price,
                Date:date
            }).then(function (docRef) {
                
               
                console.log("Order details saved successfully with ID: ", docRef.id);

            }).catch(function (error) {
                console.error("Error saving order details:", error);
            });
            addfood_to_uncheckedlist(token, username, time, item.name, item.quantity)
            console.log("passing token:",token);
          }



        });
        const totalAmount = localStorage.getItem("totalAmount");
      console.log("realtime:", totalAmount);
      const PaymentStatus = "Paid"
      // Save the total amount for the order (assuming you want a single total amount for all items)
      Orderdetails.doc(token.toString()).set({
        TotalAmount: totalAmount,
        PayStatus: PaymentStatus,
        OrderStatus: "ordered"
      }).then(function () {
        console.log("Total amount saved successfully.");

        localStorage.removeItem('cart');
        localStorage.removeItem('fooditemcount')
        localStorage.removeItem("time");
        // location.reload();
      }).catch(function (error) {
        console.error("Error saving total amount:", error);
      });
        // Remove the processed category from the array
        categories.splice(index, 1);
        console.log("length-cat-after:",categories.length,categories);
        token += 1;
        tokenref.set({
          token: token,
        });
      } 



      


      // console.log("token",token);

    } else {
      alert("UR order is Already placed once!!")
    }
    //realtimedatabase

  });


  // });


}

let foodItems = {};
let foodcount = {};
let finalorderplacecounter = 0;
function addfood_to_uncheckedlist(token, email, time, foodname, quantity) {
  let count;
   console.log(token);
  // Initialize the array if it doesn't exist for the given token
  if (!foodItems[token]) {
    foodItems[token] = [];
  }

  // Now you can safely push to the array
  foodItems[token].push(foodname);

  // Fetch the count from Firebase
  let FcountRef = FoodcountRef.child(foodname);
  const foodquantity = localStorage.getItem("quantity");
  // console.log(foodname);
  const retrievedArray = JSON.parse(foodquantity);
  // console.log(retrievedArray[foodname]);


  // if (foodquantity && foodquantity[foodname] !== undefined) {
  //     const C = foodquantity[foodname];
  //     console.log(foodquantity);
  // } else {
  //     console.log('The foodquantity property is undefined or the foodname property does not exist.');
  // }

  FcountRef.once('value')
    .then(snapshot => {
      const Fcount = snapshot.val();

      // Check if Fcount exists and has a count property
      if (Fcount && Fcount.hasOwnProperty('foodCount')) {
        count = parseInt(Fcount.foodCount) + parseInt(retrievedArray[foodname])
      } else {
        count = parseInt(retrievedArray[foodname]);
        // console.log("count :", count);
      }

      // Update the foodcount object directly
      foodcount[foodname] = count;
      // console.log(foodcount[foodname]);
      // Save the count to Firebase
      FcountRef.set({
        foodCount: foodcount[foodname]
      }).then(() => {
        finalorderplacecounter = finalorderplacecounter + 1;
        // console.log(finalorderplacecounter);

        if (cartitemcount === finalorderplacecounter) {
          
          alert("Order placed successfully!!");
          console.log("Count saved successfully.");
          location.reload();
        }
      }).catch(error => {
        console.error("Error saving Count Details.", error);
      });

    })
    .catch(error => {
      console.error("Error fetching count from Firebase:", error);
    });

  // console.log(foodItems[token]);
  const TotalAmount = localStorage.getItem("totalAmount");
  // console.log("Realtime:",time);
  rootRef.child(token).set({
    foodItem: foodItems[token].join(','),
    Email: email,
    Quantity: quantity,
    TotalAmount: TotalAmount,
    time: time,
    prepared_status: "ordered",
  }).then(() => {

    console.log("Details saved successfully.",token);
  }).catch(error => {
    console.error("Error saving Details.", error);
  });
  // token += 1;
  // tokenref.set({
  //   token: token,
  // });

}
// Function to display cart items from local storage
document.addEventListener("click", function (event) {
  var checkbox = document.getElementById("checkbox");
  if (event.target !== checkbox) {
    checkbox.checked = false;
  }
});

function displayCartItems() {
  var cart = JSON.parse(localStorage.getItem("cart"));
  var count = JSON.parse(localStorage.getItem("fooditemcount"));

  console.log(count)
  // Clear the cart list before adding items
  var cartList = document.querySelector(".menu ul");
  cartList.innerHTML = ""; // Remove all items from the cart

  if (cart && cart.length > 0) {
    var totalAmount = 0;
    var itemQuantities = {}; // To track item quantities
    let heighestorderqunty = {};
    cart.forEach(function (item) {
      heighestorderqunty[(item.name)] = item.quantity;
      // console.log(heighestorderqunty);

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
    console.log(totalAmount)

    // Apply CSS styles (if needed) to the total amount span
    totalAmountSpan.style.fontSize = "24px"; // Adjust the font size as needed
    totalAmountSpan.style.textAlign = "center";
  } else {
    cartList.textContent = "Cart is Empty!! Add food items";
  }
}

function removeItem(itemName) {
  var count = JSON.parse(localStorage.getItem("fooditemcount"));
  count = count.filter((item) => item !== itemName);
  console.log(count);
  var cart = JSON.parse(localStorage.getItem("cart"));
  cart = cart.filter((item) => item.name !== itemName);
  console.log(cart);
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
// document.getElementById("clear-cart").addEventListener("click", clearCart);

// Add click event listener to the "Pay" button

document.getElementById("pay").addEventListener("click", function () {
  // Retrieve necessary details
  if (username !== null) {
    var cart = JSON.parse(localStorage.getItem("cart"));
    var orderTime = document.getElementById("order-time").value;
    var totalAmount = localStorage.getItem("totalAmount");

    if (!cart || cart.length === 0) {
      alert("Cart is empty!! Add food Items");
    } else if (!orderTime) {
      alert("Please select the delivery time");
    } else {
      // Check if the selected time is within the allowed range (10:30 to 18:00)
      var selectedTime = new Date("2000-01-01 " + orderTime);
      var lowerLimit = new Date("2000-01-01 10:30");
      var upperLimit = new Date("2000-01-01 18:00");
      console.log(selectedTime)
      if (selectedTime >= lowerLimit && selectedTime <= upperLimit) {
        // selectedTime = parse12HourTime(orderTime);
        localStorage.setItem("time", selectedTime); // Move to the payment page
        console.log("Order-Time :", selectedTime);

      } else {
        alert("Delivery time must be between 10:30 and 18:00");
      }


      if (selectedTime >= lowerLimit && selectedTime <= upperLimit) {
        // Construct the Paytm payment URL with necessary parameters
        var paytmURL = "https://securegw.paytm.in/theia/processTransaction";
        var merchantID = "your_merchant_id"; // Replace with your actual merchant ID
        var orderID = "your_order_id"; // Replace with your actual order ID
        var callbackURL = "your_callback_url"; // Replace with your actual callback URL

        // Create a form dynamically
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", paytmURL);

        // Add hidden input fields with transaction details
        var fields = [
          { name: "MID", value: merchantID },
          { name: "ORDER_ID", value: orderID },
          { name: "CUST_ID", value: "customer_id" }, // Replace with your actual customer ID
          { name: "TXN_AMOUNT", value: totalAmount },
          { name: "CALLBACK_URL", value: callbackURL },
        ];

        fields.forEach(function (field) {
          var input = document.createElement("input");
          input.setAttribute("type", "hidden");
          input.setAttribute("name", field.name);
          input.setAttribute("value", field.value);
          form.appendChild(input);
        });



        // Append the form to the body and submit it
        document.body.appendChild(form);
        placeorder();

        // form.submit();


      } else {
        alert("Delivery time must be between 10:30 and 18:00");
      }

    }
  } else {
    alert("Please Login to continue!")
  }

});

// ******login/logout******************

// let username = localStorage.getItem("inputValue"); // Retrieve the username here

if (username) {
  document.getElementById("loginsts").textContent = "logout";
} else {
  document.getElementById("loginsts").textContent = "login";
}

function redirectToProfile() {
  if (username) {
    console.log("move to profile");
    window.location.href = `/profile`;
  } else {
    alert("NOT ALLOWED. Login!!");
  }
}
// localStorage.setItem('totalAmount', totalAmount);

// Redirect to the payment page
// window.location.href = 'payment.html';

// Add the click event listener to both elements
// document.getElementById("logo").addEventListener("click", redirectToProfile());
// document.getElementById("logo2").addEventListener("click", redirectToProfile());

document.getElementById("loginsts").addEventListener("click", function () {
  console.log(username);
  if (username) {
    localStorage.removeItem("inputValue");
    window.location.href = `/login`;

    // You may want to redirect the user to a login page or do something else here
  } else {
    window.location.href = `/login`;
  }



});
// ********************************
