// scripts for options page

document.addEventListener("DOMContentLoaded", () => {
    let popup = browser.storage.local.get( items => {
	//console.log(items);
	if (items.background_color != undefined) {
	    document.body.style.backgroundColor = items.background_color;
	}
	if (items.popup == undefined || items.popup == true) {
	    document.querySelector('#popup').checked = true;
	}
	if (items.dragndrop != false) {
	    document.querySelector('#drag-drop').checked = true;
	}
	if (items.no_load == true) {
	    document.querySelector('#no-load').checked = true;
	}
	if (items.search_on == true) {
	    document.querySelector('#search-on').checked = true;
	}
	if (items.switch_tabs == true) {
	    document.querySelector('#switch-tabs').checked = true;
	}
	if (items.rightmost == true)
	    document.querySelector('#order').checked = true;

	if (items.font_color == "black") {
	    document.querySelector('#black').checked = true;
	    document.body.style.color = 'black';
	}
	else
	    document.querySelector('#white').checked = true;

	if (items.font_rc_color == "black") {
	    document.querySelector('#rc-black').checked = true;
	}
	else if (items.font_rc_color == "white") {
	    document.querySelector('#rc-white').checked = true;
	}
	else {
	    document.querySelector('#rc-global').checked = true;
	}

	if (items.font_win_color == "black") {
	    document.querySelector('#wc-black').checked = true;
	}
	else if (items.font_win_color == "white") {
	    document.querySelector('#wc-white').checked = true;
	}
	else {
	    document.querySelector('#wc-global').checked = true;
	}
	    
	if (items.highlight_active == true || items.highlight_active == undefined)
	    document.querySelector('#highlight-active').checked = true;

	if (items.auto_scroll == true)
	    document.querySelector('#auto-scroll').checked = true;

	if (items.highlight_double == true)
	    document.querySelector('#highlight-double').checked = true;

	if (items.highlight_any == true)
	    document.querySelector('#highlight-any').checked = true;

	if (items.default_ordering != undefined) {
	    document.getElementById('sort-ordering').value = items.default_ordering 
	}
	
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
	browser.action.setPopup({popup: ""});
    }
});

document.querySelector('#drag-drop').addEventListener('change', (e) => {
    if (e.target.checked) {
	browser.storage.local.set({
	    'dragndrop': true
	});
    }
    else {
	browser.storage.local.set({
	    'dragndrop': false
	});
    }
});

document.querySelector('#no-load').addEventListener('change', (e) => {
    if (e.target.checked) {
	browser.storage.local.set({
	    'no_load': true
	});
    }
    else {
	browser.storage.local.set({
	    'no_load': false
	});
    }
});

document.querySelector('#search-on').addEventListener('change', (e) => {
    if (e.target.checked) {
	browser.storage.local.set({
	    'search_on': true
	});
    }
    else {
	browser.storage.local.set({
	    'search_on': false
	});
    }
});

document.querySelector('#switch-tabs').addEventListener('change', (e) => {
    if (e.target.checked) {
	browser.storage.local.set({
	    'switch_tabs': true
	});
    }
    else {
	browser.storage.local.set({
	    'switch_tabs': false
	});
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
    }
});

document.querySelector('#auto-scroll').addEventListener('change', (e) => {
    if (e.target.checked) {
	browser.storage.local.set({
	    'auto_scroll': true
	});
    }
    else {
	browser.storage.local.set({
	    'auto_scroll': false
	});
    }
});

document.querySelector('#highlight-active').addEventListener('change', (e) => {
    if (e.target.checked) {
	browser.storage.local.set({
	    'highlight_active': true
	});
	console.log('true');
    }
    else {
	browser.storage.local.set({
	    'highlight_active': false
	});
	console.log('false');
    }
});

document.querySelector('#highlight-double').addEventListener('change', (e) => {
    if (e.target.checked) {
	browser.storage.local.set({
	    'highlight_double': true
	});
    }
    else {
	browser.storage.local.set({
	    'highlight_double': false
	});
	console.log('false');
    }
});

document.querySelector('#highlight-any').addEventListener('change', (e) => {
    if (e.target.checked) {
	browser.storage.local.set({
	    'highlight_any': true
	});
    }
    else {
	browser.storage.local.set({
	    'highlight_any': false
	});
    }
});

document.querySelector('#sort-ordering').addEventListener('change', (e) => {
    console.log(e.target.value)
    browser.storage.local.set({
	'default_ordering': e.target.value
    });

    
});


document.querySelector('#reset').addEventListener('click', (e) => {
    browser.storage.local.remove([
	"background_color",
	"rectangle_color",
	"win_color",
	"search_box_color",
	"font_color",
	"font_rc_color",
    ]);
    location.reload();
});



document.querySelector('#submit-bc').addEventListener('click', (e) => {
    e.preventDefault();
    let bc_field = document.getElementById("background-color");
    //console.log(bc_col_field.validity.patternMismatch);
    bc_field.setCustomValidity("Input did not match valid hex color value e.g. #fff000 or #fff00088");
    if (bc_field.validity.patternMismatch == false && bc_field.value != '') {
	//console.log('Valid input');
	browser.storage.local.set({
	    'background_color': bc_field.value.toLowerCase()
	});
	document.body.style.backgroundColor = bc_field.value.toLowerCase();
    }
    else {
	bc_field.reportValidity();
    }
});


document.querySelector('#submit-rc').addEventListener('click', (e) => {
    e.preventDefault();
    let rc_field = document.getElementById("rect-color");
    rc_field.setCustomValidity("Input did not match valid hex color value e.g. #123abc or #ABC123AA");
    if (rc_field.validity.patternMismatch == false && rc_field.value != '') {
	browser.storage.local.set({
	    'rectangle_color': rc_field.value.toLowerCase()
	});
    }
    else {
	rc_field.reportValidity();
    }
});

document.querySelector('#submit-wc').addEventListener('click', (e) => {
    e.preventDefault();
    let wc_field = document.getElementById("win-color");
    wc_field.setCustomValidity("Input did not match valid hex color value e.g. #123abc or #ABC123AA");
    if (wc_field.validity.patternMismatch == false && wc_field.value != '') {
	browser.storage.local.set({
	    'win_color': wc_field.value.toLowerCase()
	});
    }
    else {
	wc_field.reportValidity();
    }
});

document.querySelector('#submit-sb').addEventListener('click', (e) => {
    e.preventDefault();
    let sb_field = document.getElementById("search-box-color");
    sb_field.setCustomValidity("Input did not match valid hex color value e.g. #123abc or #ABC123AA");
    if (sb_field.validity.patternMismatch == false && sb_field.value != '') {
	browser.storage.local.set({
	    'search_box_color': sb_field.value.toLowerCase()
	});
    }
    else {
	wc_field.reportValidity();
    }
});

// GLOBAL FONT

document.querySelector('#white').addEventListener('change', (e) => {
    if (e.target.checked && e.target.value == "white") {
	browser.storage.local.set({'font_color': e.target.value});

	document.body.style.color = 'white';
    }
});

document.querySelector('#black').addEventListener('change', (e) => {
    if (e.target.checked && e.target.value == "black") {
	browser.storage.local.set({'font_color': e.target.value});
	document.body.style.color = 'black';
    }
});

// RC FONT

document.querySelector('#rc-global').addEventListener('change', (e) => {
    if (e.target.checked && e.target.value == "global") {
	browser.storage.local.remove('font_rc_color');
    }
});


document.querySelector('#rc-white').addEventListener('change', (e) => {
    if (e.target.checked && e.target.value == "white") {
	browser.storage.local.set({'font_rc_color': e.target.value});

    }
});

document.querySelector('#rc-black').addEventListener('change', (e) => {
    if (e.target.checked && e.target.value == "black") {
	browser.storage.local.set({'font_rc_color': e.target.value});
    }
});

// WIN FONT

document.querySelector('#wc-global').addEventListener('change', (e) => {
    if (e.target.checked && e.target.value == "global") {
	browser.storage.local.remove('font_win_color');
    }
});


document.querySelector('#wc-white').addEventListener('change', (e) => {
    if (e.target.checked && e.target.value == "white") {
	browser.storage.local.set({'font_win_color': "white"});

    }
});

document.querySelector('#wc-black').addEventListener('change', (e) => {
    if (e.target.checked && e.target.value == "black") {
	browser.storage.local.set({'font_win_color': "black"});
    }
});
