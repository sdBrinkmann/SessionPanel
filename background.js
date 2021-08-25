// Open Panel in New TAB

async function  getWindowTabs() {
    return await browser.tabs.query({currentWindow: true});
}

var SP_Id;

function openPanel() {
    getWindowTabs().then((tabs) => {
	var SP = tabs.filter( tab =>
	    tab.url == browser.runtime.getURL('/main.html'));
	if (SP.length == 0) {
	    browser.tabs.create({
		/*url: "https://developer.mozilla.org" */
		url: browser.runtime.getURL('/main.html')
	    }).then( (tab) => {
		SP_Id = tab.id;
	    });
	}
	else {
	    browser.tabs.update(SP_Id, {active: true});
	}
    }); 
}

browser.browserAction.onClicked.addListener(openPanel);

// Prevent Panel TAB being stored in History

function onVisited(historyItem) {
    if (historyItem.url == browser.runtime.getURL('/main.html')) {
	browser.history.deleteUrl({url: historyItem.url});
    }
}

browser.history.onVisited.addListener(onVisited);

