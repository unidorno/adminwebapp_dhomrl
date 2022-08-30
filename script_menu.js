/* const form_hellomsg = document.querySelector("#fhellomsg");
const form_hours = document.querySelector("#fhours");
const form_fee = document.querySelector("#fmoney");
const form_min = document.querySelector("#fminimum"); */
const blockTemplate = document.querySelector('#menu-item');
const itemsSections = document.querySelector('.main_container');
const addnew_up = document.querySelector('.additem_up');
const addnew_down = document.querySelector('.additem_down');

const button_back = document.querySelector(".back");
let tg = window.Telegram.WebApp;

let hello_timer = 0;
let is_timer_on = false;
let old_message_id = 0;

Telegram.WebApp.ready();
configureThemeColor(Telegram.WebApp.colorScheme);
tg.expand();

/* fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/orders.json')
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
    
    for (let i = 0; i < data.length; i++){
        if (data[i].status === 'waiting'){
            data[i].status = 'viewed';
            fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/orders/' + i + '.json', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data[i])
            })
            .then(res => {console.log('finished')})
            .catch(err => {console.log('here: ' + err)})
        }
    }
    
}) */

button_back.onclick = function () {
    location.href = "index.html";
};
addnew_up.onclick = function () {
    location.href = "menuItem.html?new_up";
};
addnew_down.onclick = function () {
    location.href = "menuItem.html?new_down";
};
/* function UpdateValues(){
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
} */

function configureThemeColor(color) {
    if (color === 'dark') {
        document.documentElement.style.setProperty('--body-background-color', '#1f1e1f');
        document.documentElement.style.setProperty('--title-color', 'white');
        document.documentElement.style.setProperty('--sub-text-color', 'white');
    }
}
async function loadItems() {
    const response = await fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/items.json');
    const items = await response.json();

    items.forEach((menu, index) => {
        let blockTemp = blockTemplate.content.cloneNode(true);
        let menuTitle = blockTemp.querySelector('.menu_tittle');
        let menuIcon = blockTemp.querySelector('.menu-item__icon');

        let btn_up =  blockTemp.querySelector('.menu-button_up');
        btn_up.onclick = function () {
            MoveItem(index, -1);
        };

        let btn_down =  blockTemp.querySelector('.menu-button_down');
        btn_down.onclick = function () {
            MoveItem(index, 1);
        };

        btn_delete = blockTemp.querySelector('.menu-button_delete');
        btn_delete.onclick = function () {
            DeleteItem(index);
        };

        btn_edit = blockTemp.querySelector('.menu-button_edit');
        btn_edit.onclick = function () {
            location.href = "menuItem.html?id="+ index;
        };

        let {name, photo, price} = menu;
        menuTitle.innerHTML = name + '<br>$' + price;
        menuIcon.src = photo;

        blockTemp.querySelector('.menu_block').dataset.id = index;
        itemsSections.appendChild(blockTemp);

        blockTemp = itemsSections.querySelector(`.menu-item[data-id="${index}"]`);
    })
    
}
loadItems()

function MoveItem(index, direction) {
    fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/items.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let new_data = []
        if (direction > 0 && index < data.length - 1) {
            for (let i = 0; i < data.length; i++) {
                if (i !== index && i !== index + 1){
                    new_data[i] = data[i];  
                }
                if (i === index) {
                    new_data[i] = data[index + 1];
                    new_data[i+1] = data[index];
                }
            }
            console.log(new_data);
        }
        if (direction < 0 && index > 0) {
            for (let i = 0; i < data.length; i++) {
                if (i !== index && i !== index - 1){
                    new_data[i] = data[i];  
                }
                if (i === index - 1) {
                    new_data[i+1] = data[index - 1];
                    new_data[i] = data[index];
                }
            }
            console.log(new_data);
        }
        
        fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/items.json', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(new_data)
        })
        .then(res => {console.log('finished'); location.href = "menu.html";})
        .catch(err => {console.log('here: ' + err)})
        
    })
}
function DeleteItem(index) {
    fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/items.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        let new_data = []

        if (data.length > 1){
            for (let i = 0; i < data.length - 1; i++) {
                if (i < index){
                    new_data[i] = data[i];
                }
                if (i >= index) {
                    new_data[i] = data[i + 1];
                }
            }
            console.log(new_data);
            
            fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/items/.json', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(new_data)
            })
            .then(res => {console.log('finished'); location.href = "menu.html";})
            .catch(err => {console.log('here: ' + err)})
        }
        
        
    })
}
function showPosition(position) {
    console.log(position);
}
