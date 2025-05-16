// work.js for session.html

import {init} from "./modules/init.js"
import {Session, Box, Store} from "./modules/storage.js";
import {Success, Failure, deleteSession} from "./modules/util.js"

let text_color = 'white';
let rec = []

document.addEventListener('DOMContentLoaded', async () => {
    deleteSession();
    deleteTab();
    
    dragStart();
    dragEnter();
    dragOver();
    dragLeave();
    dragDrop();

    rec = await init()

    if (rec.text_color == "black") {
	text_color = 'black';
	document.querySelector(".arrow-back").src = "icons/arrow-back-48.png"
	document.getElementById("back").style.color = "black";
	document.getElementById("open").src = "icons/arrow-down-b-48.png"
    }
    
    listSession();
    Store.displaySessions(rec);
});



function listSession() {
    document.querySelector(".Session-Box").addEventListener('click',  (e) => {
	if (e.target.classList.contains('open')) {

	    const pos = parseInt(e.target.parentElement.dataset.pos);	   
	    list(pos);
	}

    });
}


async function list(pos) {
    
    const Sessions = await Store.getSessions();
    const S = Sessions[pos]
    const List = document.getElementById('tabs-list');
    
    //console.log(List)
    List.classList.remove("instruct");
    const currentTabs = document.createDocumentFragment();
    List.textContent = '';

    const Head = document.querySelector(".inspect-head");
    Head.textContent = '';
    const Waste = document.createElement('img');
    Waste.title = "Delete Session";
    Waste.id = 'delete-session'
    Waste.className = 'waste-icon';
    if (text_color == "black")
	Waste.setAttribute('src', 'icons/wastbin-b-24.png');
    else
	Waste.setAttribute('src', 'icons/wastbin-w-24.png');
    
    Head.setAttribute('data-pos', pos)
    List.setAttribute('data-pos', pos)

    const Title = document.createElement('p');
    Title.innerText = S.title + " (" + S.tabs  + ")";
    Head.appendChild(Title);
    Head.appendChild(Waste);
    
    for (var idx = 0; idx < S.url.length; idx++)  { // (let tab of S.url) {
	//console.log(tab);
	
	const Parent = document.createElement('div');
	const Icon = document.createElement('img');
	const Link = document.createElement('a');
	const Del = document.createElement('img');
	const Website = document.createElement('div');
	const Ref = document.createElement('a');
	
	Parent.className = 'Tab-Item';
	Parent.setAttribute('data-no', idx);
	if (S.favIcons != undefined)
	    Icon.src = S.favIcons[idx];
	Icon.classList.add('icon');
	Del.src = 'icons/delete-16.png';
	Del.classList.add('d-b');
	//Icon.setAttribute('rel', 'icon');
	//Icon.setAttribute('href', tab.favIconUrl)
	
	Link.textContent = S.headr ? S.headr[idx] : S.url[idx] // tab.title || tab.id;
	Link.setAttribute('href', S.url[idx]);

	Link.classList.add('list-tabs');

	Website.appendChild(Link);

	if (S.headr != undefined) {
	    Ref.textContent = S.url[idx].replace("https://", "").replace("www.", "") // tab.title || tab.id;
	    Ref.setAttribute('href', S.url[idx]);
	    Ref.classList.add('list-url');
	    Ref.style.color = text_color;
	    Website.appendChild(Ref)

	}
	
	/*if (dragNdrop == true) {
	  Link.setAttribute('draggable', false);
	  Parent.setAttribute('draggable', true);
	  }
	*/
	//Link.id = tab.id;

	Link.style.color = text_color;
	Parent.appendChild(Icon);
	Parent.appendChild(Website);
	Parent.appendChild(Del);
	
	
	currentTabs.appendChild(Parent);
    }
    List.appendChild(currentTabs);
}

document.querySelector(".arrow-back").addEventListener('click', () => {
    console.log("click");
    window.location.replace("/main.html");

});


function deleteTab() {
    document.querySelector("#tabs-list").addEventListener('click', async function(e) {
	if (e.target.classList.contains('d-b')) {
	    console.log(e.target)
	    const pos = e.target.parentNode.parentNode.dataset.pos
	    const no = e.target.parentNode.dataset.no
	    //const ID = parseInt(e.target.previousSibling.id);
	    Store.getSessions().then( async (sessions) => {

		const S = sessions[pos]
		if (S.headr == undefined) {
		    S.url.splice(no, 1)
		    
		    await Store.overwriteSession(new Session(S.title, S.tabs-1, S.date, S.url), pos)
		    list(pos);
		    document.querySelector('.Session-Box').textContent = '';
		    Store.displaySessions(rec);
		} else {
		    S.url.splice(no, 1)
		    S.headr.splice(no,1)
		    S.favIcons.splice(no,1)
		    
		    await Store.overwriteSession(new Session(S.title, S.tabs-1, S.date,
						       S.url,
						       S.headr,
						       S.favIcons), pos)
		    list(pos);
		    document.querySelector('.Session-Box').textContent = '';
		    Store.displaySessions(rec);
		}

	    });
	}
    });
}


function dragStart() {
    
    document.querySelector(".Session-Box").addEventListener('dragstart', function(e) {


	if (e.target.id == "move-session") {

	    e.dataTransfer.setData('text/plain', e.target.parentElement.parentElement.dataset.pos);

	    const Element = document.createElement('div');
	    const Icon = document.createElement('img');
	    const Title = document.createElement('p');

	    Element.className = 'Tab-Item-drag';
	    Icon.className = "icon-drag";
	    Title.className = "title-drag";

	    console.log(rec.rc_font_color)
	    if (rec.rc_font_color == "black") {
		Icon.setAttribute('src', 'icons/drag-indicator-24.png');
		Title.style.color = "black"
	    }
	    else
		Icon.setAttribute('src', 'icons/drag-indicator-w-24.png');


	    Title.innerText = e.target.parentElement.parentElement.title;
	    
	    Element.appendChild(Title);
	    Element.appendChild(Icon);
	    

	    Element.style.position = "absolute";
	    Element.style.top = "-1000px";
	    Element.style.backgroundColor = rec.rc_color;
	    document.body.appendChild(Element);

	    e.dataTransfer.effectAllowed = "move";
	    e.dataTransfer.setDragImage(Element, 170, 25)

	    //e.target.style.cursor = "grap";
	} else {
	    e.preventDefault();
	}


	
    });


    
}


function dragEnter() {
    document.querySelector(".Session-Box").addEventListener('dragenter', function(e) {
	e.preventDefault();


	//e.target.style.border = "thin solid red";	    	

	if (e.target.classList.contains('Box-Item-2')) 
	    e.target.style.border = "thin solid red";	    	
	else if (e.target.parentElement.classList.contains('Box-Item-2')) 
	    e.target.parentElement.style.border = "thin solid red";
	else if (e.target.parentElement.parentElement.classList.contains('Box-Item-2')) 
	    e.target.parentElement.parentElement.style.border = "thin solid red";
	
    });

  
}

function dragOver() {
   
    document.querySelector(".Session-Box").addEventListener('dragover', function(e) {
	//console.log(e.target.id);
	e.preventDefault();
	if (e.target.parentElement.parentElement.classList.contains('Box-Item-2')) 
	    e.target.parentElement.parentElement.style.border = "thin solid red";
    });
}

function dragLeave() {
 
    document.querySelector(".Session-Box").addEventListener('dragleave', function(e) {
	e.preventDefault();
	if (e.target.classList.contains('Box-Item-2')) 
	    e.target.style.border = "";
	else
	    e.target.parentElement.style.border = "";
	
    });
}


function dragDrop() {
    document.querySelector(".Session-Box").addEventListener('drop', async function(e) {
	e.preventDefault();

	e.target.style.border = "";
	let pos;

	if (e.target.classList.contains('Box-Item-2')) {
	    e.target.style.border = "";
	    pos = e.target.dataset.pos;
	}
	else if (e.target.parentElement.classList.contains('Box-Item-2')) {
	    e.target.parentElement.style.border = "";
	    pos = e.target.parentElement.dataset.pos;
	}
	else if (e.target.parentElement.parentElement.classList.contains('Box-Item-2')) {
	    e.target.parentElement.parentElement.style.border = "";
	    pos = e.target.parentElement.parentElement.dataset.pos;
	}
	
	if (e.dataTransfer.getData('text/plain') != undefined) {
	    //console.log(e.dataTransfer.getData('text/plain'))
	    let data = parseInt(e.dataTransfer.getData('text/plain'));	
	    
	    if (isNaN(data) || isNaN(pos))
		throw new Error("Element cannot be dropped!");
	    
	    if (pos != data) {
		await Store.getSessions().then((sessions) => {
		    browser.storage.local.set({
			'sessions': JSON.stringify(moveElement(sessions, data, pos))
		    });

		});
		window.location.reload()
	    }
	}
    });


}

function moveElement(A, prv, nxt) {
    let Arry = new Array();

    if (prv < 0 || nxt < 0 || prv >= A.length || nxt > A.length)
	throw new Error("Out of bounds!");
    
    for (let i = 0; i < A.length; i++) {
	if (i == prv) {
	    continue;
	} else if (i == nxt) {
	    if (prv > nxt) {
		Arry.push(A[prv]);
		Arry.push(A[i]);
	    } else {
		Arry.push(A[i]);
		Arry.push(A[prv]);	
	    }
	} else {
	    Arry.push(A[i])
	}
    }
    
    return Arry
}

document.addEventListener('visibilitychange', async function() {
    if(document.visibilityState == "visible") {
	//window.location.reload();
	window.location.reload();
    }
});
