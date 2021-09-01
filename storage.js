// storage.js

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
	Delete.innerHTML += '&times;';
	Delete.id = "delete";
	Delete.setAttribute('title', 'Delete');
	Info.innerText = Session.date.toLocaleString();
	Info.className = 'time-stamp';
	Save.setAttribute('src', 'icons/save-24.png');
	Save.className = 'save-button';
	Save.id = "overwrite";
	Save.setAttribute('title', 'Overwrite');
	box.className = 'Box-Item';
	box.setAttribute('data-pos', pos);
	box.setAttribute('title', Session.date.toLocaleString());
	box.appendChild(Title);
	box.appendChild(Save);
	box.appendChild(Delete);
	//box.appendChild(Info);
	Container.appendChild(box);
    }
    /*
      addBox(Session, pos){
	const Container = document.querySelector('.Session-Box');
	const box = document.createElement('div');
	const Title = document.createElement('p');
	const Delete = document.createElement('p');
	const Info = document.createElement('p');
	const Save = document.createElement('img');
	Title.innerText += Session.title + " (" + Session.tabs + ")";
	Title.className = 'open';
	Title.setAttribute('title', 'Open in New Window');
	Delete.innerHTML += '&times;';
	Delete.id = "delete";
	Delete.setAttribute('title', 'Delete');
	Info.innerText = Session.date.toLocaleString();
	Info.className = 'time-stamp';
	Save.setAttribute('src', 'icons/save-24.png');
	Save.className = 'save-button';
	Save.id = "overwrite";
	Save.setAttribute('title', 'Overwrite');
	
	box.className = 'Box-Item';
	box.setAttribute('data-pos', pos);
	box.appendChild(Title);
	box.appendChild(Delete);
	box.appendChild(Info);
	box.appendChild(Save);
	Container.appendChild(box);
    }
    */
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
}
