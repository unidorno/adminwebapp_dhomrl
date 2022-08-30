const form_name = document.querySelector("#fname");
const form_price = document.querySelector("#fprice");
const item_image = document.querySelector(".menu-item__icon");
const button_back = document.querySelector(".back");
const button_submit = document.querySelector(".submit");
const upload_file = document.querySelector("#upload_file");
let tg = window.Telegram.WebApp;

Telegram.WebApp.ready();
configureThemeColor(Telegram.WebApp.colorScheme);
tg.expand();

let item_id;
let new_data = [];
let file;

var uploaded_image = "";

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-app.js";
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.4/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA0wSxSsB938N4mKpV5Nec0tBWbpPFyZAQ",
  authDomain: "upperrestaurant.firebaseapp.com",
  databaseURL: "https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "upperrestaurant",
  storageBucket: "upperrestaurant.appspot.com",
  messagingSenderId: "1082516021560",
  appId: "1:1082516021560:web:747789a436bfb369f8e1cd",
  measurementId: "G-0CMJKFXDJM"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage();

upload_file.addEventListener("change", function() {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        uploaded_image = reader.result;
        console.log(uploaded_image)
        if (this.files[0].type.includes('image')){
            file = this.files[0]
            item_image.src = uploaded_image;
        }
    });
    reader.readAsDataURL(this.files[0]);
})

fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/items.json')
.then((response) => {
    return response.json();
})
.then((data) => {
    console.log(window.location.href);
    if (window.location.href.split('?')[1].includes('new')){
        if (window.location.href.split('?')[1] === 'new_up'){
            console.log('creating new item up')
            item_id = 0
            new_data[0] = {
                name: 'noname',
                photo: 'https://img.icons8.com/ios/500/open-parcel.png',
                price: 0
            }
            for (let i=0; i < data.length; i++) {
                new_data[i + 1] = data[i]; 
            }
        }
        if (window.location.href.split('?')[1] === 'new_down'){
            console.log('creating new item down')
            item_id = data.length
            for (let i=0; i < data.length; i++) {
                new_data[i] = data[i]; 
            }
            new_data[data.length] = {
                name: 'noname',
                photo: 'https://img.icons8.com/ios/500/open-parcel.png',
                price: 0
            }
        }

        item_image.src = new_data[item_id].photo;
    }
    else {
        new_data = data
        item_id = parseInt(window.location.href.split('?id=')[1]);

        form_name.value = new_data[item_id].name;
        item_image.src = new_data[item_id].photo;
        form_price.value = parseInt(new_data[item_id].price);
    }
    
})

button_submit.onclick = function () {
    UpdateValues();
};
//button_back.addEventListener("click", () => {window.open("https://www.w3schools.com");});  
button_back.onclick = function () {
    location.href = "menu.html";
};
function UpdateValues(){

    /* let desertRef = ref(new_data[item_id].photo);
    // Delete the file
    deleteObject(desertRef).then(() => {
      console.log('deleted');
    }).catch((error) => {
      console.log('can not delete');
    }); */

    if (file !== null && file !== undefined){
        let newfileref = ref(storage, 'durgerking/'+file.name);
        uploadBytes(newfileref, file)
        .then((snapshot) => {
            console.log(snapshot);
            getDownloadURL(newfileref)
            .then((url) => {
                new_data[item_id].photo = url;
                new_data[item_id].price = parseFloat(form_price.value);
                new_data[item_id].name = form_name.value;
                fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/items.json', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(new_data)
                })
                .then(res => {
                    if (window.location.href.split('?')[1].includes('new')){
                        location.href = "menu.html";
                    }
                    button_submit.firstChild.data = "✅ Confirmed!"
                })
                .catch(err => {console.log(err);});
            })
            
        })
        .catch((error) => {
            console.log('not an image')
            fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/items.json', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: new_data
            })
            .then(res => {
                button_submit.firstChild.data = "✅ Confirmed!"
            })
            .catch(err => {console.log(err);});
        });
    }
    else if (!window.location.href.split('?')[1].includes('new')){
        new_data[item_id].price = parseFloat(form_price.value);
        new_data[item_id].name = form_name.value;
        fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/items.json', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(new_data)
        })
        .then(res => {
            button_submit.firstChild.data = "✅ Confirmed!"
        })
        .catch(err => {console.log(err);});
    }
    
    
    /* var task = storageRef.put(file);
    task.on("state_changed",function(snapshot){
       var percentage= (snapshot.bytesTransferred/snapshot.totalBytes) *100;
       if(percentage==100){
           storageRef.getDownloadURL().then(function (url) {
              // You will get the Url here.
             var firebaseRef=firebase.database().ref("Your path Name);
             firebaseRef.push(url).then(function(){
               alert("Image Uploaded and also updated to the database");
            });
           });
       }
    }); */
    /* fetch('https://upperrestaurant-default-rtdb.europe-west1.firebasedatabase.app/durgerking/'+item_id+'.json', {
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
        button_submit.firstChild.data = "✅ Confirmed!"
    })
    .catch(err => {console.log(err);}); */
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
