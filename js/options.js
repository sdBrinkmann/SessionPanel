// scripts for options page

document.addEventListener("DOMContentLoaded", () => {
    let popup = browser.storage.local.get( items => {
	//console.log(items);
	if (items.background_color != undefined) 
	    document.getElementById("background-color").value = items.background_color
	else 
	    document.getElementById("background-color").value = '#00001a'

	if (items.search_box_color != undefined) 
	    document.getElementById("search-box-color").value = items.search_box_color
	else 
	    document.getElementById("search-box-color").value = '#00004a'

	if (items.rectangle_color != undefined) 
	    document.getElementById("rect-color").value = items.rectangle_color
	else 
	    document.getElementById("rect-color").value = '#8B0000'

	if (items.win_color != undefined) 
	    document.getElementById("win-color").value = items.win_color
	else 
	    document.getElementById("win-color").value = '#483d8b'


	
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
	    /*
	    document.body.style.color = 'black';
	    document.getElementById("addon-page").style.color = "black";
	    document.getElementById("git-page").style.color = "black";
	    document.getElementById("mail-link").style.color = "black";
	    */
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
	if (items.session_last_first == true) {
	    document.getElementById('session-last-first').checked = true;
	}
	if (items.overwrite_order == true) {
	    document.getElementById('overwrite-order').checked = true;
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
	    'highlight_double': true,
	    'highlight_any': false
	});
	document.querySelector('#highlight-any').checked = false;
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
	    'highlight_any': true,
	    'highlight_double': false
	});
	document.querySelector('#highlight-double').checked = false;
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

document.querySelector('#session-last-first').addEventListener('change', (e) => {
    console.log(e.target.value)
    if (e.target.checked) {
	browser.storage.local.set({
	    'session_last_first': true
	});
    }
    else {
	browser.storage.local.set({
	    'session_last_first': false
	});
    }   
});

document.querySelector('#overwrite-order').addEventListener('change', (e) => {
    console.log(e.target.value)
    if (e.target.checked) {
	browser.storage.local.set({
	    'overwrite_order': true
	});
    }
    else {
	browser.storage.local.set({
	    'overwrite_order': false
	});
    }   
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



document.querySelector('#background-color').addEventListener('change', (e) => {
    e.preventDefault();
    console.log(e.target.value)
    
    browser.storage.local.set({
	'background_color': e.target.value
    });


});


document.querySelector('#rect-color').addEventListener('change', (e) => {
    e.preventDefault();
    
    browser.storage.local.set({
	'rectangle_color': e.target.value
    });
    
});


document.querySelector('#win-color').addEventListener('change', (e) => {
    e.preventDefault();


    browser.storage.local.set({
	'win_color': e.target.value
    });
    
});

document.querySelector('#search-box-color').addEventListener('change', (e) => {
    e.preventDefault();
    
    browser.storage.local.set({
	'search_box_color': e.target.value
    });
    
});

// GLOBAL FONT

document.querySelector('#white').addEventListener('change', (e) => {
    if (e.target.checked && e.target.value == "white") {
	browser.storage.local.set({'font_color': e.target.value});

	//document.body.style.color = 'white';
    }
});

document.querySelector('#black').addEventListener('change', (e) => {
    if (e.target.checked && e.target.value == "black") {
	browser.storage.local.set({'font_color': e.target.value});
	//document.body.style.color = 'black';
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


// Highlight current section

const ref = document.querySelectorAll('.ref');
const sections = document.querySelectorAll('.section');

let currentSection = 'general';
let ticker = false;


window.addEventListener('scroll', () => {
    /*
    if (!ticker) {
	requestAnimationFrame(() => updateHeader());
	ticker = true;
	}
    */
    updateHeader();
});


function updateHeader() {
    console.log("triggered")
    sections.forEach( s => {
	if (window.scrollY >= s.offsetTop - 100) {
	    currentSection = s.id
	}
    });

    ref.forEach(r => {
	if (r.href.includes(currentSection)) {
	    document.querySelector('.active').classList.remove('active');
	    r.parentElement.classList.add('active');
	}
    });
    ticker = false;
}
