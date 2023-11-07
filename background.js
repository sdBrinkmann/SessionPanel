
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
	browser.browserAction.setPopup({popup: "/main.html"});
	browser.browserAction.openPopup();
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

browser.browserAction.onClicked.addListener(openPanel);


// load Session

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
	const Sessions = await getSessions();
	await browser.windows.create({
	    url: Sessions[pos].url[0],
	}).then( (windowInfo) => {
	    console.log(`Created window: ${windowInfo.id}`);
	    info = [windowInfo.id, Sessions[pos].title];
	    for (var i = 1; i < Sessions[pos].url.length; i++) {
		browser.tabs.create({
		    discarded: true,
		    url: Sessions[pos].url[i],
		    windowId: windowInfo.id
		});
		
	    }
	});
	return info;
    }
}


browser.runtime.onMessage.addListener(openSession);



/*
browser.browserAction.onClicked.addListener(() => {
    browser.browserAction.openPopup();
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
    if (details.reason == "install") {
	browser.runtime.openOptionsPage();
    }
}

browser.runtime.onInstalled.addListener(handleInstalled);
