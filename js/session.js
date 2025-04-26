import {Session, Box, Store} from "./modules/storage.js"
import {Success, Failure} from "./modules/util.js"
import {w_config, listTabs} from "./add.js"


function getWindowTabs() {
    return browser.tabs.query({currentWindow: true});
}

let no_load = false;
let switch_tabs = false;

document.addEventListener('DOMContentLoaded', () => {
    let option = browser.storage.local.get(items => {
	if (items.no_load == true)
	    no_load = true;
	if (items.switch_tabs == true)
	    switch_tabs = true;
    });
    addSession();
    loadSession();
    deleteSession();
    saveSession();
    createSession();
    selectTabs();
});


// Modal

const modal = document.getElementById("add");
const span = document.getElementsByClassName("close")[0];


span.onclick = function() {
    modal.style.display = "none";
    document.getElementById('tab-selection').innerHTML = "";
    document.getElementById("select-tabs").innerHTML = "&#129170 Select Tabs individually"
    document.getElementById("select-tabs").dataset.expanded = "false"
    document.getElementById("select-tabs").dataset.all = "false"
}


function addSession() {
    document.querySelector(".add-icon").addEventListener('click', function(e) {
	modal.style.display = "block";
	document.getElementById('session-name').focus();
    });
}


window.onclick = function(event) {
    
    const sort_menu = document.getElementById("sort-lst")
    const sort_icon = document.getElementById("sort-tog")

    if (sort_menu.style.display == "block" && event.target != sort_icon &&
	event.target != sort_menu) {
	sort_menu.style.display = "none";
    }
    
    if (event.target == modal) {
	modal.style.display = "none";
	document.getElementById('tab-selection').innerHTML = "";
	document.getElementById("select-tabs").innerHTML = "&#129170 Select Tabs individually"
	document.getElementById("select-tabs").dataset.expanded = "false"
	document.getElementById("select-tabs").dataset.all = "false"
    }
}





// Load new Window by on Click

var thisArg = {custom: 'object'};

function setName(w_id, title, config) {
    const n = document.querySelector('.wName-input')
    
    n.value = title;


}

let undo_url_list;
let undo_window_title;

function Undo(Message, Duration) {
    const x = document.getElementById("toast");
    x.innerHTML = "Undo: "
    x.innerHTML += Message;
    x.className = "show-undo";
    setTimeout(function(){ x.className = x.className.replace("show-undo", ""); }, Duration);
}


document.getElementById("toast").addEventListener('click', async (e) => {
    if (e.target.classList.contains('show-undo')) {
	//console.log(undo_url_list);
	
	const Tabs = await browser.tabs.query({currentWindow: true});
	
	const winId = Tabs[0].windowId
	//console.log(await browser.sessions.getWindowValue(winId, 'name'))
	//const Sessions = await Store.getSessions();
	const remove_list =
	      Tabs.filter(t => (!(t.active &&
				  t.url == "moz-extension://48436b49-4063-47d5-9735-4910ef327247/main.html")))
	      .map(t => t.id)
	//console.log(remove_list)
	e.target.className = e.target.className.replace("show-undo", "");
	
	browser.tabs.remove(remove_list.splice(1))
	for (var i = 0; i < undo_url_list.length; i++) {
	    browser.tabs.create({
		active: false,
		discarded: no_load,
		url: undo_url_list[i],
	    })
	}
	browser.tabs.remove(remove_list[0])
	Store.saveName(winId, undo_window_title)
	Success(`Switched tabs back`, 3000);
	setTimeout(function(){			
	    setName(winId, undo_window_title, w_config)
	    listTabs()

	}, 3000);
    }
});

function loadSession() {
    document.querySelector(".Session-Box").addEventListener('click', async (e) => {
	if (e.target.classList.contains('open')) {

	    const pos = parseInt(e.target.parentElement.dataset.pos);	   
	    //console.log('condition true');
	    undo_window_title = await browser.sessions.getWindowValue(browser.windows.WINDOW_ID_CURRENT, 'name')
	    browser.runtime.sendMessage({
		type: "loadSession",
		pos: pos,
		noload: no_load,
		switch_t: switch_tabs,
	    }).then((msg) => {
		//Store.saveName(msg[0], msg[1]);
		//console.log(msg[0], msg[1]);
		if (switch_tabs) {
		    Success(`Switching tabs to Session ${msg[1]}`, 3000);
		    undo_url_list = msg[2]
			.filter(u => u != "moz-extension://48436b49-4063-47d5-9735-4910ef327247/main.html");
		    setTimeout(function(){			
			setName(msg[0], msg[1], w_config)
			listTabs()
			Undo("Switch tabs", 30000);
		    }, 3000);
		    //console.log(msg.res);
		    //window.location.reload();
		} else {
		    Success("Opening new Window ...", 8000);
		}
	    })
		.catch( (err) => {console.log(err); Failure(err.message, 4000);});
	    /*
	      else {
	      try {
	      const Sessions = await Store.getSessions();
	      browser.windows.create({
	      url: Sessions[pos].url,
	      focused: false,
	      }).then( (windowInfo) => {
	      Store.saveName(windowInfo.id, Sessions[pos].title);
	      console.log(windowInfo.id, Session[pos].title);
	      Success("Opening new Window ...", 8000);
	      });
	      }
	      catch(err) {
	      console.log(err);
	      Failure(err.message, 4000);
	      }
	      }
	    */
	    /*
	    const Tabs = await browser.tabs.query({currentWindow: true});
	    const winId = Tabs[0].windowId
	    const Sessions = await Store.getSessions();
	    for (var i = 0; i < Sessions[pos].url.length; i++) {
		browser.tabs.create({
		    discarded: no_load,
		    url: Sessions[pos].url[i],
		})
	    }
	    browser.tabs.remove(Tabs.map(t => t.id))
	    Store.saveName(winId, Sessions[pos].title)
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
    document.getElementById("session-name").onkeypress = async function(e) {
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
		let selection = document.getElementById("select-tabs")
		console.log(selection.dataset.expanded)
		if (selection.dataset.expanded == "true") {
		    console.log(document.getElementById("select-tabs"))
		    const node_list = document.getElementById("select-tabs").nextElementSibling.childNodes
		    let urls = []
		    for (let node of node_list) {
			if (node.childNodes[0].checked == true) {
			    console.log(node.childNodes[2].href);
			    urls.push(node.childNodes[2].href);
			}
		    }
		    const No_tabs = urls.length;
		    const session = new Session(Name, No_tabs, new Date(), urls);
		    const box = new Box();
		    let  pos = await Store.addSession(session);
		    box.addBox(session, pos);
		    Success("New Session Added", 3000);  
		    selection.innerHTML = "&#129170 Select Tabs individually"
		    selection.dataset.expanded = "false"
		    
		} else {
		    getWindowTabs().then(async (tabs) => {
			let url = []
			console.log(tabs)
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
		
	    }
	    catch(err) {
		console.log(err);
		Failure(err.message, 3000);
	    }
	    document.getElementById("session-name").value = '';
	    document.getElementById('tab-selection').innerHTML = "";
	    e.srcElement.dataset.expanded = "false"
	}
    }

    document.querySelector('#save-button').addEventListener('click', async (e) => {
	e.preventDefault();
	console.log("Clicked on save button");
	console.log(e.srcElement.previousSibling.previousSibling.value);
	let Name = e.srcElement.previousSibling.previousSibling.value;
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
	    let selection = document.getElementById("select-tabs")
	    console.log("Expanded: " + e.srcElement.dataset.expanded)
	    if (selection.dataset.expanded == "true") {
		console.log(document.getElementById("select-tabs"))
		const node_list = document.getElementById("select-tabs").nextElementSibling.childNodes
		let urls = []
		for (let node of node_list) {
		    if (node.childNodes[0].checked == true) {
			console.log(node.childNodes[2].href);
			urls.push(node.childNodes[2].href);
		    }
		}
		const No_tabs = urls.length;
		const session = new Session(Name, No_tabs, new Date(), urls);
		const box = new Box();
		let  pos = await Store.addSession(session);
		box.addBox(session, pos);
		Success("New Session Added", 3000);  
		selection.innerHTML = "&#129170 Select Tabs individually"
		selection.dataset.expanded = "false"
		
	    } else {
		getWindowTabs().then(async (tabs) => {
		    let url = []
		    let header = []
		    let favIcon = []
		    const tabs_leng = tabs.length;
		    console.log(tabs)
		    for (let tab of tabs) {
			if(tab.url.startsWith("http")) {
			    url.push(tab.url);
			    header.push(tab.title)
			    favIcon.push(tab.favIconUrl)
			}
		    }
		    const No_tabs = url.length;
		    const session = new Session(Name, No_tabs, new Date(), url, header, favIcon);
		    const box = new Box();
		    let  pos = await Store.addSession(session);
		    box.addBox(session, pos);
		    if ( (tabs_leng )!== No_tabs)
			Success(`New Session Added <br> ${tabs_leng - No_tabs} tab(s) could not be saved`, 3000);
		    else
			Success("New Session Added", 3000);  
		});
	    }
	}
	catch(err) {
	    console.log(err);
	    Failure(err.message, 3000);
	}
	document.getElementById("session-name").value = '';
	document.getElementById('tab-selection').innerHTML = "";
	e.srcElement.dataset.expanded == "false"
    });
    
}

function selectTabs() {
    document.querySelector('#select-tabs').addEventListener('click', async (e) => {
	e.preventDefault();
	console.log("Clicked on expand");
	console.log(e.srcElement.dataset.expanded);
	if (e.srcElement.dataset.expanded == "false") {
	    select(false);
	    e.srcElement.innerHTML = "&#129171 Select all"
	    e.srcElement.dataset.expanded = "true"
	}
	else if (e.srcElement.dataset.all == "false") {
	    //document.getElementById('tab-selection').innerHTML = "";
	    select(true)
	    e.srcElement.innerHTML = "&#129171 Select Tabs individually";
	    //e.srcElement.dataset.expanded = "false"
	    e.srcElement.dataset.all = "true"
	} else if (e.srcElement.dataset.expanded == "true") {
	    select(false)
	    e.srcElement.innerHTML = "&#129171 Select all"
	    e.srcElement.dataset.all = "false"
	}
    });

}


async function select(all) {
    await getWindowTabs().then(async (tabs) => {
	let winInfo = await browser.windows.getCurrent(); 
	//console.log(winInfo);
	let id_active;
	const List = document.getElementById('tab-selection');
	const currentTabs = document.createDocumentFragment();
	List.textContent = '';
	let index = 0;
	let double_current = [];
	//if(Reverse)
	//    tabs = tabs.reverse();
	for (let tab of tabs) {
	    if(tab.url.startsWith("http")) {
		//console.log(tab);
		const Parent = document.createElement('div');
		const Check = document.createElement('input');
		const Icon = document.createElement('img');
		const Link = document.createElement('a');
		//const Del = document.createElement('img');


		Check.setAttribute("type", "checkbox");		
		if (all == true) { 
		    Check.setAttribute("checked", "");
		}
		Check.classList.add('checkbox');
		//Parent.className = 'Tab-Item';
		Icon.src = tab.favIconUrl;
		Icon.classList.add('icon');
		//Del.src = 'icons/delete-16.png';
		//Del.classList.add('d-b');
		//Icon.setAttribute('rel', 'icon');
		//Icon.setAttribute('href', tab.favIconUrl)
		Link.textContent = tab.title || tab.id;
		Link.setAttribute('href', tab.url);
		
		/*if (dragNdrop == true) {
		  Link.setAttribute('draggable', false);
		  Parent.setAttribute('draggable', true);
		  }
		*/
		//Link.id = tab.id;
		Parent.classList.add('link-item');
		//Link.style.color = text_color;
		Parent.appendChild(Check);
		Parent.appendChild(Icon);
		Parent.appendChild(Link);
		//Parent.appendChild(Del);
		
		currentTabs.appendChild(Parent);
	    }
	}
	List.appendChild(currentTabs);

    });

}
