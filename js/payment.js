
const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);
let tokenref = firebase.database().ref("Token");

var database = firebase.database();
// Reference to the root of your Firebase structure
let rootRef = database.ref("Orders");
let FoodcountRef = database.ref("Foodcounts");
let username = localStorage.getItem('inputValue');
const usersRef = db.collection("Users");
console.log(username)
//realtimedatabase

let Orderdetails = usersRef.doc(username).collection("orderdetails");
let token;
document.getElementById("submit").addEventListener("click", function () {
    
    var cart = JSON.parse(localStorage.getItem('cart'));
    // console.log(username)
    tokenref.once("value").then(function (snapshot) {
        token = snapshot.val().token;
        // console.log(snapshot.val().token);

        console.log(token);
        if (cart && cart.length > 0) {
            // You need to implement a function to generate a unique token
            var dateString = localStorage.getItem("time");

            // Create a Date object from the string
            var dateObject = new Date(dateString);

            // Extract hours and minutes
            var hours = dateObject.getHours();
            var minutes = dateObject.getMinutes();
            // Create a new Date object, which represents the current date and time
            const currentDate = new Date();

            // Get individual components of the date
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // Months are zero-based, so add 1
            const day = currentDate.getDate();
            var date= day+ "/" + month + "/" + year;
            console.log(date);
            // Format the time as HH:mm
            var formattedTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');

            let time = formattedTime;
            // console.log(time);
            // Loop through the cart items and save each one as a separate order
            cart.forEach(function (item) {
                Orderdetails.doc(token.toString()).collection("items").add({
                    Ordered_Food: item.name,
                    quantity: item.quantity,
                    Price: item.quantity * item.price,
                    Date:date
                }).then(function (docRef) {
                    addfood_to_uncheckedlist(token, username, time, item.name, item.quantity, item.quantity * item.price)
                    console.log("Order details saved successfully with ID: ", docRef.id);
                    localStorage.removeItem('cart');
                    localStorage.removeItem("time");
                }).catch(function (error) {
                    console.error("Error saving order details:", error);
                });
            });

            const totalAmount = localStorage.getItem("totalAmount");
            // console.log(totalAmount);
            const PaymentStatus="Paid"
            // Save the total amount for the order (assuming you want a single total amount for all items)
            Orderdetails.doc(token.toString()).set({
                TotalAmount: totalAmount,
                PayStatus :PaymentStatus,
                OrderStatus :"preparing"
            }).then(function () {
                
                console.log("Total amount saved successfully.");
            }).catch(function (error) {
                console.error("Error saving total amount:", error);
            });
            aleart("Order Placed Sucessfully!!");
            // console.log("token",token);

        } else {
            alert("UR order is Already placed once!!")
        }
        //realtimedatabase
    });


});

let foodItems = {};
let foodcount = {};

function addfood_to_uncheckedlist(token, email, time, foodname, quantity, totalAmount) {
    let count;

    // Initialize the array if it doesn't exist for the given token
    if (!foodItems[token]) {
        foodItems[token] = [];
    }

    // Now you can safely push to the array
    foodItems[token].push(foodname);

    // Fetch the count from Firebase
    let FcountRef = FoodcountRef.child(foodname);
    const foodquantity = localStorage.getItem("quantity");
    console.log(foodname);
    const retrievedArray = JSON.parse(foodquantity);
    console.log(retrievedArray[foodname]);
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
                console.log("Count saved successfully.");
            }).catch(error => {
                console.error("Error saving Count Details.", error);
            });
        })
        .catch(error => {
            console.error("Error fetching count from Firebase:", error);
        });

    // console.log(foodItems[token]);

    rootRef.child(token).set({
        foodItem: foodItems[token].join(','),
        Email: email,
        Quantity: quantity,
        TotalAmount: totalAmount,
        time: time,
        prepared_status: "preparing",
    }).then(() => {
        console.log("Details saved successfully.");
    }).catch(error => {
        console.error("Error saving Details.", error);
    });
    token += 1;
    tokenref.set({
        token: token,
    });
}

