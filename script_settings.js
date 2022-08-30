const form_hellomsg = document.querySelector("#fhellomsg");
const form_hours = document.querySelector("#fhours");
const form_fee = document.querySelector("#fmoney");
const form_min = document.querySelector("#fminimum");

const button_back = document.querySelector(".back");
const button_submit = document.querySelector(".submit");
let tg = window.Telegram.WebApp;

let hello_timer = 0;
let is_timer_on = false;
let old_message_id = 0;

Telegram.WebApp.ready();
configureThemeColor(Telegram.WebApp.colorScheme);
tg.expand();

fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/presets.json')
.then((response) => {
    return response.json();
})
.then((data) => {
    form_hellomsg.value = data.hello;
    form_hours.value = data.business_hours;
    form_min.value = data.min_price;
    form_fee.value = data.delivery_fee;
    hello_timer = data.hello_timer;
    is_timer_on = data.is_timer_on;
    old_message_id = data.old_message_id;
})

button_submit.addEventListener("click", UpdateValues);
//button_back.addEventListener("click", () => {window.open("https://www.w3schools.com");});  
button_back.onclick = function () {
    location.href = "index.html";
};
function UpdateValues(){
    fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/presets.json', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            hello_timer: hello_timer,
            is_timer_on: is_timer_on,
            old_message_id: old_message_id,
            hello: form_hellomsg.value,
            business_hours: form_hours.value,
            min_price: parseInt(form_min.value),
            delivery_fee: parseInt(form_fee.value)
        })
    })
    .then(res => {
        button_submit.firstChild.data = "✅ Submitted!"
    })
    .catch(err => {console.log(err);});
}

function configureThemeColor(color) {
    if (color === 'dark') {
        document.documentElement.style.setProperty('--body-background-color', '#1f1e1f');
        document.documentElement.style.setProperty('--title-color', 'white');
        document.documentElement.style.setProperty('--sub-text-color', 'white');
    }
}
 
function showPosition(position) {
    console.log(position);
}
