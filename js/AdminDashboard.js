var database = firebase.database();
  
// Reference to the root of your Firebase structure
let rootRef = database.ref("Orders");
let chekedItems = database.ref("checkedItems");
let orderstobeprepared = database.ref("orderstobeprepared");

// Reference to the table body
var tableBody = document.querySelector(".table-unchecked tbody");
var tablecheched = document.querySelector(".table-checked tbody");
var tableBodyOrders = document.querySelector(".table-orders");

// Dictionary to store counts of food items
var foodItemCounts = {};
let timearr = [];
let username = localStorage.getItem("inputValue");
console.log(username);

// Function to display sorted food items
function displaySortedFoodItems() {
  
  tableBody.innerHTML="";
  rootRef.once("value").then(function (snapshot) {
    // Fetch all tokens from Firebase
    var tokens = [];
    snapshot.forEach(function (childSnapshot) {
      var tokenNumber = childSnapshot.key;
      var tokenData = childSnapshot.val();
      if (tokenData && tokenData.foodItem && tokenData.time) {
        tokens.push({
          tokenNumber: tokenNumber,
          time: tokenData.time,
          amount: tokenData.TotalAmount,
          gmail: tokenData.Email,
          foodItems: tokenData.foodItem,
        });
      }
    });

    tokens.sort(function (a, b) {
      return a.time.localeCompare(b.time);
    });

    tokens.forEach(function (token) {
      var newRow = document.createElement("tr");
      newRow.setAttribute("data-token-number", token.tokenNumber);
      newRow.innerHTML = `
      <td>${token.tokenNumber}</td>
      
      
      <td>${formatTime(token.time)}</td>
      <td><button class="confirm-button action-button" onclick="confirm('${token.foodItems}','${token.time}', '${token.tokenNumber}','${token.amount}','${token.gmail}')"><img src="../Images/icons8-done-50.png" width="20vw" alt="no_img"></button></td>
      <td><button class="cancel-button action-button" onclick="cancelling('${token.foodItems}','${token.time}', '${token.tokenNumber}','${token.amount}','${token.gmail}')"><img src="../Images/icons8-unchecked-cancel-50.png" width="20vw" alt="no_img"></button></td>
      <td><button class="view-button action-button" onclick="openPopup('${token.tokenNumber}', '${token.gmail}', '${username}', '${token.foodItems}', '${token.time}', '${token.amount}')"><img src="../Images/icons8-eye-24.png" width="20vw" alt="no_img"></button></td>
    `;
      tableBody.appendChild(newRow);
      // <td>${token.foodItems}</td>
    });
  });
  // <td>${token.gmail}</td>
  // Assuming tableBodyOrders is the ID of the table body for checked items
  chekedItems.on("value", function (snapshot) {
    let checkedItem = snapshot.val();
    console.log(checkedItem);
    tablecheched.innerHTML="";
    for (let key in checkedItem) {
      if (checkedItem.hasOwnProperty(key)) {
        console.log(checkedItem[key].prepared_status,key);

        var newRow = document.createElement("tr");
        newRow.setAttribute("data-token-number2", key);
        newRow.innerHTML = `
          <td></td>
         
          <td>${key}</td>
          
          <td>${formatTime(checkedItem[key].time)}</td>
          <td>${checkedItem[key].prepared_status}</td>
          <button class="received-button" onclick="receive('${checkedItem[key].foodItem}', '${checkedItem[key].time}', '${key}', '${checkedItem[key].amount}', '${checkedItem[key].gmail}', '${checkedItem[key].prepared_status}')">Received</button>
          
          <td><button class="view-button action-button" onclick="openPopup('${key}', '${checkedItem[key].gmail}', '${username}', '${checkedItem[key].foodItem}', '${checkedItem[key].time}', '${checkedItem[key].amount}')"><img src="../Images/icons8-eye-24.png" width="20vw" alt="no_img"></button></td>
          
        `;
      //   <td>${checkedItem[key].foodItem}</td>
      // <td>${checkedItem[key].amount}</td>
        var allRows = tablecheched.querySelectorAll("tr[data-token-number2]");
        newRow.querySelector("td:first-child").textContent = allRows.length + 1;
        tablecheched.appendChild(newRow);
      }
    }
  });
}
//   <td>${checkedItem[key].gmail}</td>
// Function to format time to 12-hour format
function formatTime(time) {
  var formattedTime = new Date("2000-01-01 " + time).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  return formattedTime;
}

// Call the function to display food items in sorted order
displaySortedFoodItems();

function cancelling(foodItem, time, tokenNumber, Amount, gmail) {
  chekedItems.child(tokenNumber).set({
    token: tokenNumber,
    foodItem: foodItem,
    gmail: gmail,
    time: time,
    amount: Amount,
    prepared_status: "canceled",
  });

  rootRef.child(tokenNumber).remove()
    .then(function () {
      console.log('Token deleted successfully from unchecked');
    })
    .catch(function (error) {
      console.error('Error deleting token from unchecked:', error);
    });

  // Delete the confirmed order from the "Unchecked Orders" table and Firebase
  var rowToDelete = document.querySelector(
    `.table-unchecked tr[data-token-number="${tokenNumber}"]`
  );
  if (rowToDelete) {
    rowToDelete.remove();
  }
}

function confirm(foodname, time, tokenNumber, amount, gmail) {
  orderstobeprepared.child(tokenNumber).set({
    token: tokenNumber,
    foodItem: foodname,
    gmail: gmail,
    time: time,
    amount: amount,
    prepared_status: "preparing",
  });
  chekedItems.child(tokenNumber).set({
    token: tokenNumber,
    foodItem: foodname,
    gmail: gmail,
    time: time,
    amount: amount,
    prepared_status: "preparing",
  });
  rootRef.child(tokenNumber).remove()
    .then(function () {
      console.log('Token deleted successfully from unchecked');
    })
    .catch(function (error) {
      console.error('Error deleting token from unchecked:', error);
    });

  // Delete the confirmed order from the "Unchecked Orders" table and Firebase
  var rowToDelete = document.querySelector(
    `.table-unchecked tr[data-token-number="${tokenNumber}"]`
  );
  if (rowToDelete) {
    rowToDelete.remove();
  }
}



function receive(foodname, time, tokenNumber,TotalAmount, gmail, prepared_status) {
chekedItems.child(tokenNumber).set({
  token: tokenNumber,
  foodItem: foodname,
  gmail: gmail,
  time: time,
  amount: TotalAmount,
  prepared_status: 'received',
})
.then(() => {
  console.log("Data written successfully");

  // Update order status in Firestore
  if (gmail && tokenNumber) {
    let Orderdetails = usersRef.doc(gmail).collection("orderdetails");

    Orderdetails.doc(tokenNumber).update({
      OrderStatus: 'received', // Update the order status to 'received'
      PayStatus: 'paid',
      TotalAmount: TotalAmount,
    })
    .then(function () {
      console.log("OrderStatus updated successfully.");

      // Reload the user's profile page or update the UI accordingly
      location.reload(); // You might want to consider a better way to update the UI.
    })
    .catch(function (error) {
      console.error("Error updating OrderStatus:", error);
    });
  } else {
    console.error("Gmail or key is undefined for an item in checkedItem.");
  }
})
.catch((error) => {
  console.error("Error writing data: ", error);
});
}




// Popup functionality
function openPopup(token, email, username, itemname, time, totalprice) {
  document.getElementById('popup-token').textContent = token;
  document.getElementById('popup-email').textContent = email;
  document.getElementById('popup-username').textContent = username;
  document.getElementById('popup-itemname').textContent = itemname;
  document.getElementById('popup-time').textContent = time;
  document.getElementById('popup-totalprice').textContent = totalprice;

  document.getElementById('view-popup').style.display = 'block';
}

function closePopup() {
  document.getElementById('view-popup').style.display = 'none';
}

let ham = document.getElementById("hamburger-open");
let cancel = document.getElementById("hamburger-cancel");
let sidebar = document.querySelector(".sidebar");

ham.addEventListener("click", function () {
  ham.style.display = "none";
  cancel.style.display = "block";
  sidebar.style.transition = "1s";
  sidebar.style.transform = "translateX(0px)";
});

cancel.addEventListener("click", function () {
  cancel.style.display = "none";
  ham.style.display = "block";

  sidebar.style.transform = "translateX(-1666px)";
});

// let home = document.getElementById("item1");
let ordertobeprepared = document.getElementById("item2");
let dashboardLeft = document.querySelector(".dashboard-left");
let dashboardRight = document.querySelector(".dashboard-right");

// home.addEventListener("click", function () {
//   dashboardLeft.style.display = "block";
//   dashboardRight.style.display = "none";
// });

// ordertobeprepared.addEventListener("click", function () {
//   dashboardLeft.style.display = "none";
//   dashboardRight.style.display = "block";
// });

function downloadpdf() {
  chekedItems.once('value')
    .then(snapshot => {
      const data = [];
      snapshot.forEach(childSnapshot => {
        const tokenNumber = childSnapshot.key;
        const itemData = childSnapshot.val();
        data.push({
          'Token Number': tokenNumber,
          'Food Item': itemData.foodItem,
          'G-mail': itemData.gmail,
          'Time': itemData.time,
          'Amount': itemData.amount,
          'Status': itemData.prepared_status
        });
      });

      const workbook = XLSX.utils.book_new();
      const sheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, sheet, 'Checked Orders');

      // Save the workbook to a file
      XLSX.writeFile(workbook, 'checked_orders' + '.xlsx');

      // Clear the entries from the frontend (remove rows from the table)
      var tableRows = document.querySelectorAll(".table-checked tbody tr");
      tableRows.forEach(row => row.remove());
    })
    .catch(err => {
      console.error('Error getting data from Firebase:', err);
      // Handle the error here (e.g., display an error message to the user)
    });
}

function clearData() {
  // Display a SweetAlert confirmation dialog
  Swal.fire({
    title: 'Are you sure?',
    text: 'This will clear all entries. This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, clear it!',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      // Clear the entries in the Firebase database
      chekedItems.remove()
        .then(function () {
          console.log('Entries cleared successfully from checkedItems');
        })
        .catch(function (error) {
          console.error('Error clearing entries from checkedItems:', error);
        });

      // Clear the entries from the frontend (remove rows from the table)
      var tableRows = document.querySelectorAll(".table-checked tbody tr");
      tableRows.forEach(row => row.remove());

      Swal.fire('Cleared!', 'All entries have been cleared.', 'success');
    } else {
      Swal.fire('Cancelled', 'Entries were not cleared.', 'info');
    }
  });
}

//logout
document.querySelector(".logout-button").addEventListener("click", function () {
  console.log(username);
  if (username) {
    localStorage.removeItem("inputValue");
    window.location.href = `login.html`;

    // You may want to redirect the user to a login page or do something else here
  } else {
    window.location.href = `login.html`;
  }
});

setTimeout(function () {
  // displaySortedFoodItems();
  // location.reload();
},60000);//The page will be refreshed for every 1min
