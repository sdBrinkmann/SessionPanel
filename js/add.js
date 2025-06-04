// add.js

import {Session, Box, Store} from "./modules/storage.js";
import {Success, Failure, getWindowTabs, hover, unhover} from "./modules/util.js";
import {Windows} from "./modules/windows.js";
import {init} from "./modules/init.js";

// Options

let Reverse = false;
let rev_default = false;
let highlight_active = true;
let highlight_double = false;
let highlight_any = false;
let auto_scroll = false;
let dragNdrop = true;
let sort_fn = null;
let show_url = false;
let sort_setting = "sort-default"

//export let rc_color = 'darkred';
export let rc_font_color;
export let text_color = 'white';
export let rec = [];

export const w_config = {
    w_color: '#483D8B',
    w_font_color: "white",
    background: '#00001a',
    t_color: 'white',
};

document.addEventListener('DOMContentLoaded', async () => {
    let order = await browser.storage.local.get(async items => {
	if (items.background_color != undefined) {
	    document.body.style.backgroundColor = items.background_color;
	    w_config.background = items.background_color;
	}
	const style = document.createElement('style')

	if (items.font_color == "black") {
	    text_color = 'black';
	    document.body.style.color = 'black';
	    w_config.t_color = 'black';

	    const css = '.Tab-Item:hover {box-shadow: inset 0 0 0 10em rgba(0, 0, 0, 0.08);}';

	    if (style.styleSheet) {
		style.styleSheet.cssText = css;
	    } else {
		style.appendChild(document.createTextNode(css));
	    }
	    
	    document.getElementById("search-tog").src = "icons/search_48_b.png"
	    document.getElementById("sort-tog").src = "icons/sort_48_b.png"
	    document.getElementById("show-url").src = "icons/expand-all-b-48.png"
	    document.querySelector(".outward").src = "icons/chevron-right-b-48.png"
	    document.getElementById("session-header").style.color = "black"

	    document.getElementById("open").src = "icons/arrow-down-b-48.png"
	} else {
	    const css = '.Tab-Item:hover {box-shadow: inset 0 0 0 10em rgba(255, 255, 255, 0.08);}';
	    if (style.styleSheet) {
		style.styleSheet.cssText = css;
	    } else {
		style.appendChild(document.createTextNode(css));
	    }
	}
	document.getElementsByTagName('head')[0].appendChild(style);

	if (items.search_box_color != undefined) {
	    document.getElementById("search").style.backgroundColor = items.search_box_color
	}
	if (items.search_on == true) {
	    document.getElementById("sIn").style.display = "inline"
	    
	}
	if (items.font_rc_color == 'black') {
	    rc_font_color = 'black';
	}
	else if (items.font_rc_color == 'white') {
	    rc_font_color = 'white';
	}
	w_config.w_font_color = items.font_color;
	if (items.font_win_color == 'black')
	    w_config.w_font_color = 'black';
	else if (items.font_win_color == 'white')
	    w_config.w_font_color = 'white';
	
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

	//if (items.rectangle_color != undefined) 
	//    rc_color = items.rectangle_color;
	if (items.win_color != undefined)
	    w_config.w_color = items.win_color;
	if (items.dragndrop == false)
	    dragNdrop = false;
	else {
	    dragStart();
	    dragEnter();
	    dragOver();
	    dragLeave();
	    dragDrop();
	}

	if (items.default_ordering != undefined) {
	    switch(items.default_ordering) {
	    case "tab-order":
		sort_fn = null;
		sort_setting = "sort-default";
		break;
	    case "title":
		sort_fn = sortTitle;
		sort_setting = "sort-title";
		break;
	    case "url":
		sort_fn = sortURL;
		sort_setting = "sort-url";
		break;
	    case "last-accessed":
		sort_fn = sortLastAccessed;
		sort_setting = "sort-accessed";
		break;
	    case "audible":
		sort_fn = sortAudio;
		sort_setting = "sort-audio";
		break;
	    }
	}

	if (items.rightmost == true) {
	    if (sort_fn == null) {
		Reverse = true;
		document.querySelector('#listorder').checked = true;
	    }
	    rev_default = true;
	}
	rec =  await init();
	setSortDefault(sort_setting);
	listTabs(true);
	linkTabs();
	closeTab();
	switchWin();
	Windows.display(w_config);
	Store.displaySessions(rec);

    });
    
});

// SEARCH FUNCTION

document.getElementById("search").addEventListener("input", e => {
    //console.log("Entered: " + e.target.value)
    console.log(e.target.nextElementSibling.style.display)
    if (e.target.nextElementSibling.style.display == "none" ||
       e.target.nextElementSibling.style.display == "") {
	e.target.nextElementSibling.style.display = "block"
    }
    listTabs();
});

document.getElementById("clear-search").addEventListener('click', function(e) {
    console.log(e);
    e.target.previousElementSibling.value = ""
    e.target.style.display = "none"
    listTabs();
});


document.querySelector("#search-tog").addEventListener('click', function(e) {
    const search_input = document.getElementById("sIn")
    //console.log(search_input)
    if (search_input.style.display == "inline") {
	search_input.style.display = "none"
	listTabs();
	search_input.children[0].value = ""
    }
    else
	search_input.style.display = "inline"
});



// SORT

document.getElementById("sort-tog").addEventListener('click', function(e) {
    
    const slc = document.getElementById("sort-lst")
    if (slc.style.display == "block")
	slc.style.display = "none"
    else
	slc.style.display = "block"
});

document.getElementById("sort-lst").addEventListener('click', function(e) {
    
    const parent = e.target.parentElement
    
    if (e.target.localName == "a") {
	parent.style.display = "none"
    }


    if (e.target.id == "sort-default") {
	sort_fn = null
	removeSort(sort_setting)
	sort_setting = "sort-default"
	setSortDefault(sort_setting)
	if (rev_default == true) {
	    document.querySelector('#listorder').checked = true;
	    Reverse = true;
	}
    }
    else {
	Reverse = false
	document.querySelector('#listorder').checked = false
	if (e.target.id == "sort-title") {
	    sort_fn = sortTitle
	    removeSort(sort_setting)
	    sort_setting = "sort-title"
	    setSortDefault(sort_setting)
	}
	else if (e.target.id == "sort-url") {
	    sort_fn = sortURL
	    removeSort(sort_setting)
	    sort_setting = "sort-url"
	    setSortDefault(sort_setting)
	}
	else if (e.target.id == "sort-accessed") {
	    sort_fn = sortLastAccessed
	    removeSort(sort_setting)
	    sort_setting = "sort-accessed"
	    setSortDefault(sort_setting)
	}
	else if (e.target.id == "sort-audio") {
	    sort_fn = sortAudio
	    removeSort(sort_setting)
	    sort_setting = "sort-audio"
	    setSortDefault(sort_setting)
	}
    }
    listTabs();
});


function setSortDefault(sort_id) {
    const el = document.getElementById(sort_id)
    el.classList.add("sort-default")
    
}

function removeSort(sort_id) {
    const el = document.getElementById(sort_id)
    el.classList.remove("sort-default")
}

/*
window.onclick = function(event) {
    const sort_menu = document.getElementById("sort-lst")
    console.log("Click!")
    if (sort_menu.style.display == "block" && event.target != sort_menu) {
	sort_menu.style.display = "none";
    }
}
*/

function sortLastAccessed(a, b) {return b.lastAccessed > a.lastAccessed}
function sortTitle(a, b) {return b.title < a.title}
function sortURL(a, b) {return b.url < a.url}
function sortAudio(a, b) {return b.audible}


// Expand & Unfold tabs url

document.getElementById("show-url").addEventListener('click', function(e) {
    //console.log(e.target);
    if (e.target.src.includes("expand")) {
	if (text_color == "black")
	    e.target.src = "/icons/unfold-less-b-48.png";
	else
	    e.target.src = "/icons/unfold-less-48.png";
	e.target.title = "Hide Urls";
	show_url = true;
	listTabs(false)
    }
    else {
	if (text_color == "black")
	    e.target.src = "/icons/expand-all-b-48.png";
	else
	    e.target.src = "/icons/expand-all-48.png";
	e.target.title = "Display Urls";
	show_url = false;
	listTabs(false)
    }
    
});


// Get and List TABS



export async function listTabs(ac = false) {
    //let id_active;
    await getWindowTabs(highlight_any).then(async (tabs) => {
	let winInfo = await browser.windows.getCurrent(); 
	//console.log(winInfo);
	let id_active;
	const List = document.getElementById('tabs-list');
	const currentTabs = document.createDocumentFragment();
	List.textContent = '';
	let index = 0;

	if (sort_fn != null) {
	    tabs.sort(sort_fn)
	}
	if(Reverse)
	    tabs = tabs.reverse();
	let filter = document.getElementById("search").value.toLowerCase()
	
	for (let tab of tabs) {
	    //console.log(tab);

	    if (filter != "" && !tab.title.toLowerCase().includes(filter) &&
		!tab.url.toLowerCase().includes(filter))
		continue;
	    
	    if (highlight_any == true &&  tab.windowId != winInfo.id) continue;
	    const Parent = document.createElement('div');
	    const Icon = document.createElement('img');
	    const Link = document.createElement('a');
	    const Del = document.createElement('img');
	    const Website = document.createElement('div');

	    
	    Parent.className = 'Tab-Item';
	    Parent.id = tab.id;
	    Icon.src = tab.favIconUrl;
	    Icon.classList.add('icon');
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
	    //Website.classList.add('list-tabs');
	    
	    Link.style.color = text_color;

	    Website.appendChild(Link)
	    	    
	    Parent.appendChild(Icon);
	    Parent.appendChild(Website);
	    Parent.appendChild(Del);
	    
	    if (show_url && tab.title != undefined) {
		const Ref = document.createElement('a');
		Ref.textContent = tab.url.replace("https://", "").replace("www.", "")
		Ref.setAttribute('href', tab.url);
		Ref.classList.add('list-url');
		Ref.style.color = text_color;
		Ref.id = tab.id;
		Website.appendChild(Ref);
	    }

	    
	    if (tab.active == true) id_active = tab.id;
	    




	    if (highlight_any == true) {
		for (var i = 0; i < tabs.length; i++) {
		    if (tabs[i].url == tab.url && tabs[i].id != tab.id) {
			//Parent.style.backgroundColor = '#800040';
			//Parent.style.backgroundColor = '#a40655';
			Parent.style.backgroundColor = '#91064c';
		    }
		}
		index++;
	    }

	    if (highlight_double == true && highlight_any != true) {
		for (var i = 0; i < tabs.length; i++) {
		    if (tabs[i].url == tab.url && tabs[i].id != tab.id) {
			Parent.style.backgroundColor = '#ff751aaa';
		    }
		}
		index++;
	    }

	    if (tab.active == true && highlight_active == true) {
		//Parent.style.backgroundColor = '#001ab2aa'
		if (text_color == "white") {
		    Parent.style.boxShadow = "inset 0 0 0 10em rgba(255, 255, 255, 0.1)";
		} else {
		    Parent.style.boxShadow = "inset 0 0 0 10em rgba(0, 0, 0, 0.1)";
		}
	    }
	    currentTabs.appendChild(Parent);
	}
	List.appendChild(currentTabs);

	if (auto_scroll == true && ac == true) {
	    document.getElementById(id_active).scrollIntoView({behavior: "instant", block: "center", inline: "start"});
	}
    
    });

}



//listTabs();

// Drag n'Drop
function dragStart() {
    
    document.querySelector("#tabs-list").addEventListener('dragstart', function(e) {
	//e.target.style.width = "300px";
	//console.log(e.target)
	
	if (e.target.className == "list-url") {
	    e.dataTransfer.setData('text/uri-list', e.target.previousSibling.href);
	    e.dataTransfer.setData('text/plain', e.target.previousSibling.id);
	} else {
	e.dataTransfer.setData('text/uri-list', e.target.childNodes[1].childNodes[0].href);
	    e.dataTransfer.setData('text/plain', e.target.childNodes[1].childNodes[0].id);
	}
	/*
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.className = 'drag-canvas';
	canvas.height = 24;
	canvas.width = 300;
	canvas.style.position = "absolute";
	canvas.style.top = "-1000px";
	//ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.fillStyle = '#001a55';
	//x.fillRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.roundRect(0, 0, canvas.width, canvas.height, [6]);
	ctx.stroke();
	
	ctx.fill();
	//console.log(e.target.childNodes[0].src);

	const img = new Image();

	img.src = e.target.childNodes[0].src;
	
	ctx.drawImage(img, 4, 3, 18, 18)

	ctx.fillStyle = 'white';
	ctx.fillText(e.target.childNodes[1].innerText.slice(0,50), 28, 15);
	*/
	const Element = document.createElement('div');
	const Icon = document.createElement('img');
	const Link = document.createElement('p');

	Element.className = 'Tab-Item-drag';
	Icon.className = "icon-drag";
	Link.className = "link-drag";
	if (e.target.className == "list-url") {
	    Icon.src = e.target.parentNode.parentNode.childNodes[0].src;
	    Link.innerText = e.target.parentNode.childNodes[0].innerText;
	} else {
	    Icon.src = e.target.childNodes[0].src;
	    Link.innerText = e.target.childNodes[1].innerText;
	}

	Element.appendChild(Icon);
	Element.appendChild(Link);

	Element.style.position = "absolute";
	Element.style.top = "-1000px";
	Element.style.backgroundColor = w_config.background;


	if (text_color == "white") {
	    Element.style.boxShadow = "inset 0 0 0 10em rgba(255, 255, 255, 0.1)";
	} else {
	    Element.style.boxShadow = "inset 0 0 0 10em rgba(0, 0, 0, 0.1)";
	}
	Link.style.color = text_color;
	document.body.appendChild(Element);
	
	e.dataTransfer.setDragImage(Element, -15, -10)
	
    });

    document.querySelector("#tabs-list").addEventListener("dragend", (event, width) => {
	document.querySelector(".Tab-Item-drag").remove();
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
	else if (e.target.classList.contains('list-tabs') || e.target.classList.contains('list-url')) {
	    e.target.parentElement.parentElement.style.borderTop = "solid purple";
	    e.target.parentElement.parentElement.style.borderLeft = "solid purple";
	} else {
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
	} 	else if (e.target.classList.contains('list-tabs') || e.target.classList.contains('list-url')) {
	    e.target.parentElement.parentElement.style.borderTop = "";
	    e.target.parentElement.parentElement.style.borderLeft = "";
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
	//console.log( e.target);
	e.target.style.borderTop = "";
	e.target.style.borderLeft = "";
	let data = e.dataTransfer.getData('text/plain');

	
	if (e.target.classList.contains('list-tabs')) {
	    let tabInfo = await browser.tabs.get(parseInt(e.target.id));
	    browser.tabs.move(parseInt(data), {index: tabInfo.index});
	    listTabs();
	} else if (e.target.classList.contains('list-url')) {
	    let tabInfo = await browser.tabs.get(parseInt(e.target.previousSibling.id));
	    browser.tabs.move(parseInt(data), {index: tabInfo.index});
	    listTabs();
	    
	}
	else if (e.target.classList.contains('Tab-Item')) {
	    let tabInfo = await browser.tabs.get(parseInt(e.target.id));
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
	    e.target.childNodes[1].innerText = ' (' + len  + ' Tabs)';
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
	    //console.log(e.target);
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
	    //console.log(e.target);
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
	console.log(data);
	console.log(u);
	if (e.target.classList.contains('Box-Item')) {
	    e.target.style.border = "";
	    e.target.style.border = "";
	    if (await addSession(u, e.target.dataset.pos, e.target.childNodes[0], parseInt(data)))
	    	   await browser.tabs.remove(parseInt(data));
	    listTabs();	    
	}
	 
	else if (e.target.classList.contains('open')) {
	    //console.log("DROP AT WINDOW <P> WITH ID: ", parseInt(data));
	    //console.log(e.target);
	    e.target.parentElement.style.border = "";
	    e.target.parentElement.style.border = "";
	    if (await addSession(u, e.target.parentElement.dataset.pos, e.target, parseInt(data)))
	    	await browser.tabs.remove(parseInt(data));
	    listTabs();
	}
	
    });

    
    
}

// Utility function
async function addSession(tab_url, pos, node, tab_id) {
    if (tab_url.startsWith("http")) {
	try {
	    const R = await Store.getSessions();
	    const S = R[pos];
	    const len = S.url.length + 1;
	    console.log(tab_id);
	    const tab = await browser.tabs.get(tab_id);
	    console.log("tab");
	    console.log(tab);

	    
	    if (S.headr == undefined) {

		await Store.overwriteSession(new Session(S.title, len, S.date, S.url.concat(tab_url)), pos);
	    } else {

		await Store.overwriteSession(new Session(S.title, len, S.date,
							 S.url.concat(tab_url),
							 S.headr.concat(tab.title),
							 S.favIcons.concat(tab.favIconUrl)
							),
					     pos);
	    }
	    
	    node.innerText = S.title + ' (' + len + ')';
	    Success("Tab added to Session ", 3000);
	    return true;
	}
	catch(err) {
	    console.log(err);
	    Failure(err.message, 3000);
	    return false;
	}
    } else {
	Failure("Tab cannot be saved!", 3000);
	return false;
    }
}


    
// SWITCH & CLOSE TABS Functionality

function linkTabs() {
    document.querySelector("#tabs-list").addEventListener('click', function(e){
	if (e.target.classList.contains('list-tabs') || e.target.classList.contains('list-url')) {
	    e.preventDefault();
	    
	    const ID = parseInt(e.target.id);
	    browser.tabs.update(ID, {active: true});
	    listTabs(false);
	}
    });
}

function closeTab() {
    document.querySelector("#tabs-list").addEventListener('click', async function(e) {
	if (e.target.classList.contains('d-b')) {
	    console.log(e.target)
	    const ID = parseInt(e.target.parentElement.id);
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
	//window.location.reload();
	await upTabNo();
	listTabs();
    }
});











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

// Go to session.html

document.querySelector(".outward").addEventListener('click', () => {
    console.log("click");
    window.location.replace("/sessions.html");

});
