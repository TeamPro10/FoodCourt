
// alert("foodtype");
document.getElementById("foodItems").addEventListener("submit", addFoodItem);
function addFoodItem(e) {
    // alert("foodItem");
    e.preventDefault();

    var FoodType = getelementvalue("FoodType");
    var foodName = getelementvalue("foodName");
    var cost = getelementvalue("cost");
    // var imagePath = document.getElementById("imagePath").files[0]; // Get the selected file
    // var fileName = imagePath.name;
    // var imagePath2 = getelementvalue("imagePath");
    // console.log(imagePath2);
    var vegNonVeg = getelementvalue("vegNonVeg");
    var description = getelementvalue("description");
    try {
        var Cost = parseInt(cost);
        addfood(FoodType, foodName, Cost, vegNonVeg, description);
        alert("Food item added successfully");
    } catch (error) {
        console.error("Error adding food item:", error);
    }
}


const addfood = (FoodType, foodName, cost, vegNonVeg, description) => {
    let foodItemsRef = firebase.database().ref("foodItems2").child(FoodType);
    var newfood = foodItemsRef.push();
    newfood.set({ FoodType: FoodType, foodName: foodName, cost: cost, vegNonVeg: vegNonVeg, description: description, });
};
const getelementvalue = (id) => {
    return document.getElementById(id).value;
};
document.getElementById("reset_token").addEventListener("click", function () {
    let tokenref = firebase.database().ref("Token");
    try {
        tokenref.set({
            token: 1,
        });
        console.log("Reset Successful") 
    } catch (error) {
        console.error("Reset Unsucessfull!"+error)
    }
    

});




