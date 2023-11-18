const currentUrl = window.location.href;
const http_s = currentUrl.split(':')[0];

function makeMeal() {
    disableButton();
    mealInput = document.querySelector('.meal-input');
    timeInput = document.querySelector('.time-input');
    cuisineInput = document.querySelector('.cuisine-input');
    let payload = {};
    if (mealInput.value) {
        payload.ingredient = mealInput.value;
    }
    if (timeInput.value) {
        payload.time = timeInput.value;
    }
    if (timeInput.value) {
        payload.cuisine = cuisineInput.value;
    }
    postRequest('/whatAmIEating', payload);
}

function disableButton() {
    button = document.querySelector('.meal-maker__button');
    button.disabled = true;
    button.style.backgroundColor = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-primary-desaturated');
    button.style.cursor = 'default';
}

function enableButton() {
    button = document.querySelector('.meal-maker__button');
    button.disabled = false;
    button.style.backgroundColor = getComputedStyle(document.querySelector(':root')).getPropertyValue('--color-blue-blue-white');
    button.style.cursor = 'pointer';
}

function postRequest(endpoint, payload) {
    let url = `${http_s}://${window.location.host}${endpoint}`;
    console.log(url);
    axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            updateMeal(response.data);
            enableButton();
        })
}

function updateMeal(meal) {
    let div = document.querySelector('.meal');
    meal = meal.replace(/\n/g, '<br>');
    console.log(meal);
    div.innerHTML = meal;
}