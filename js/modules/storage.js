// storage.js

import {text_color, rc_color, rc_font_color} from "../add.js";
import {Success, Failure} from "./util.js";

export class Session {
    constructor(title, tabs, date, url) {
	this.title = title;
	this.tabs = tabs;
	this.date = date;
	this.url = url;
    }
}

export class Box {
    addBox(Session, pos){
	const Container = document.querySelector('.Session-Box');
	const box = document.createElement('div');
	const Title = document.createElement('p');
	const Delete = document.createElement('p');
	const Info = document.createElement('p');
	const Save = document.createElement('img');
	Title.innerText +=  Session.title  + " (" + Session.tabs + ")";
	Title.className = 'open';
	Title.setAttribute('title', 'Open in New Window');

	//Title.style.color = "white";
	
	Delete.innerHTML += '&times;';
	Delete.id = "delete";
	Delete.setAttribute('title', 'Delete');
	Info.innerText = Session.date.toLocaleString();
	Info.className = 'time-stamp';
	if (rc_font_color == 'black' ||
	    (text_color == 'black' && rc_font_color != 'white')) {
	    Save.setAttribute('src', 'icons/save-b-24.png');
	}
	else {
	    Save.setAttribute('src', 'icons/save-24.png');
	}
	Save.className = 'save-button';
	Save.id = "overwrite";
	Save.setAttribute('title', 'Overwrite');
	box.className = 'Box-Item';
	box.setAttribute('data-pos', pos);
	box.setAttribute('title', Session.date.toLocaleString());
	box.appendChild(Title);
	box.appendChild(Save);
	box.appendChild(Delete);

	box.style.backgroundColor = rc_color;

	if (rc_font_color == 'black')
	    box.style.color = 'black';
	else if (rc_font_color == 'white')
	    box.style.color = 'white';
	
	//box.appendChild(Info);
	Container.appendChild(box);
    }

}

// Local Storage Class

export class Store {
    static async  getSessions() {
	let sessions;
	await browser.storage.local.get('sessions').then( (items) => {
	    //console.log(items);
	    //console.log(Object.keys(items));
	    if(Object.keys(items).length == 0) {
		sessions = [];
	    }
	    
	    else {
		sessions = JSON.parse(items.sessions);
	    }
	});
	return sessions;
    }

    static displaySessions() {
	Store.getSessions().then((sessions) => {
	    sessions.forEach((session, index) => {
		const corect = new Session(session.title, session.tabs, new Date(session.date));
		const box = new Box();
		box.addBox(corect, index);
	    });
	});

    }

    static async addSession(Session) {
	let pos;
	await Store.getSessions().then((sessions) => {

	    sessions.push(Session);
	    browser.storage.local.set({
		'sessions': JSON.stringify(sessions)
	    });
	    pos = sessions.length - 1
	});
	return pos;
    }

    static async overwriteSession(Session, pos) {
	await Store.getSessions().then((sessions) => {
	    //console.log(pos);
	    sessions[pos] = Session;
	    browser.storage.local.set({
		'sessions': JSON.stringify(sessions)
	    });
	});
    }
    static removeSession() {
    }
/*
    static async getNames() {
	let names;
	await browser.storage.local.get('names').then(items => {
	    if(Object.keys(items).length == 0 || items.names.length <= 2) {
		names = new Map();
	    }
	    
	    else {
		console.log(items.names);
		names = new Map(JSON.parse(items.names));
	    }
	    
	});
	return names;
    }
*/

    static async getNames(id) {
	let names = new Map();

	for (const i in id) {
	    let value = await browser.sessions.getWindowValue(id[i], 'name');
	    if (value)
		names.set(id[i], value)
	}
	
	return names;
    }

    static async saveName(w_id, value) {
	browser.sessions.setWindowValue(w_id, 'name', value)
	    .then(Success("Window name changed", 3000))
	    .catch((err) => Failure(err.message, 3000))
    }
    
   /* 
      static async saveNames(N) {
      if(N.size > 0) {
      await browser.storage.local.set({
      'names': JSON.stringify([...N])
      });
      }
      }	
*/
    static async addNames(key, value) {
	let m = await Store.getNames();
	m.set(key, value);
	Store.saveNames(m);
    }
}
