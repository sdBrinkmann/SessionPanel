
// Open Panel in New TAB

async function  getWindowTabs() {
    return await browser.tabs.query({currentWindow: true});
}

let pop = undefined;

function setStatus() {
    let popup = browser.storage.local.get('popup', items => {
	if (items.popup == undefined || items.popup == true) {
	    pop = true;
	}
	else {
	    pop = false;
	}
    });
}

setStatus(); // execute

browser.storage.onChanged.addListener((changes, area) => {
    //console.log(changes);
    if (changes['popup'] != undefined) {
	if (changes['popup'].newValue == true) pop = true;
	else if (changes['popup'].newValue == false) pop = false;
    }
});
    

function openPanel() {
    if (pop == undefined || pop == true) {
	browser.action.setPopup({popup: "/main.html"});
	browser.action.openPopup();
    }
    else {
	getWindowTabs().then((tabs) => {
	    var SP = tabs.filter( tab =>
		tab.url == browser.runtime.getURL('/main.html'));
	    if (SP.length == 0) {
		browser.tabs.create({ 
		    /*url: "https://developer.mozilla.org" */
		    url: browser.runtime.getURL('/main.html')
		})
	    }
	    else {
		browser.tabs.update(SP[0].id, {active: true});
	    }
	});
    }
}

browser.action.onClicked.addListener(openPanel);


// load Session

async function saveName(w_id, value) {
    browser.sessions.setWindowValue(w_id, 'name', value)
	.then(console.log("Window name changed"))
	.catch((err) => Failure(err.message, 3000))
}


async function getSessions() {
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

async function openSession(message, sender, response) {
    if (message.type == 'loadSession') {
	let info;
	const pos = message.pos;
	console.log("noload: " + message.noload);
	const Sessions = await getSessions();
	
	if (message.switch_t) {
	    const Tabs = await browser.tabs.query({currentWindow: true});
	    //console.log(Tabs)
	    const winId = Tabs[0].windowId
	    //const Sessions = await Store.getSessions();
	    const remove_list =
		  Tabs.filter(t => (!(t.active &&
				      t.url == "moz-extension://48436b49-4063-47d5-9735-4910ef327247/main.html")))
		  .map(t => t.id)
	    //console.log(remove_list)
	    browser.tabs.remove(remove_list.splice(1))
	    for (var i = 0; i < Sessions[pos].url.length; i++) {
		browser.tabs.create({
		    active: false,
		    discarded: message.noload,
		    url: Sessions[pos].url[i],
		})
	    }
	    
	    browser.tabs.remove(remove_list[0])
	    saveName(winId, Sessions[pos].title)
	    //response({res: [winId, Sessions[pos].title]});
	    return [winId, Sessions[pos].title, Tabs.map(t => t.url)]
	} else {
	    if (message.noload) {
		await browser.windows.create({
		    url: Sessions[pos].url[0],
		    focused: false,
		}).then( async (windowInfo) => {
		    console.log(`Created window: ${windowInfo.id}`);
		    info = [windowInfo.id, Sessions[pos].title];
		    saveName(windowInfo.id, Sessions[pos].title)
		    for (var i = 1; i < Sessions[pos].url.length; i++) {
			if (Sessions[pos].headr != undefined) {
			    await browser.tabs.create({
				discarded: true,
				title: Sessions[pos].headr[i],
				url: Sessions[pos].url[i],
				windowId: windowInfo.id,
			    });
			} else {
			    await browser.tabs.create({
				discarded: true,
				url: Sessions[pos].url[i],
				windowId: windowInfo.id,
			    });
			}
		    }
		});
		return info
	    } else {
 		browser.windows.create({
		    url: Sessions[pos].url,
		    focused: false,
		}).then( (windowInfo) => {
		    saveName(windowInfo.id, Sessions[pos].title);
		    info = [windowInfo.id, Sessions[pos].title];
		    //console.log(windowInfo.id, Session[pos].title);
		    //Success("Opening new Window ...", 8000);
		    
		});
		return info
	    }
	}


    }
}



browser.runtime.onMessage.addListener(openSession);



/*
browser.action.onClicked.addListener(() => {
    browser.action.openPopup();
});
*/

// Prevent Panel TAB being stored in History DISABLED
/*
function onVisited(historyItem) {
    if (historyItem.url == browser.runtime.getURL('/main.html')) {
	browser.history.deleteUrl({url: historyItem.url});
    }
}

browser.history.onVisited.addListener(onVisited);
*/

// After Update

function handleInstalled(details) {
    // details.reason == "update"
    if (details.reason == "install") { // || details.reason == "update") {
	browser.runtime.openOptionsPage();
    }
}

browser.runtime.onInstalled.addListener(handleInstalled);
