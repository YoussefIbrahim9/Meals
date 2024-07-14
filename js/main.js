rowData = document.getElementById('Data');
search = document.getElementById('searchBox')

$(document).ready(() => {
    searchName("").then(() => {
        $(".loading-screen").fadeOut(500)
        $("body").css("overflow", "visible")

    })
})

//side-nav

function closeSideNav(){
    let navWidth = $(".side-nav .side-content").outerWidth()
    $(".side-nav").animate({
        left: -navWidth
    }, 500)

    $('.toggle-me').addClass("fa-align-justify");
    $('.toggle-me').removeClass("fa-x")

    $(".links li").animate({
        top: 300
    }, 500)
}

closeSideNav();

function openSideNav() {
    $(".side-nav").animate({
        left: 0
    }, 500)


    $(".toggle-me").removeClass("fa-align-justify");
    $(".toggle-me").addClass("fa-x");


    $(".links li").animate({
        top: 0
    }, 500)
}

$('.toggle-me').click(function(){
    if($('.side-nav').css("left") == "0px") {
        closeSideNav();
    } else {
        openSideNav();
    }
})


// meals and it's info

function displayMeals(meals) {
    let cartona = "";

    for(let i = 0; i < meals.length; i++) {
        cartona += `  <div class="col-md-3">
        <div onclick="getMealInfo('${meals[i].idMeal}')" class="meal position-relative rounded-2 cursor-me overflow-hidden">
            <img class="w-100" src="${meals[i].strMealThumb}" alt="">
            <div class="meal-layer position-absolute d-flex align-items-center p-2">
                <h3>${meals[i].strMeal}</h3>
            </div>

        </div>
    </div>`
    }

    rowData.innerHTML = cartona;
}

async function getMealInfo(mealId){

    rowData.innerHTML = "";

    search.innerHTML = "";
    $(".inner-loading").fadeIn(500)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    let finalResponse = await response.json()

    displayMealInfo(finalResponse.meals[0]);
    $(".inner-loading").fadeOut(500)


}

function displayMealInfo(meal) {
    let recipes = ``;

    for(let i = 0; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            recipes +=  `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",");
    if(!tags) {
        tags = [];
   }

   let tagInfo = ``;

   for (let i = 0; i < tags.length; i++) {
    tagInfo += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
   }

   let cartona = ``;
   cartona = ` <div class="col-md-4 text-white">
   <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
   <h2>${meal.strMeal}</h2>
</div>
<div class="col-md-8 text-white">
   <h2>Instructions</h2>
   <p>${meal.strInstructions}</p>
   <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
   <h3><span class="fw-bolder">Category : </span> ${meal.strCategory}</h3>
   <h3>Recipes :</h3>
   <ul class="d-flex g-3 flex-wrap">
     ${recipes}
   </ul>
   <h3>Tags :</h3>
   <ul class="d-flex g-3 flex-wrap">
       ${tagInfo}
   </ul>
   <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
   <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
</div>`

rowData.innerHTML = cartona;
} 

// search

function showSearchInputs() {
    search.innerHTML = `<div class="row py-4 ">
    <div class="col-md-6 ">
        <input onkeyup="searchName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
    </div>
    <div class="col-md-6">
        <input onkeyup="searchFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
    </div>
</div>`

rowData.innerHTML = ``;
}

async function searchFLetter(letter) {

    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(500)

    letter == "" ? letter = "a" : ""

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
    let finalResponse = await response.json()

    finalResponse ? displayMeals(finalResponse.meals) : displayMeals([]) 
    $(".inner-loading").fadeOut(500)

}

async function searchName(name){

    rowData.innerHTML = "";
    $(".inner-loading").fadeIn(500);

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    let finalResponse = await response.json()

    finalResponse ? displayMeals(finalResponse.meals) : displayMeals([])

    $(".inner-loading").fadeOut(500);

}

$('#search').click(function(){
    closeSideNav();
    showSearchInputs();
})

// categories
async function getCategories(){
    rowData.innerHTML = "";
    $(".inner-loading").fadeIn(500);
    search.innerHTML = "";

    let response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    let finalResponse = await response.json()

    displayCategories(finalResponse.categories)
    $(".inner-loading").fadeOut(500);
}

function displayCategories(category) {
    let cartona = "";

    for(let i = 0; i < category.length; i++) {
        cartona += `<div class="col-md-3">
        <div onclick="getCategoryMeals('${category[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-me">
            <img class="w-100" src="${category[i].strCategoryThumb}" alt="" srcset="">
            <div class="meal-layer position-absolute text-center text-black p-2">
                <h3>${category[i].strCategory}</h3>
                <p>${category[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
            </div>
        </div>
</div>`
    }

    rowData.innerHTML = cartona;
}

async function getCategoryMeals(category) {
    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    finalResponse = await response.json()


    displayMeals(finalResponse.meals.slice(0, 20))
    $(".inner-loading").fadeOut(300)

}

$('#category').click(function(){
    closeSideNav();
    getCategories();
})

// area

async function getArea() {
    rowData.innerHTML = "";
    $(".inner-loading").fadeIn(500);
    search.innerHTML = "";

    let response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
    let finalResponse = await response.json()

    displayArea(finalResponse.meals)
    $(".inner-loading").fadeOut(500);
}

function displayArea(area) {

    let cartona = "";

    for (let i = 0; i < area.length; i++) {
        cartona += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${area[i].strArea}')" class="rounded-2 text-center text-white cursor-me">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${area[i].strArea}</h3>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartona

}

async function getAreaMeals(area) {
    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    response = await response.json()


    displayMeals(response.meals.slice(0, 20))
    $(".inner-loading").fadeOut(300)

}

$('#area').click(function(){
    closeSideNav();
    getArea();
})

// ingredients

async function getIngredients() {
    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(500)

    search.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    finalResponse = await response.json()
    

    displayIngredients(finalResponse.meals.slice(0, 20))
    $(".inner-loading").fadeOut(500)
}

function displayIngredients(ingredient) {
    let cartona = "";

    for (let i = 0; i < ingredient.length; i++) {
        cartona += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${ingredient[i].strIngredient}')" class="rounded-2 text-center cursor-me text-white">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${ingredient[i].strIngredient}</h3>
                        <p>${ingredient[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowData.innerHTML = cartona
}

async function getIngredientsMeals(ingredients) {
    rowData.innerHTML = ""
    $(".inner-loading").fadeIn(500)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    finalResponse = await response.json()


    displayMeals(finalResponse.meals.slice(0, 20))
    $(".inner-loading").fadeOut(500)

}

$('#recipes').click(function(){
    closeSideNav();
    getIngredients();
})

// contact

function showContacts() {
    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="checkName(); inputsValidation();" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="checkEmail(); inputsValidation();" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *example@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="checkPhone(); inputsValidation();" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="checkAge(); inputsValidation();" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="checkPass(); inputsValidation();" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="checkRepass(); inputsValidation();" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    submitBtn = document.getElementById("submitBtn")

}

function checkName() {
    if (nameValidation()) {
        document.getElementById("nameAlert").classList.replace("d-block", "d-none")

    } else {
        document.getElementById("nameAlert").classList.replace("d-none", "d-block")
    }
}

function checkEmail() {
     if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")
        }
}

function checkPhone() {
    if (phoneValidation()) {
        document.getElementById("phoneAlert").classList.replace("d-block", "d-none")

    } else {
        document.getElementById("phoneAlert").classList.replace("d-none", "d-block")
    }

}

function checkAge() {
    if (ageValidation()) {
        document.getElementById("ageAlert").classList.replace("d-block", "d-none")

    } else {
        document.getElementById("ageAlert").classList.replace("d-none", "d-block")
    }
}

function checkPass() {
    if (passwordValidation()) {
        document.getElementById("passwordAlert").classList.replace("d-block", "d-none")

    } else {
        document.getElementById("passwordAlert").classList.replace("d-none", "d-block")
    }
}

function checkRepass() {
    if (repasswordValidation()) {
        document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")

    } else {
        document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")
    }

}

function inputsValidation() {

        if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
 
}


function nameValidation() {

    const nameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/;
    return (nameRegex.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return (emailRegex.test(document.getElementById("emailInput").value))
}

function phoneValidation() {

    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return (phoneRegex.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    const ageRegex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
    return (ageRegex.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    const passRegex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
    return (passRegex.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}

$('#contact').click(function(){
    closeSideNav();
    showContacts();
})