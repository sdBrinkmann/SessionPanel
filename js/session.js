import {Session, Box, Store} from "./modules/storage.js"
import {Success, Failure} from "./modules/util.js"

function getWindowTabs() {
    return browser.tabs.query({currentWindow: true});
}

let no_load = false;
document.addEventListener('DOMContentLoaded', () => {
    let option = browser.storage.local.get(items => {
	if (items.no_load == true)
	    no_load = true;
    });
    addSession();
    loadSession();
    deleteSession();
    saveSession();
    createSession();
});


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





// Load new Window by on Click

var thisArg = {custom: 'object'};

function loadSession() {
    document.querySelector(".Session-Box").addEventListener('click', async (e) => {
	if (e.target.classList.contains('open')) {

	    const pos = parseInt(e.target.parentElement.dataset.pos);	   
	    if (no_load == true) {
		//console.log('condition true');
		browser.runtime.sendMessage({
		    type: "loadSession",
		    pos: pos
		}).then((msg) => {
		    Store.saveName(msg[0], msg[1]);
		    //console.log(msg[0], msg[1]);
		    Success("Opening new Window ...", 8000);
		})
		    .catch( (err) => {console.log(err); Failure(err.message, 4000);});
	    }
	    else {
		try {
		    const Sessions = await Store.getSessions();
		    browser.windows.create({
			url: Sessions[pos].url,
			focused: false,
		    }).then( (windowInfo) => {
			Store.saveName(windowInfo.id, Sessions[pos].title);
			//console.log(windowInfo.id, Session[pos].title);
			Success("Opening new Window ...", 8000);
		    });
		}
		catch(err) {
		    console.log(err);
		    Failure(err.message, 4000);
		}
	    }
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
		
		try {
		    Store.getSessions().then((sessions) => {
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

// Create new Session upon Enter
function createSession() {
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
}

