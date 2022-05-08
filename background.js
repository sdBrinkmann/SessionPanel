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
    if (details.reason == "update" || details.reason == "install") {
	browser.runtime.openOptionsPage();
    }
}

browser.runtime.onInstalled.addListener(handleInstalled);
