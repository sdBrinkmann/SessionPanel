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



//listTabs();
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

// From Popup to TAB

document.querySelector("#open").onclick = () => {
    browser.tabs.create({
	url: browser.runtime.getURL('/main.html')
    });
    window.close();
}


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

	//set.style.display = "block";
	browser.runtime.openOptionsPage();
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
		if ( (tabs_leng )!== No_tabs)
		    Success(`New Session Added <br> ${tabs_leng - No_tabs} tab(s) could not be saved`, 3000);
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


function hover(e, src) {
  e.target.setAttribute('src', src);
}

function unhover(e, src) {
  e.target.setAttribute('src', src);
}

/*
window.onload = function () {
document.getElementsByClassName("save-button").addEventListener("mouseover", function() {
    hover(event, 'save-hoover-24.png');
}, false);
};
*/

document.addEventListener("mouseover", function(e) {
    if (e.target && e.target.id == "overwrite") {
	hover(event, 'icons/save-hover-24.png');
    }
});

document.addEventListener("mouseout", function(e) {
    if (e.target && e.target.id == "overwrite") {
	unhover(event, 'icons/save-24.png');
    }
});


document.getElementById("paypal-button").addEventListener("mouseover", function() {
    hover(event, 'icons/paypal-orange-64.png');
}, false);
document.getElementById("paypal-button").addEventListener("mouseout", function() {
    unhover(event, 'icons/paypal-64.png');}, false);

// DOM Load Event

document.addEventListener('DOMContentLoaded', Store.displaySessions());


// Options
let Reverse = false;
document.addEventListener('DOMContentLoaded', () => {
    let order = browser.storage.local.get('rightmost', item => {
	if (item.rightmost == true) {
	    document.querySelector('#listorder').checked = true;
	    Reverse = true;
	    listTabs();
	}
	else if (item.rightmost == false || item.rightmost == undefined) {
	    document.querySelector('#listorder').checked = false;
	    Reverse = false;
	    listTabs();
	}
    });
});

document.querySelector('#listorder').addEventListener('change', (e) => {
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

