// add.js

import {Session, Box, Store} from "./storage.js";

// Options

let Reverse = false;
let highlight_active = true;
let highlight_double = false;
let highlight_any = false;
let auto_scroll = false;
let dragNdrop = true;
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

	if (items.highlight_any == true)
	    highlight_any = true;

	if (items.rectangle_color != undefined) 
	    rc_color = items.rectangle_color;

	if (items.dragndrop == false)
	    dragNdrop = false;
	else {
	    dragStart();
	    dragEnter();
	    dragOver();
	    dragLeave();
	    dragDrop();
	}
	
	listTabs(true);
	linkTabs();
	closeTab();
	switchWin();
	Store.displaySessions();
    });
});




// Get and List TABS

function getWindowTabs(getALL) {
    if (getALL == false || getALL == undefined)
	return browser.tabs.query({currentWindow: true});
    else
	return browser.tabs.query({});
}

async function listTabs(ac = false) {
    let id_active;
    await getWindowTabs(highlight_any).then(async (tabs) => {
	let winInfo = await browser.windows.getCurrent(); 
	//console.log(winInfo);
	// let id_active;
	const List = document.getElementById('tabs-list');
	const currentTabs = document.createDocumentFragment();
	List.textContent = '';
	let index = 0;
	let double_current = [];
	if(Reverse)
	    tabs = tabs.reverse();
	for (let tab of tabs) {
	    //console.log(tab);
	    if (highlight_any == true &&  tab.windowId != winInfo.id) continue;
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
	    
	    if (dragNdrop == true) {
		Link.setAttribute('draggable', false);
		Parent.setAttribute('draggable', true);
	    }
	    Link.id = tab.id;
	    Link.classList.add('list-tabs');
	    Link.style.color = text_color;
	    Parent.appendChild(Icon);
	    Parent.appendChild(Link);
	    Parent.appendChild(Del);
	    
	    if (tab.active == true) id_active = tab.id;
	    


	    if (highlight_double == true && highlight_any != true) {
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

	    if (highlight_any == true) {
		for (var i = 0; i < tabs.length; i++) {
		    if (tabs[i].url == tab.url && tabs[i].id != tab.id) {
			Parent.style.backgroundColor = '#800040';
			double_current.push(tabs[i].id);
		    }
		}
		index++;
	    }

	    if (tab.active == true && highlight_active == true) 
		Parent.style.backgroundColor = '#001ab2aa'
	    
	    currentTabs.appendChild(Parent);
	}
	List.appendChild(currentTabs);
	      
    
    });
    //console.log("NOT WORKING; WHY>");
	
    if (auto_scroll == true && ac == true) {
	document.getElementById(id_active).scrollIntoView({block: "center"});
	//document.querySelector(".box-1").scrollTop = 80;
	//element.parentElement.parentElement.parentElement.scroll(0, 200);
	//element.parentElement.parentElement.parentElement.addEventListener("scroll", e => {
	//console.log("ScrollTop:", e.target.scrollTop)});
    }
}



//listTabs();

// Drag n'Drop
function dragStart() {
    document.querySelector("#tabs-list").addEventListener('dragstart', function(e) {
	console.log("Drag Start");
	console.log(e.target);
	e.dataTransfer.setData('text/uri-list', e.target.childNodes[1].href);
	e.dataTransfer.setData('text/plain', e.target.childNodes[1].id);
	    });
}

function dragEnter() {
    document.querySelector("#tabs-list").addEventListener('dragenter', function(e) {
	e.preventDefault();
	/*
	  if (e.target.classList.contains('list-tabs')) {
	  e.target.parentNode.style.borderTop = "solid purple";
	  //window.setTimesout(() => {e.target.parentNode.style.borderTop = '';}, 10);
	  }
	*/
	/*if (e.target.classList.contains('Tab-Item')) {
	    e.target.style.borderTop = "solid purple";
	    e.target.style.borderLeft = "solid purple";
	}
	
	else {
	    e.target.parentElement.style.borderTop = "solid purple";
	    e.target.parentElement.style.borderLeft = "solid purple";
	}
	*/
    });

    document.querySelector(".Window-Box").addEventListener('dragover', function(e) {
	e.preventDefault();
	if (e.target.classList.contains('Window-Item')) 
	    e.target.style.border = "thin solid red";	    
	else if (e.target.parentElement.classList.contains('Window-Item'))
	    e.target.parentElement.style.border = "thin solid red";
	  
    });
    
    document.querySelector(".Session-Box").addEventListener('dragover', function(e) {
	e.preventDefault();
	if (e.target.classList.contains('Box-Item')) 
	    e.target.style.border = "thin solid red";	    	
	else if (e.target.parentElement.classList.contains('Box-Item')) 
	    e.target.parentElement.style.border = "thin solid red";
	
    });
}

function dragOver() {
    document.querySelector("#tabs-list").addEventListener('dragover', function(e) {
	//console.log(e.target.id);
	e.preventDefault();
	if (e.target.classList.contains('Tab-Item')) {
	    e.target.style.borderTop = "solid purple";
	    e.target.style.borderLeft = "solid purple";
	}
	
	else {
	    e.target.parentElement.style.borderTop = "solid purple";
	    e.target.parentElement.style.borderLeft = "solid purple";
	}

    });

    document.querySelector(".Window-Box").addEventListener('dragover', function(e) {
	//console.log(e.target.id);
	e.preventDefault();
    });
    
    document.querySelector(".Session-Box").addEventListener('dragover', function(e) {
	//console.log(e.target.id);
	e.preventDefault();
    });
}

function dragLeave() {
    document.querySelector("#tabs-list").addEventListener('dragleave', function(e) {
	e.preventDefault();
	if (e.target.classList.contains('Tab-Item')) {
	    e.target.style.borderTop = "";
	    e.target.style.borderLeft = "";
	}
	else {
	    e.target.parentElement.style.borderTop = "";
	    e.target.parentElement.style.borderLeft = "";
	}
	    
    });

    document.querySelector(".Window-Box").addEventListener('dragleave', function(e) {
	e.preventDefault();
	if (e.target.classList.contains('Window-Item')) 
	    e.target.style.border = "";	    
	else
	    e.target.parentElement.style.border = "";
    });

    document.querySelector(".Session-Box").addEventListener('dragleave', function(e) {
	e.preventDefault();
	if (e.target.classList.contains('Box-Item')) 
	    e.target.style.border = "";
	else
	    e.target.parentElement.style.border = "";
	
    });
}

function dragDrop() {
    // Move tab within Tab List / Current Window
    document.querySelector("#tabs-list").addEventListener('drop', async function(e) {
	e.preventDefault();
	//console.log(e.target);
	e.target.style.borderTop = "";
	e.target.style.borderLeft = "";
	let data = e.dataTransfer.getData('text/plain');

	
	if (e.target.classList.contains('list-tabs')) {
	    let tabInfo = await browser.tabs.get(parseInt(e.target.id));
	    browser.tabs.move(parseInt(data), {index: tabInfo.index});
	    listTabs();
	}
	else if (e.target.classList.contains('Tab-Item')) {
	    let tabInfo = await browser.tabs.get(parseInt(e.target.childNodes[1].id));
	    browser.tabs.move(parseInt(data), {index: tabInfo.index});
	    listTabs();
	}	
    });
    
    // Move tab to other window
    document.querySelector(".Window-Box").addEventListener('drop', async function(e) {
	e.preventDefault();
	//console.log(e.target);

	let data = e.dataTransfer.getData('text/plain');
	
	
	if (e.target.classList.contains('Window-Item')) {
	    e.target.style.border = "";
	    e.target.style.border = "";
	    browser.tabs.move(parseInt(data), {
		windowId: parseInt(e.target.dataset.wid),
		index: -1,	    
	    });
	    const len = parseInt(e.target.childNodes[1].dataset.tabs) + 1;
	    e.target.childNodes[1].innerText = '(' + len  + ' Tabs)';
	    e.target.childNodes[1].setAttribute("data-tabs", len);
	    listTabs();
	    
	}

	else if (e.target.classList.contains('w-text')) {
	    //console.log("DROP AT WINDOW <P> WITH ID: ", parseInt(data));
	    //console.log(e.target);
	    e.target.parentElement.style.border = "";
	    e.target.parentElement.style.border = "";
	    browser.tabs.move(parseInt(data), {
		windowId: parseInt(e.target.parentElement.dataset.wid),
		index: -1,
	    });
	    console.log(e.target);
	    const len = parseInt(e.target.nextSibling.dataset.tabs) + 1;
	    e.target.nextSibling.innerText = '(' + len  + ' Tabs)';
	    e.target.nextSibling.setAttribute("data-tabs", len);
	    listTabs();
	}
	
	else if (e.target.classList.contains('w-text-tabs')) {
	    //console.log("DROP AT WINDOW <P> WITH ID: ", parseInt(data));
	    //console.log(e.target);
	    e.target.parentElement.style.border = "";
	    e.target.parentElement.style.border = "";
	    browser.tabs.move(parseInt(data), {
		windowId: parseInt(e.target.parentElement.dataset.wid),
		index: -1,
	    });
	    console.log(e.target);
	    const len = parseInt(e.target.dataset.tabs) + 1;
	    e.target.innerText = '(' + len  + ' Tabs)';
	    e.target.setAttribute("data-tabs", len);
	    listTabs();
	}
	
	
    });

    // Move tab to saved session
    document.querySelector(".Session-Box").addEventListener('drop', async function(e) {
	e.preventDefault();
	//console.log(e.target);

	let data = e.dataTransfer.getData('text/plain');
	const u = e.dataTransfer.getData('text/uri-list');
	
	if (e.target.classList.contains('Box-Item')) {
	    e.target.style.border = "";
	    e.target.style.border = "";
	    addSession(u, e.target.dataset.pos, e.target.childNodes[0]);
	    //listTabs();   DELETE TAB OR NOT ????????????????????????????????????????
	    
	}
	 
	else if (e.target.classList.contains('open')) {
	    //console.log("DROP AT WINDOW <P> WITH ID: ", parseInt(data));
	    //console.log(e.target);
	    e.target.parentElement.style.border = "";
	    e.target.parentElement.style.border = "";
	    addSession(u, e.target.parentElement.dataset.pos, e.target);
	    // listTabs(); DELETE TAP OR NOT ??????????????????????????????????????
	}
	
    });
}

// Utility function
async function addSession(tab_url, pos, node) {
    if (tab_url.startsWith("http")) {
	try {
	    const R = await Store.getSessions();
	    const S = R[pos];
	    console.log("S");
	    console.log(S);
	    const len = S.url.length + 1;
	    
	    await Store.overwriteSession(new Session(S.title, len, S.date, S.url.concat(tab_url)), pos);
	    
	    node.innerText = S.title + '(' + len + ')';
	    Success("Tab added to Session ", 3000);
	}
	catch(err) {
	    console.log(err);
	    Failure(err.message, 3000);
	}
    } else {
	Failure("Tab cannot be saved!", 3000);
    }
}


    
// SWITCH & CLOSE TABS Functionality

function linkTabs() {
    document.querySelector("#tabs-list").addEventListener('click', function(e){
	if (e.target.classList.contains('list-tabs')) {
	    e.preventDefault();
	    //console.log(typeof  e.target.id);
	    const ID = parseInt(e.target.id);
	    browser.tabs.update(ID, {active: true});
	    listTabs(false);
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
		listTabs(false);
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

function switchWin() {
    const classes = ['w-text', 'w-text-tabs'];
    document.querySelector(".Window-Box").addEventListener('click', function(e){
	if (e.target.classList.contains('Window-Item')) {
	    e.preventDefault();
	    //console.log(typeof  e.target.id);
	    const ID = parseInt(e.target.dataset.wid);
	    console.log("ID::", ID);
	    browser.windows.update(ID, {focused: true});
	}
	else if (classes.some(c => e.target.classList.contains(c))) {
	    e.preventDefault();
	    const ID = parseInt(e.target.parentElement.dataset.wid);
	    browser.windows.update(ID, {focused: true});
	}
    });
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
    document.querySelector("#NO").innerText = " (" + tabs.length + ")";
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
	    unhover(event, 'icons/save-24.png');
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


