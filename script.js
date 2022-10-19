// API Url in Variable speichern **********************************
const apiUrl = "https://dummy-apis.netlify.app/api/contact-suggestions?count=";

//Globale Variablen ***********************************************

let arrPersons = []; //Leeres Array für Personen aus Api
let contactList = document.querySelector(".contact-list");
let invitations = document.querySelector("#invitations");
let pendingCount = 0;

// Kontakte holen und anzeigen *************************************
getAndShow(8);

// *****************************************************************

async function getAndShow(count) {
  await getApiPerson(count);
  showApiPerson();
}

// *****************************************************************

async function getApiPerson(count) {
  const response = await fetch(apiUrl + count);
  const data = await response.json();
  for (element of data) {
    element.isPending = false;
    arrPersons.push(element);
  }
}

// *****************************************************************

function showApiPerson() {
  contactList.innerHTML = "";
  let output = "";
  for (let i = 0; i < arrPersons.length; i++) {
    const person = arrPersons[i];
    output += `
    <li class = "contact-item" style="background-image: url('${
      person.backgroundImage
    }')">
      <button class="remove-button" data-id="${i}">x</button>
      <img src="${person.picture}" class = "contact-picture"/>
      <h2>${person.name.title} ${person.name.first} ${person.name.last}</h2>
      <p>${person.title}</p>
      <p>${showMutualConnections(person.mutualConnections)}</p>
      <button class="connect-button" id="${i}">Connect</button>
    </li>
    `;
  }
  contactList.insertAdjacentHTML("afterbegin", output);
  addConnectEvent();
  addRemoveEvent();
}

// *****************************************************************

function showMutualConnections(mutualConnections) {
  if (mutualConnections < 1) {
    return "GFK";
  } else {
    return `${mutualConnections} Mutual Connections`;
  }
}

// *****************************************************************

function onConnecting(event) {
  const id = event.target.id;
  arrPersons[id].isPending = !arrPersons[id].isPending;

  if (arrPersons[id].isPending === true) {
    pendingCount++;
    event.target.innerText = "Pending";
  } else {
    pendingCount--;
    event.target.innerText = "Connect";
  }

  if (pendingCount === 1) {
    invitations.innerText = pendingCount + " pending invitation";
  } else if (pendingCount > 1) {
    invitations.innerText = pendingCount + " pending invitations";
  } else {
    invitations.innerText = "No pending invitations";
  }
}
// *****************************************************************

function addConnectEvent() {
  const connectButtons = document.querySelectorAll(".connect-button");
  for (let connectButton of connectButtons) {
    connectButton.addEventListener("click", onConnecting);
  }
}
// *****************************************************************

function addRemoveEvent() {
  const removeButtons = document.querySelectorAll(".remove-button");
  for (let removeButton of removeButtons) {
    removeButton.addEventListener("click", onRemoving);
  }
}

// *****************************************************************

function onRemoving(event) {
  const dataId = event.target.dataset.id;
  arrPersons.splice(dataId, 1);
  getAndShow(1);
}
