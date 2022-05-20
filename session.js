import {Session, Box, Store} from "./storage.js"

function getWindowTabs() {
    return browser.tabs.query({currentWindow: true});
}

let no_load = false;
document.addEventListener('DOMContentLoaded', () => {
    let option = browser.storage.local.get(items => {
	if (items.no_load == true)
	    no_load = true;
    });
    loadSession();
    deleteSession();
    saveSession();
});



// Load new Window by on Click

var thisArg = {custom: 'object'};

function loadSession() {
    document.querySelector(".Session-Box").addEventListener('click', async (e) => {
	if (e.target.classList.contains('open')) {
	    const Sessions = await Store.getSessions();
	    const pos = parseInt(e.target.parentElement.dataset.pos);
	    //try {
		if (no_load == true) {
		    console.log('condition true');
		    browser.windows.create({
			url: Sessions[pos].url[0],
		    }).then( (windowInfo) => {
			console.log(`Created window: ${windowInfo.id}`);
			for (var i = 1; i < Sessions[pos].url.length; i++) {
			    browser.tabs.create({
				discarded: true,
				url: Sessions[pos].url[i],
				windowId: windowInfo.id
			    });
			}
		    });
		}
		else {
		    browser.windows.create({
			url: Sessions[pos].url
		    });
		}
		Success("Opening new Window ...", 2000);
	   // }
	    /*catch(err) {
		console.log(err);
		Failure(err.message, 3000);
	}
	*/
	}
    });
}



function deleteSession() {
    document.querySelector(".Session-Box").addEventListener('click', function(e) {
	if(e.target.id == "delete") {
	    const pos = e.target.parentElement.dataset.pos;
	    const tag = e.target.parentNode.childNodes[0].innerHTML;
	    let name = tag.replace(/\([0-9]*\)$/g,'');
	    let NO = tag.match(/\d+(?!.*\d)/);
	    if (window.confirm(`Delete Session ${name}with ${NO} Tabs ?`)) {
		e.target.parentElement.remove();
		try {
		Store.getSessions().then((sessions) => {
		    const del = sessions.splice(pos, 1);
		    browser.storage.local.set({
			'sessions': JSON.stringify(sessions)
		    });
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

//deleteSession();

// aka overwrite Session
 
function saveSession() {
    document.querySelector(".Session-Box").addEventListener('click', function(e) {
	if(e.target.id == "overwrite") {
	    const pos = e.target.parentElement.dataset.pos;
	    const tag = e.target.parentNode.childNodes[0].innerHTML;
	    const name = tag.replace(/\([0-9]*\)$/g,'');
	    //const NO = tag.match(/\d+(?!.*\d)/);
	    if (window.confirm(`Overwrite Session ${name}?`)) {
		console.log(name);
		//e.target.parentElement.remove();
		try {
		    getWindowTabs().then(async (tabs) => {
			const tabs_leng = tabs.length;
			let url = []
			for (let tab of tabs) {
			    if(tab.url.startsWith("http"))
				url.push(tab.url);
			}
			const No_tabs = url.length;
			const date = new Date();
			const session = new Session(name, No_tabs, date, url);
			const box = new Box();
			await Store.overwriteSession(session, pos);
			e.target.parentNode.childNodes[0].innerText = name + '(' + No_tabs + ')';
			//e.target.parentNode.childNodes[2].innerHTML = date.toLocaleString();
			if ( (tabs_leng) !== No_tabs)
			    Success(`Session overwriten <br/> ${tabs_leng - No_tabs} tab(s) could not be saved`, 3000);
			else
			    Success("Session overwriten", 3000);
			//box.insertBox(session, pos);
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

//saveSession();


// Duplicate Function
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
