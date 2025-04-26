// work.js for session.html

import {Session, Box, Store} from "./modules/storage.js";

document.addEventListener('DOMContentLoaded', async () => {
    Store.displaySessions();
    listSession();
});



function listSession() {
    document.querySelector(".Session-Box").addEventListener('click', async (e) => {
	if (e.target.classList.contains('open')) {

	    const pos = parseInt(e.target.parentElement.dataset.pos);	   
	    console.log(pos);

	    const Sessions = await Store.getSessions();
	    console.log(Sessions)
	    const S = Sessions[pos]
	    const List = document.getElementById('tabs-list');
	    console.log(List)
	    List.classList.remove("instruct");
	    const currentTabs = document.createDocumentFragment();
	    List.textContent = '';
	    
	    for (var idx = 0; idx < S.url.length; idx++)  { // (let tab of S.url) {
		//console.log(tab);
		
		const Parent = document.createElement('div');
		const Icon = document.createElement('img');
		const Link = document.createElement('a');
		const Del = document.createElement('img');
		const Website = document.createElement('div');
		const Ref = document.createElement('a');
		
		Parent.className = 'Tab-Item';
		if (S.favIcons != undefined)
		    Icon.src = S.favIcons[idx];
		Icon.classList.add('icon');
		Del.src = 'icons/delete-16.png';
		Del.classList.add('d-b');
		//Icon.setAttribute('rel', 'icon');
		//Icon.setAttribute('href', tab.favIconUrl)
		

		
		Link.textContent = S.headr ? S.headr[idx] : S.url[idx] // tab.title || tab.id;
		Link.setAttribute('href', S.url[idx]);


		Website.appendChild(Link);

		if (S.headr != undefined) {
		    Ref.textContent = S.url[idx] // tab.title || tab.id;
		    Ref.setAttribute('href', S.url[idx]);
		    Ref.classList.add('list-tabs');
		    Website.appendChild(Ref)

		}
		
		/*if (dragNdrop == true) {
		    Link.setAttribute('draggable', false);
		    Parent.setAttribute('draggable', true);
		    }
		*/
		//Link.id = tab.id;

		//Link.style.color = text_color;
		Parent.appendChild(Icon);
		Parent.appendChild(Website);
		Parent.appendChild(Del);
		
		
		currentTabs.appendChild(Parent);
	    }
	    List.appendChild(currentTabs);
	}
    });
}
