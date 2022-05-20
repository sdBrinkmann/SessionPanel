// add.js

import {Session, Box, Store} from "./storage.js";

// Options

let Reverse = false;
let highlight_active = true;
let highlight_double = false;
let auto_scroll = false;
export let rc_color = 'darkred';
export let rc_font_color;
export let text_color = 'white';




document.addEventListener('DOMContentLoaded', () => {
    let order = browser.storage.local.get(items => {
	if (items.background_color != undefined) {
	    document.body.style.backgroundColor = items.background_color;
	}
	if (items.rightmost == true) {
	    document.querySelector('#listorder').checked = true;
	    Reverse = true;
	}
	if (items.font_color == "black") {
	    text_color = 'black';
	    document.body.style.color = 'black';
	}
	if (items.font_rc_color == 'black') {
	    rc_font_color = 'black';
	}
	else if (items.font_rc_color == 'white') {
	    rc_font_color = 'white';
	}
	if (items.highlight_active == false) {
	    highlight_active = false;
	}
	if (items.auto_scroll == true) {
	    auto_scroll = true;
	}
	if (items.highlight_double == true) {
	    highlight_double = true;
	}

	if (items.rectangle_color != undefined) 
	    rc_color = items.rectangle_color;
	
	listTabs();
	linkTabs();
	closeTab();
	Store.displaySessions();
    });
});




// Get and List TABS

function getWindowTabs() {
    return browser.tabs.query({currentWindow: true});
}

function listTabs() {
    getWindowTabs().then((tabs) => {
	console.log(browser.windows.getCurrent());
	let id_active;
	const List = document.getElementById('tabs-list');
	const currentTabs = document.createDocumentFragment();
	List.textContent = '';
	let index = 0;
	let double_current = [];
	if(Reverse)
	    tabs = tabs.reverse();
	for (let tab of tabs) {
	    //console.log(tab);
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
	    Link.style.color = text_color;
	    Parent.appendChild(Icon);
	    Parent.appendChild(Link);
	    Parent.appendChild(Del);
	    console.log(tab.windowId);
	    if (tab.active == true) id_active = tab.id;
	    
	    if (tab.active == true && highlight_active == true) 
		Parent.style.backgroundColor = '#001ab2aa'

	    if (highlight_double == true) {
		for (var j = 0; j < double_current.length; j++) {
		    if (double_current[j] == tab.id) 
			Parent.style.backgroundColor = '#ff751aaa';
		}
		
		for (var i = index + 1; i < tabs.length; i++) {
		    if (tabs[i].url == tab.url) {
			Parent.style.backgroundColor = '#ff751aaa';
			double_current.push(tabs[i].id);
		    }
		}
		index++;
	    }
	    
	    currentTabs.appendChild(Parent);
	}
	List.appendChild(currentTabs);

	var element = document.getElementById(id_active);
	if (auto_scroll == true)
	    element.scrollIntoView({block: "center"});
    });
}



//listTabs();

// SWITCH & CLOSE TABS Functionality

function linkTabs() {
        document.querySelector("#tabs-list").addEventListener('click', function(e){
	    if (e.target.classList.contains('list-tabs')) {
		e.preventDefault();
	    //console.log(typeof  e.target.id);
		const ID = parseInt(e.target.id);
		browser.tabs.update(ID, {active: true});
		listTabs();
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
	    if (highlight_active == true)
		listTabs();
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
    var SP_Id;
    getWindowTabs().then((tabs) => {
	var SP = tabs.filter( tab =>
	    tab.url == browser.runtime.getURL('/main.html'));
	if (SP.length == 0) {
	    browser.tabs.create({ 
		url: browser.runtime.getURL('/main.html')
	    });
	    window.close();
	}
	else {
	    browser.tabs.update(SP[0].id, {active: true}).then( () => {
		window.close();
	    });
	}
    });
 
 
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
	//window.location.reload();
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
	if (rc_font_color == 'black' ||
	    (text_color == 'black' && rc_font_color != 'white')) {
	    hover(event, 'icons/save-hover-b-24.png');
	}
	else
	    hover(event, 'icons/save-hover-24.png');
    }
});

document.addEventListener("mouseout", function(e) {
    if (e.target && e.target.id == "overwrite") {
	if (rc_font_color == 'black' ||
	    (text_color == 'black' && rc_font_color != 'white')) {
	    unhover(event, 'icons/save-b-24.png');
	}
	else
	    unhover(event, 'icons/save-b-24.png');
    }
});

document.getElementById("don-icon").addEventListener("mouseover", function() {
    hover(event, 'icons/heart-full-32.png');
}, false);
document.getElementById("don-icon").addEventListener("mouseout", function() {
    unhover(event, 'icons/heart-32.png');}, false);



document.getElementById("paypal-button").addEventListener("mouseover", function() {
    hover(event, 'icons/paypal-orange-64.png');
}, false);
document.getElementById("paypal-button").addEventListener("mouseout", function() {
    unhover(event, 'icons/paypal-64.png');}, false);


// Options Change

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


