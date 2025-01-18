// windows.js

import {Store} from "./storage.js";






function setName(w_id, m, config) {
    const n = document.querySelector('#name')
    const I = document.createElement("Input");
    I.setAttribute("type", "text");
    I.className = "wName-input";

    I.style.backgroundColor = config.background;
    I.style.color = config.t_color;

    if (m.has(w_id) && m.get(w_id).length > 0) {
	I.setAttribute("value", m.get(w_id));
    }
    else
	I.setAttribute("placeholder", "<Click to (Re)name Window>");
    n.appendChild(I);
}

//setName();

function getName(w_id, m) {
    const input = document.querySelector('.wName-input');
    
    input.addEventListener("blur", (event) => {
	m.set(w_id, input.value)
	Store.saveName(w_id, input.value);
	if (input.value.length == 0)
	    input.placeholder = "<Click to (Re)name Window>";

    });

    input.addEventListener("keydown", async event => {
	if (event.key === "Enter") {
	    m.set(w_id, input.value)
	    Store.saveName(w_id, input.value);
	    if (input.value.length == 0)
		input.placeholder = "<Click to (Re)name Window>";
	    input.blur();
	}
    });
}

//getName();

export class Windows {

    static display(config) {
	browser.windows.getAll(
	    {
		populate: true, // get tabs of each window
	    }

	).then(async Win => {
	    let id = Win.map(w => w.id);
	    let m = await Store.getNames(id);
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
		    setName(w.id, m, config);
		    getName(w.id, m);
		    continue;
		}
		const Cont = document.querySelector('.Window-Box');
		const box = document.createElement('div');
		const Title = document.createElement('p');
		const Tabs = document.createElement('p');
		Title.className = "w-text";
		Tabs.className = "w-text";
		Tabs.className = "w-text-tabs";
		box.className = 'Window-Item';
		box.setAttribute("data-wId", w.id);
		box.appendChild(Title);
		box.appendChild(Tabs);

		box.style.backgroundColor = config.w_color;
		box.style.color = config.w_font_color;
		if (m.has(w.id)) {
		    Title.innerText += m.get(w.id);
		} else {
		    Title.innerText += "<Id: " + w.id + ">";
		}
		if (w.tabs.length > 1)
		    Tabs.innerText += "(" + w.tabs.length + " Tabs)";
		else
		    Tabs.innerText += "(" + w.tabs.length + " Tab)";
		Tabs.setAttribute("data-tabs", w.tabs.length);
		//const Name = document.createElement('p');
		//Name.innerText = m.get(w.id);
		
		//box.append(Name);
		Cont.appendChild(box);

	    }
	});
    }
}

