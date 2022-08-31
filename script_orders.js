/* const form_hellomsg = document.querySelector("#fhellomsg");
const form_hours = document.querySelector("#fhours");
const form_fee = document.querySelector("#fmoney");
const form_min = document.querySelector("#fminimum"); */
const orderTemplate = document.querySelector('#order-item');
const orderSections = document.querySelector('.main_container');

const button_back = document.querySelector(".back");
let tg = window.Telegram.WebApp;

let hello_timer = 0;
let is_timer_on = false;
let old_message_id = 0;

Telegram.WebApp.ready();
configureThemeColor(Telegram.WebApp.colorScheme);
tg.expand();

fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/orders.json')
.then((response) => {
    return response.json();
})
.then((data) => {
    /* form_hellomsg.value = data.hello;
    form_hours.value = data.business_hours;
    form_min.value = data.min_price;
    form_fee.value = data.delivery_fee;
    hello_timer = data.hello_timer;
    is_timer_on = data.is_timer_on;
    old_message_id = data.old_message_id; */
    
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
    
})

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
async function InitMap(ordermap, crd) {

    console.log("Map init");
    //Custom Start Location
    /* const crd = {
        latitude: 34.201302,
        longitude: -118.474937
    } */
    
    let map = new google.maps.Map(ordermap, {
      zoom: 14,
      center: { lat: crd.latitude, lng: crd.longitude },
      gestureHandling: "greedy",
      zoomControl: false,
      mapTypeControl: false, 
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_LEFT 
      }, 
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });

    const icon_big = {
        url: "./src/marker.png",
        scaledSize: new google.maps.Size(50, 65), // scaled size
    };
    console.log(crd)
    marker = new google.maps.Marker({
      position: { lat: crd.latitude, lng: crd.longitude },
      map: map,
      draggable: false,
      icon: icon_big,
    });
    
}
async function loadItems() {
    const response = await fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/orders.json');
    const items = await response.json();

    items.forEach((order, index) => {
        if (index !== 0 && index < 30){
            let orderTemp = orderTemplate.content.cloneNode(true);
            const orderTotal = orderTemp.querySelector('.order_tittle');
            const orderItems = orderTemp.querySelector('.order_items');
            const orderAddress = orderTemp.querySelector('.order_address');
            const orderLink = orderTemp.querySelector('#order-tg');
            const orderMap = orderTemp.querySelector('.map');
            orderItems.textContent = '';
            
            let {totalPrice, crd, address, tg_id, items, status} = order;
            orderTotal.textContent = 'TOTAL: $' + totalPrice;
            orderAddress.textContent = '📍 ' + address;
            /* orderLink.innerHTML = '<a href="tg://user?id='+tg_id+'" id="order-tg">🔗 TG: '+tg_id+'</a>' */
            orderLink.innerHTML = '🔗 TG: ' + tg_id;
            orderLink.onclick = function () {
                window.Telegram.WebApp.openTelegramLink("tg://user?id=" + tg_id)
            };
            console.log(items);
    
            let order_text = ''
            for (let i = 0; i < items.length; i++) {
                order_text += ((i+1) + '. ' + items[i].name + ' x ' + items[i].amount + ' = ' + items[i].price + '<br>')
            }
            console.log(order_text)
            orderItems.innerHTML = order_text
    
            crd = {
                latitude: parseFloat(crd.split(',')[0]),
                longitude: parseFloat(crd.split(',')[1])
            }
            console.log(crd)
            InitMap(orderMap, crd)
    
            orderTemp.querySelector('.order_block').dataset.id = index;
            if (status === 'waiting') {
                orderTotal.innerHTML = 'NEW!<br>' + orderTotal.innerHTML;
                orderTotal.style.color = 'rgb(23, 171, 35)';
            }
            orderSections.appendChild(orderTemp);
    
            orderTemp = orderSections.querySelector(`.order-item[data-id="${index}"]`);
        }
    })
    
}
loadItems()
function showPosition(position) {
    console.log(position);
}
