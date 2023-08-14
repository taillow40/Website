function makeMeal(){
    postRequest('/whatAmIEating', { prompt: document.querySelector('.meal-input').value });
}

function postRequest(endpoint, payload){
    let url = `http://${window.location.host}${endpoint}`;
    console.log(url);
    axios.post(url, payload, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        updateMeal(response.data);
    })
}

function updateMeal(meal){
    let div = document.querySelector('.meal');
    div.innerHTML = meal;
}