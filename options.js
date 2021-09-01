// scripts for options page

document.addEventListener("DOMContentLoaded", () => {
    let popup = browser.storage.local.get( items => {
	//console.log(items);
	if (items.popup == undefined || items.popup == true) {
	    document.querySelector('#popup').checked = true;
	}
	else if (items.popup == false)
	    document.querySelector('#popup').checked = false;

	if (items.rightmost == true)
	    document.querySelector('#order').checked = true;
	else if (items.rightmost == undefined || items.rightmost == false)
	    document.querySelector('#order').checked = false;
    });
});

document.querySelector('#popup').addEventListener('change', (e) => {
    if (e.target.checked) {
	browser.storage.local.set({
	    'popup': true
	});
    }
    else {
	browser.storage.local.set({
	    'popup': false
	});
	browser.browserAction.setPopup({popup: ""});
    }
});

document.querySelector('#order').addEventListener('change', (e) => {
    if (e.target.checked) {
	browser.storage.local.set({
	    'rightmost': true
	});
    }
    else {
	browser.storage.local.set({
	    'rightmost': false
	});
	browser.browserAction.setPopup({popup: ""});
    }
});


