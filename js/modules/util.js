// utils.js 

// Toast Print

export function Success(Message, Duration) {
    const x = document.getElementById("toast");
    x.innerHTML = Message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, Duration);
}

export function Failure(Message, Duration) {
    const x = document.getElementById("toast");
    x.innerHTML = '<strong>Error: </strong>';
    x.innerHTML += Message;
    x.className = "show-fail";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, Duration);
}


// From Popup to TAB

export function getWindowTabs(getALL) {
    if (getALL == false || getALL == undefined)
	return browser.tabs.query({currentWindow: true});
    else
	return browser.tabs.query({});
}

document.querySelector("#open").onclick = () => {
    var SP_Id;
    const path = window.location.pathname;
    getWindowTabs().then((tabs) => {
	var SP = tabs.filter( tab =>
	    tab.url == browser.runtime.getURL(path));
	if (SP.length == 0) {
	    browser.tabs.create({ 
		url: browser.runtime.getURL(path)
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
