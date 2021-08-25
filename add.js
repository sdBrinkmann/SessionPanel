// add.js

import {Session, Box, Store} from "./storage.js";

// Get and List TABS

function getWindowTabs() {
    return browser.tabs.query({currentWindow: true});
}

function listTabs() {
    getWindowTabs().then((tabs) => {
	const List = document.getElementById('tabs-list');
	const currentTabs = document.createDocumentFragment();
	List.textContent = '';
	if(Reverse)
	    tabs = tabs.reverse();
	for (let tab of tabs) {
	    const Parent = document.createElement('div');
	    const Icon = document.createElement('img');
	    const Link = document.createElement('a');
	    const Del = document.createElement('img');

	    Parent.className = 'Tab-Item';
	    Icon.src = tab.favIconUrl;
	    Del.src = 'icons/delete-16.png';
	    Del.classList.add('d-b');
	    //Icon.setAttribute('rel', 'icon');
	    //Icon.setAttribute('href', tab.favIconUrl)
	    Link.textContent = tab.title || tab.id;
	    Link.setAttribute('href', tab.url);
	    Link.id = tab.id;
	    Link.classList.add('list-tabs');
	    Parent.appendChild(Icon);
	    Parent.appendChild(Link);
	    Parent.appendChild(Del);
	    currentTabs.appendChild(Parent);
	}
	List.appendChild(currentTabs);
    });
}



listTabs();
linkTabs();
closeTab();

// SWITCH & CLOSE TABS Functionality

function linkTabs() {
        document.querySelector("#tabs-list").addEventListener('click', function(e){
	    if (e.target.classList.contains('list-tabs')) {
		e.preventDefault();
	    //console.log(typeof  e.target.id);
		const ID = parseInt(e.target.id);
		browser.tabs.update(ID, {active: true});
	    }
	});
}

function closeTab() {
    document.querySelector("#tabs-list").addEventListener('click', async function(e) {
	if (e.target.classList.contains('d-b')) {
	    const ID = parseInt(e.target.previousSibling.id);
	    await browser.tabs.remove(ID);
	    e.target.parentElement.remove();
	    upTabNo();
	}
    });
}

function test() {
    document.querySelector(".testButton").onclick = () => {
	const x = document.getElementById("toast");
	x.className = "show";
	//alert("test");
	setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    }
}

//test();

// Display Number of TABS 


function upTabNo() {
    browser.tabs.query({currentWindow: true}).then((tabs) => {
    //console.log(tabs);
    document.querySelector(".NO").innerText = " (" + tabs.length + ")";
    });
}

upTabNo();

document.addEventListener('visibilitychange', async function() {
    if(document.visibilityState == "visible") {
	//alert('triggered');
	await upTabNo();
	listTabs();
    }
});


// Pop-up Modal


// Modal

const modal = document.getElementById("add");
const span = document.getElementsByClassName("close")[0];


span.onclick = function() {
    modal.style.display = "none";
}


function addSession() {
    document.querySelector(".add-icon").addEventListener('click', function(e) {
	modal.style.display = "block";
	document.getElementById('session-name').focus();
    });
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


addSession();

// Settings
const set = document.getElementById("set");
const set_close = document.getElementsByClassName("close-set")[0];

function Settings() {
    document.querySelector(".set-icon").addEventListener('click', function(e) {

	set.style.display = "block";

    });
}

set_close.onclick = function() {
    set.style.display = "none";
}

Settings();

// Donate

const don = document.getElementById("don");
const don_close = document.getElementsByClassName("close-don")[0];

function Donate() {
    document.querySelector(".don-icon").addEventListener('click', function(e) {

	don.style.display = "block";

    });
}

don_close.onclick = function() { 
    don.style.display = "none";
}

Donate();


// Save Session upon Enter

document.getElementById("session-name").onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if(keyCode  == '27') {
	alert('WHY');
	modal.style.display = 'none';
	return;
    }
    
    if(keyCode == '13') {
	let Name = this.value;
	if (Name.length > 28) {
	    Failure("Name is too long", 4000);
	    return;
	}
	if (Name.length == 0) {
	    Failure("No Title Given", 4000);
	    return;
	}
	    
	modal.style.display = 'none';
	try {
	    getWindowTabs().then(async (tabs) => {
		let url = []
		const tabs_leng = tabs.length;
		for (let tab of tabs) {
		    if(tab.url.startsWith("http"))
			url.push(tab.url);
		}
		const No_tabs = url.length;
		const session = new Session(Name, No_tabs, new Date(), url);
		const box = new Box();
		let  pos = await Store.addSession(session);
		box.addBox(session, pos);
		if ( (tabs_leng - 1)!== No_tabs)
		    Success(`New Session Added <br> ${tabs_leng - No_tabs - 1} tab(s) could not be saved`, 3000);
		else
		    Success("New Session Added", 3000);  
	    });
	}
	catch(err) {
	    console.log(err);
	    Failure(err.message, 3000);
	}
	document.getElementById("session-name").value = '';
    }
}


function hover(e) {
  e.target.setAttribute('src', 'icons/paypal-orange-64.png');
}

function unhover(e) {
  e.target.setAttribute('src', 'icons/paypal-64.png');
}

document.getElementById("paypal-button").addEventListener("mouseover", hover);
document.getElementById("paypal-button").addEventListener("mouseout", unhover);

// DOM Load Event

document.addEventListener('DOMContentLoaded', Store.displaySessions());


// Options
let Reverse = false;
document.querySelector('.check').checked = false;

document.querySelector('.check').addEventListener('change', (e) => {
    if(e.target.checked) {
	Reverse = true;
	listTabs();
    }
    else {
	Reverse = false;
	listTabs();
    }
});



// Toast Print

function Success(Message, Duration) {
    const x = document.getElementById("toast");
    x.innerHTML = Message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, Duration);
}

function Failure(Message, Duration) {
    const x = document.getElementById("toast");
    x.innerHTML = '<strong>Error: </strong>';
    x.innerHTML += Message;
    x.className = "show-fail";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, Duration);
}

