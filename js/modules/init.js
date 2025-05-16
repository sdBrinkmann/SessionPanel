// init.js


//text_color, rc_color, rc_font_color

export const obj = {rc_color: 'darkred', rc_font_color: 'white', text_color: 'white'}

export let rc_color = 'darkred';
export let rc_font_color;
export let text_color = 'white';


/*
document.addEventListener('DOMContentLoaded', async () => {
	let order = await browser.storage.local.get(items => {

	    if (items.background_color != undefined) {
		document.body.style.backgroundColor = items.background_color;
		//w_config.background = items.background_color;
	    }
	    
	    if (items.font_color == "black") {
		text_color = 'black';
		obj.text_color = 'black';
		document.body.style.color = 'black';

		document.getElementById("search-tog").src = "icons/search_48_b.png"
		document.getElementById("sort-tog").src = "icons/sort_48_b.png"
	    }

	    if (items.font_rc_color == 'black') {
		rc_font_color = 'black';
		obj.rc_font_color = 'black';
	    }
	    else if (items.font_rc_color == 'white') {
		rc_font_color = 'white';
		obj.rc_font_color = 'white';
	    }

	    console.log(items.rectangle_color);
	    if (items.rectangle_color != undefined) {
		rc_color = items.rectangle_color;
		obj.rc_color = items.rectangle_color;
	    }
	    console.log("loaded");
	});
	
    });

*/



export async function init() {
    let items = await browser.storage.local.get()

 

    if (items.background_color != undefined) {
	document.body.style.backgroundColor = items.background_color;
	//w_config.background = items.background_color;
    }
    
    if (items.font_color == "black") {
	text_color = 'black';
	obj.text_color = 'black';
	document.body.style.color = 'black';

	document.getElementById("search-tog").src = "icons/search_48_b.png"
	document.getElementById("sort-tog").src = "icons/sort_48_b.png"
    }

    if (items.font_rc_color == 'black') {
	rc_font_color = 'black';
	obj.rc_font_color = 'black';
    }
    else if (items.font_rc_color == 'white') {
	rc_font_color = 'white';
	obj.rc_font_color = 'white';
    }

    if (items.rectangle_color != undefined) {
	rc_color = items.rectangle_color;
	obj.rc_color = items.rectangle_color;
    }
    //console.log("loaded");

    return {rc_color: rc_color, rc_font_color: rc_font_color, text_color: text_color}
 
}




