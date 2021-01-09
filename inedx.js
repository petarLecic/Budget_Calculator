let ukupanPrihod = 0;
let ukupanRashod = 0;
let ukupanProcenat = 0;
let saldo = 0;

let displaySaldo = document.querySelector('#saldo');
let displayPrihod = document.querySelector('#ukupanPrihod');
let displayRashod = document.querySelector('#rashodIznos');
let displayProcenat = document.querySelector('#rashodProcenat');

let select = document.querySelector('select');
let inputOpis = document.querySelector('input[type=text]');
let inputIznos = document.querySelector('input[type=number]');
let btnDodaj = document.querySelector('#dodaj');

let listaPrihoda = document.querySelector('#listaPrihoda');
let listaRashoda = document.querySelector('#listaRashoda');

btnDodaj.addEventListener('click', (e) => addItem(e));

function addItem(e) {
    e.preventDefault();
    if (!areValid(select.value, inputOpis.value, inputIznos.value)) return;
    calculate(select.value, inputIznos.value);
    addingToDOM(select.value, inputOpis.value, inputIznos.value);
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
}

function addingToDOM(operation, description, value) {
    value = Number(value);

    let listItem = document.createElement('li');
    let spanOpis = document.createElement('span');
    let divNumbers = document.createElement('div');
    let spanIznos = document.createElement('span');
    let divRemove = document.createElement('div');
    
    divRemove.textContent = 'x';
    divRemove.id = 'remove';
    divRemove.addEventListener('click', (e) => removeItem(e, operation, value));
    
    spanOpis.textContent = description.trim();

    if (operation == '-') {
        let spanProcenat = document.createElement('span');
        spanProcenat.id = 'procenat';
        
        spanIznos.textContent = `-${value.toFixed(2)}`
        spanProcenat.textContent = `${Math.round((100 * value) / ukupanPrihod)}%`;
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

function removeItem(e, operation, value) {
    e.target.parentElement.parentElement.remove();
    value = Number(value);

    if (operation == '-') {
        ukupanRashod -= value;
        saldo += value;
        displayRashod.textContent = `- ${ukupanRashod.toLocaleString()}`;
    } else {
        ukupanPrihod -= value;
        saldo -= value;
        displayPrihod.textContent = `+ ${ukupanPrihod.toLocaleString()}`;
    }
    
    ukupanProcenat = ((100 * ukupanRashod) / ukupanPrihod).toFixed();
    if (isNaN(ukupanProcenat)) ukupanProcenat = 0;

    displayProcenat.textContent = `${ukupanProcenat}%`;
    displaySaldo.textContent = `+ ${saldo.toLocaleString()} RSD`;
}