
export function createCard(item) {
    const card = document.createElement('div');
    card.classList.add('item-card');
    card.style.backgroundColor = `rgba(${return3Colors()},0.5)`;

    for (let i in item){
        const h4 = document.createElement('h4');
        h4.innerHTML = item[i];
        h4.style.color = 'black';
        card.appendChild(h4);
    }
    const update = document.createElement('button');
    update.classList.add('update-item-btn');
    update.innerHTML = '&#x2699;';
    update.addEventListener('click', () => {
        editableItem.id = item.id;

        firstField.value = item.name;
        secondField.value = item.surname;
        openDialog(false);
    });

    const del = document.createElement('button');
    del.classList.add('delete-item-btn');
    del.innerHTML = '&#x2717;';
    del.addEventListener('click', () => {
        deleteData(URL + 'delete/', item.id)
            .then();
    })

    card.appendChild(update);
    card.appendChild(del);

    return card;
}

export function return3Colors() {
    return [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]
}

async function getData(url) {
    const response = await fetch(url);
    return await response.json();
}

async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json();
}

async function putData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return await response.json();
}

async function deleteData(url = '', id = 0) {
    const response = await fetch(url + id, {
        method: 'DELETE'
    });
    return await response.json();
}

export function redrawDiv(div, items) {
    while(div.firstChild){
        div.removeChild(div.firstChild);
    }

    items.forEach( item => {
        const card = createCard(item);
        wrapper.appendChild(card);
    });
}
export function openDialog(mode = true) {
    dialog.style.display = 'block';
    creatingMode = mode;
    creatingMode ? createItemBtn.innerHTML = 'Создать' : createItemBtn.innerHTML = 'Изменить';
}
export function closeDialog() {
    dialog.style.display = 'none';
}

Array.prototype.listeners = {};
Array.prototype.addListener = function(eventName, callback) {
    if (!this.listeners[eventName]) {
        // Create a new array for new events
        // idea of an array is we can invoke all callbacks
        this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(callback);
};
// New push Method
// Calls trigger event
Array.prototype.pushWithEvent = function() {
    const size = this.length;
    const argsList = Array.prototype.slice.call(arguments);
    for (let index = 0; index < argsList.length; index++) {
        this[size + index] = argsList[index];
    }
    // trigger add event
    this.triggerEvent('add', argsList);
};
Array.prototype.triggerEvent = function(eventName, elements) {
    if (this.listeners[eventName] && this.listeners[eventName].length) {
        this.listeners[eventName].forEach(callback =>
            callback(eventName, elements, this)
        );
    }
};
let items = [
    { id: 1, name: 'HTML', surname: 'img/HTML.png' },
    { id: 2, name: 'CSS', surname: 'img/CSS.png' },
    { id: 3, name: 'JavaScript', surname: 'img/JS.png' },
    { id: 4, name: 'TypeScript', surname: 'img/TS.png' },
    { id: 5, name: 'Vue', surname: 'img/Vue.png' },
];

items.addListener('add', (i, args) => {
    redrawDiv(wrapper, items);
});


const URL = 'http://127.0.0.1:8000/'

const dialog = document.querySelector('.dialog');
const openDialogBtn = document.querySelector('.open-dialog');
const closeDialogBtn = document.querySelector('.close-dialog');
const createItemBtn = document.querySelector('.create-item');
const wrapper = document.querySelector('.my-table');
let firstField = document.querySelector('.name');
let secondField = document.querySelector('.surname');
let creatingMode = false;
let editableItem = { id: undefined, name: undefined, surname: undefined}

redrawDiv(wrapper, items); //todo не нужен если будет фетч первоначальный

openDialogBtn.addEventListener('click', () => {
    openDialog(true);
})
closeDialogBtn.addEventListener('click', () => {
    closeDialog();
})
createItemBtn.addEventListener('click', () => {
            if (creatingMode){
                items.pushWithEvent( { name: firstField.value, image: secondField.value});
                postData(URL + 'humans/', {'name' : firstField.value, 'surname' : secondField.value})
                    .then( id => {
                        console.log(id)
                    })
                closeDialog();
            }
            else {
                putData(URL + 'humans/',
                    { id : editableItem.id, 'name' : firstField.value, 'surname' : secondField.value})
                    .then( () => {
                        console.log('ddd')
                    })
                closeDialog();
            }
});

getData(URL + 'humans/')
    .then( data => {
        console.log(data)
        items = data; // todo
        redrawDiv(wrapper, items);
    })

