// utils.js 

import  {Store} from "./storage.js"

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

export function hover(e, src) {
  e.target.setAttribute('src', src);
}

export function unhover(e, src) {
  e.target.setAttribute('src', src);
}


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


export function deleteSession() {

    if (window.location.pathname == "/main.html") {
    document.querySelector(".Session-Box").addEventListener('click', function(e) {
	if(e.target.id == "delete") {
	    const pos = e.target.parentElement.dataset.pos;
	    const tag = e.target.parentNode.childNodes[0].innerHTML;
	    let name = tag.replace(/\([0-9]*\)$/g,'');
	    let NO = tag.match(/\d+(?!.*\d)/);
	    console.log(e.target)
	    if (window.confirm(`Delete Session ${name}with ${NO} Tabs ?`)) {
		
		try {
		    Store.getSessions().then((sessions) => {
			// CHECK TITLE AS SECURITY CHECK
			const del = sessions.splice(pos, 1);
			browser.storage.local.set({
			    'sessions': JSON.stringify(sessions)
			});
			//console.log("DELETE");
			//console.log(e.target);
			let next = e.target.parentElement.nextElementSibling;
			while (next) {
			    let Pos = parseInt(next.dataset.pos) - 1;
			    next.dataset.pos = Pos;
			    next = next.nextElementSibling;
			}
			e.target.parentElement.remove();
			Success("Session Deleted", 3000);
		    });
		}
		catch(err) {
		    console.log(err);
		    Failure(err.message, 3000);
		}
	    }
	}

    });
    } else {
	document.querySelector(".inspect-head").addEventListener('click', function(e) {
	    if(e.target.id == "delete-session") {
		const pos = e.target.parentElement.dataset.pos;
		const tag = e.target.parentNode.childNodes[0].innerHTML;
		let name = tag.replace(/\([0-9]*\)$/g,'');
		let NO = tag.match(/\d+(?!.*\d)/);
		console.log(e.target)
		if (window.confirm(`Delete Session ${name}with ${NO} Tabs ?`)) {
		    
		    try {
			Store.getSessions().then((sessions) => {
			    // CHECK TITLE AS SECURITY CHECK
			    const del = sessions.splice(pos, 1);
			    browser.storage.local.set({
				'sessions': JSON.stringify(sessions)
			    });
			    //console.log("DELETE");
			    //console.log(e.target);
			    let next = e.target.parentElement.nextElementSibling;
			    location.reload()
			    Success("Session Deleted", 3000);
			});
		    }
		    catch(err) {
			console.log(err);
			Failure(err.message, 3000);
		    }
		}
	    }

	});
    }

}

//deleteSession();
