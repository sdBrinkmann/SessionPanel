// work.js for session.html

import "./modules/init.js"
import {Session, Box, Store} from "./modules/storage.js";
import {Success, Failure, deleteSession} from "./modules/util.js"


document.addEventListener('DOMContentLoaded', async () => {
    listSession();
    Store.displaySessions();
    deleteSession();
    deleteTab();
    
    dragStart();
    dragEnter();
    dragOver();
    dragLeave();
    dragDrop();
});


let rc_color = 'darkred';
let rc_font_color;
let text_color = 'white';






function listSession() {
    document.querySelector(".Session-Box").addEventListener('click',  (e) => {
	if (e.target.classList.contains('open')) {

	    const pos = parseInt(e.target.parentElement.dataset.pos);	   
	    console.log(pos);
	    list(pos);
	}

    });
}


async function list(pos) {
    
    const Sessions = await Store.getSessions();
    console.log(Sessions)
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


	Website.appendChild(Link);

	if (S.headr != undefined) {
	    Ref.textContent = S.url[idx].replace("https://", "").replace("www.", "") // tab.title || tab.id;
	    Ref.setAttribute('href', S.url[idx]);
	    Ref.classList.add('list-tabs');
	    Website.appendChild(Ref)

	}
	
	/*if (dragNdrop == true) {
	  Link.setAttribute('draggable', false);
	  Parent.setAttribute('draggable', true);
	  }
	*/
	//Link.id = tab.id;

	//Link.style.color = text_color;
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
		    Store.displaySessions();
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
		    Store.displaySessions();
		}

	    });
	}
    });
}


function dragStart() {
    
    document.querySelector(".Session-Box").addEventListener('dragstart', function(e) {
	//e.target.style.width = "300px";
	//if (e.target.classList.contains('Box-Item-2')) 
	//    e.preventDefault();
	
	console.log(e.target)
	if (e.target.id == "move-session") {
	    console.log("move")
	    e.dataTransfer.setData('text/plain', e.target.parentElement.parentElement.dataset.pos);

	    const Element = document.createElement('div');
	    const Icon = document.createElement('img');
	    const Title = document.createElement('p');

	    Element.className = 'Tab-Item-drag';
	    Icon.className = "icon-drag";
	    Title.className = "title-drag";

	    Icon.setAttribute('src', 'icons/drag-indicator-w-24.png');
	    
	    /* 
	       if (e.target.className == "list-url") {
	       Icon.src = e.target.parentNode.parentNode.childNodes[0].src;
	       Link.innerText = e.target.parentNode.childNodes[0].innerText;
	       } else {
	       Icon.src = e.target.childNodes[0].src;
	       Link.innerText = e.target.childNodes[1].innerText;
	       }
	    */

	    Title.innerText = e.target.parentElement.parentElement.title;
	    
	    Element.appendChild(Title);
	    Element.appendChild(Icon);


	    Element.style.position = "absolute";
	    Element.style.top = "-1000px";
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
	console.log("I'AM HERE!");
	console.log(e.target);

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
	console.log( e.target);
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
	
	
	let data = parseInt(e.dataTransfer.getData('text/plain'));

	

	    console.log("data: " + data);
	    //console.log(data);

	    console.log("pos: " + pos);
	    
	    if (pos != data) {
		await Store.getSessions().then((sessions) => {
		    browser.storage.local.set({
			'sessions': JSON.stringify(moveElement(sessions, data, pos))
		    });

		});
		window.location.reload()
	    }
	
    });


}

function moveElement(A, prv, nxt) {
    let Arry = new Array();
    
    
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
