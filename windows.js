// windows.js

import {Store} from "./storage.js";

/*
let Current_Win = browser.windows.getCurrent().then( x => {
    console.log(x);
    document.querySelector("#name").innerText = x.id;

})
*/
//console.log("Hello World!")

/*
let m = new Map([
    [1, "Example"]
]);
*/


function setName(w_id, m) {
    const n = document.querySelector('#name')
    const I = document.createElement("Input");
    I.setAttribute("type", "text");
    I.className = "wName-input";
    //console.log("HERE");
    if (m.has(w_id))
	I.setAttribute("value", m.get(w_id));
    else
	I.setAttribute("placeholder", "<Click to (Re)name Window>");
    n.appendChild(I);
}
//setName();

function getName(w_id, m) {
    const input = document.querySelector('.wName-input');
    
    input.addEventListener("blur", (event) => {
	m.set(w_id, input.value)
	Store.addNames(m);
    });

    input.addEventListener("keydown", async event => {
	if (event.key === "Enter") {
	    m.set(w_id, input.value)
	    Store.addNames(m);
	    console.log(await Store.getNames());
	}
    });
    
}

//getName();

browser.windows.getAll(
    {
	populate: true, // get tabs of each window
    }

).then(async Win => {
    let m = await Store.getNames();
    if (Win.length > 1) {
	const Container = document.querySelector('.windows');
	const h_windows = document.createElement('h3');

	if (Win.length == 2) 
	    h_windows.innerText = (Win.length - 1) + " other window";
	else
	    h_windows.innerText = (Win.length - 1) + " other windows";

	Container.appendChild(h_windows);
    }
    
    for (const w of Win) {
	if (w.focused == true) {
	    setName(w.id, m);
	    getName(w.id, m);
	    continue;
	}
	const Cont = document.querySelector('.Window-Box');
	const box = document.createElement('div');
	const Title = document.createElement('p');


	Title.className = "w-text";


	box.className = 'Window-Item';
	box.appendChild(Title);

	console.log(w);
	if (m.has(w.id)) {
	    Title.innerText += m.get(w.id);
	} else {
	    Title.innerText += "<Id: " + w.id + ">";
	}
	Title.innerText += " (" + w.tabs.length + " Tabs)";
	//const Name = document.createElement('p');
	//Name.innerText = m.get(w.id);
	
	//box.append(Name);
	Cont.appendChild(box);

    }
});
