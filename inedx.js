let ukupanPrihod = 0;
let ukupanRashod = 0;
let ukupanProcenat = 0;
let saldo = 0;
let count = 0;

let nizPrihodi = [];
let nizRashodi = [];

let displaySaldo = document.querySelector('#saldo');
let displayPrihod = document.querySelector('#ukupanPrihod');
let displayRashod = document.querySelector('#rashodIznos');
let displayProcenat = document.querySelector('#rashodProcenat');

let select = document.querySelector('select');
let inputOpis = document.querySelector('input[type=text]');
let inputIznos = document.querySelector('input[type=number]');
let btnDodaj = document.querySelector('#dodaj');
let btnRestart = document.querySelector('#restart');

let listaPrihoda = document.querySelector('#listaPrihoda');
let listaRashoda = document.querySelector('#listaRashoda');

if (localStorage.ukupanPrihod) {
    ukupanPrihod = Number(localStorage.ukupanPrihod);
    ukupanRashod = Number(localStorage.ukupanRashod);
    ukupanProcenat = Number(localStorage.ukupanProcenat);
    saldo = Number(localStorage.saldo);
    nizPrihodi = JSON.parse(localStorage.getItem('prihodi'));
    nizRashodi = JSON.parse(localStorage.getItem('rashodi'));

    nizPrihodi.forEach(el => addingToDOM('+', el));
    nizRashodi.forEach(el => addingToDOM('-', el));
}

btnDodaj.addEventListener('click', (e) => addItem(e));
btnRestart.addEventListener('click', (e) => restart(e));

function addItem(e) {
    e.preventDefault();
    if (!areValid(select.value, inputOpis.value, inputIznos.value)) return;
    let item = addToArray(select.value, inputOpis.value, inputIznos.value);
    calculate(select.value, item.iznos);
    addingToDOM(select.value, item);
}

function restart(e) {
    e.preventDefault();
    let confirmation = prompt('Ukucajte "restart" da biste potvrdili!');
    if (confirmation.trim().toLowerCase() === 'restart') {
        localStorage.clear();
        document.location.reload();
    } else {
        return;
    }
}

function areValid(operation, description, value) {
    if (operation == '-' && value > saldo) {
        alert('Немате довољно средстава за тај расход.');
        return false;
    } else if (!description.trim()) {
        alert('Опис не сме бити празан.');
        return false;
    } else if (value <= 0) {
        alert('Износ мора бити позитиван број.');
        return false;
    } else {
        return true;
    }
}

function addToArray(operation, description, value) {
    let obj = {
        id: count,
        opis: description.trim(),
        iznos: value,
    };
    
    count++;

    if (operation == '-') {
        obj = {
            ...obj,
            procenat: Math.round((100 * value) / ukupanPrihod)
        }
        nizRashodi.push(obj);
    } else {
        nizPrihodi.push(obj);
    }
    return obj;
}

function calculate(operation, value) {
    value = Number(value);
    if (operation == '-') {
        saldo -= value;
        ukupanRashod += value;
    } else {
        saldo += value;
        ukupanPrihod += value;
    }
    ukupanProcenat = Math.round((100 * ukupanRashod) / ukupanPrihod);

    updateStorage();
}

function addingToDOM(operation, obj) {
    let value = Number(obj.iznos);

    let listItem = document.createElement('li');
    let spanOpis = document.createElement('span');
    let divNumbers = document.createElement('div');
    let spanIznos = document.createElement('span');
    let divRemove = document.createElement('div');

    divRemove.textContent = 'x';
    divRemove.id = 'remove';
    divRemove.addEventListener('click', (e) => removeItem(e, operation, obj));

    spanOpis.textContent = obj.opis;

    if (operation == '-') {
        let spanProcenat = document.createElement('span');
        spanProcenat.id = 'procenat';
        spanProcenat.textContent = `${Math.round((100 * value) / ukupanPrihod)}%`;

        spanIznos.textContent = `-${value.toFixed(2)}`;
        displayRashod.textContent = `- ${ukupanRashod.toLocaleString()}`;

        divNumbers.append(spanIznos, spanProcenat, divRemove);
        listItem.append(spanOpis, divNumbers);
        listaRashoda.append(listItem);
    } else {
        spanIznos.textContent = `+${value.toFixed(2)}`;
        displayPrihod.textContent = `+ ${ukupanPrihod.toLocaleString()}`;

        divNumbers.append(spanIznos, divRemove);
        listItem.append(spanOpis, divNumbers);
        listaPrihoda.append(listItem);
    }

    displayProcenat.textContent = `${ukupanProcenat}%`;
    displaySaldo.textContent = `+ ${saldo.toLocaleString()} RSD`;
}

function removeItem(e, operation, obj) {
    e.target.parentElement.parentElement.remove();
    let value = Number(obj.iznos);

    if (operation == '-') {
        ukupanRashod -= value;
        saldo += value;
        displayRashod.textContent = `- ${ukupanRashod.toLocaleString()}`;
        
        let index = nizRashodi.findIndex(value => value == obj.id);
        nizRashodi.splice(index, 1);
    } else {
        ukupanPrihod -= value;
        saldo -= value;
        displayPrihod.textContent = `+ ${ukupanPrihod.toLocaleString()}`;

        let index = nizRashodi.findIndex(value => value == obj.id);
        nizPrihodi.splice(index, 1);
    }
    
    ukupanProcenat = ((100 * ukupanRashod) / ukupanPrihod).toFixed();
    if (isNaN(ukupanProcenat)) ukupanProcenat = 0;
    updateStorage();

    displayProcenat.textContent = `${ukupanProcenat}%`;
    displaySaldo.textContent = `+ ${saldo.toLocaleString()} RSD`;
}

function updateStorage() {
    localStorage.ukupanPrihod = ukupanPrihod;
    localStorage.ukupanRashod = ukupanRashod;
    localStorage.ukupanProcenat = ukupanProcenat;
    localStorage.saldo = saldo;
    localStorage.prihodi = JSON.stringify(nizPrihodi);
    localStorage.rashodi = JSON.stringify(nizRashodi);
}
