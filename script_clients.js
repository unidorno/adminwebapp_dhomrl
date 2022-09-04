const blockTemplate = document.querySelector('#client-item');
const itemsSections = document.querySelector('.main_container');

const button_back = document.querySelector(".back");
let tg = window.Telegram.WebApp;

let hello_timer = 0;
let is_timer_on = false;
let old_message_id = 0;

Telegram.WebApp.ready();
configureThemeColor(Telegram.WebApp.colorScheme);
tg.expand();

button_back.onclick = function () {
    location.href = "index.html";
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
    const response = await fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/users.json');
    const items = await response.json();

    let counter = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].passport !== null && items[i].passport !== undefined){
            counter++;
        }
    }
    document.querySelector('.topic').textContent = 'CLIENTS (' + counter + ')';

    items.forEach((user, index) => {
        
        let {status, tg_id, passport, selfie} = user;

        if ((passport !== null && passport !== undefined) && (selfie !== null && selfie !== undefined)) {

            let blockTemp = blockTemplate.content.cloneNode(true);
        
            let txt_status = blockTemp.querySelector('.client-status');
            let button_tg = blockTemp.querySelector('.client-button_tg');
            let img_selfie = blockTemp.querySelector('.client-selfie');
            let img_docs = blockTemp.querySelector('.client-docs');
            
            let button_accept = blockTemp.querySelector('.client-button_accept');
            let button_decline = blockTemp.querySelector('.client-button_decline');
            let button_block = blockTemp.querySelector('.client-button_block');
            
            img_selfie.style.backgroundImage = "url("+selfie+")";
            img_docs.style.backgroundImage = "url("+passport+")";

            img_selfie.onclick = function() {
                document.querySelector('.popup_container').style.display = "block";
                document.querySelector('.preview_img').src = selfie;
                document.querySelector('.preview_button').onclick = function() {
                    document.querySelector('.preview_img').src = '';
                    document.querySelector('.popup_container').style.display = "none";
                }
            }

            img_docs.onclick = function() {
                document.querySelector('.popup_container').style.display = "block";
                document.querySelector('.preview_img').src = passport;
                document.querySelector('.preview_button').onclick = function() {
                    document.querySelector('.preview_img').src = '';
                    document.querySelector('.popup_container').style.display = "none";
                }
            }
        
            button_tg.textContent = '🔗 TG: ' + tg_id;
            button_tg.onclick = function () {
                window.Telegram.WebApp.openTelegramLink("tg://user?id=" + tg_id)
            };

            button_accept.onclick = function () {
                UpdateUser(index, 'verified_0');
            };
            button_decline.onclick = function () {
                UpdateUser(index, 'declined_0');
            };
            button_block.onclick = function () {
                UpdateUser(index, 'blocked');
            };
            
            if (status === 'verified' || status === 'verified_0') {
                txt_status.textContent = 'VERIFIED';
                txt_status.style.color = '#1e6921';
                button_accept.remove();
                button_decline.remove();
            }

            if (status === 'waiting') {
                txt_status.textContent = 'WAITING';
                txt_status.style.color = '#a89611';
            }

            if (status === 'blocked') {
                txt_status.textContent = 'BLOCKED';
                txt_status.style.color = '#000000';
                button_block.remove();
            }

            if (status === 'declined' || status === 'declined_0') {
                txt_status.textContent = 'DECLINED';
                txt_status.style.color = '#7d0c0c';
                button_decline.remove();
            }
    
            blockTemp.querySelector('.client_block').dataset.id = index;
            itemsSections.appendChild(blockTemp);
    
            blockTemp = itemsSections.querySelector(`.client-item[data-id="${index}"]`);
        }
    })
    
}
loadItems()

function UpdateUser(index, action) {
    fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/users.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        data[index].status = action;
        
        fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/users.json', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => {console.log('finished'); location.href = "clients.html";})
        .catch(err => {console.log('here: ' + err)})
        
    })
}
function showPosition(position) {
    console.log(position);
}
