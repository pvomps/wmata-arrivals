
function showBack()
{
    showBack(null);
}

function showBack(event)
{
	var front = document.getElementById("front");
	var back = document.getElementById("back");

	if (window.widget)
		widget.prepareForTransition("ToBack");

	front.style.display="none";
	back.style.display="block";
	
	if (window.widget)
		setTimeout('widget.performTransition();', 0);
}

function showFront(event)
{
    station_id = saveSelection();
	loadStation(station_id);

	var front = document.getElementById("front");
	var back = document.getElementById("back");

	if (window.widget)
		widget.prepareForTransition("ToFront");

	front.style.display="block";
	back.style.display="none";
	
	if (window.widget)
		setTimeout('widget.performTransition();', 0);
		
}

function CreateGlassButton(buttonID, spec)
{
	var buttonElement = document.getElementById(buttonID);

	if (!buttonElement.loaded) {
		buttonElement.loaded = true;

		var text = spec.text || '';
		if (window.getLocalizedString) text = getLocalizedString(text);

		var onclick = spec.onclick || null;
		try { onclick = eval(onclick); } catch (e) { onclick = null; }

		buttonElement.object = new AppleGlassButton(buttonElement, text, onclick);
		buttonElement.object.setEnabled(!spec.disabled);
	}

	return buttonElement.object;
}

function CreateInfoButton(flipperID, spec)
{
	var flipElement = document.getElementById(flipperID);

	if (!flipElement.loaded) {
		flipElement.loaded = true;

		var onclick = spec.onclick || null;
		try { onclick = eval(onclick); } catch (e) { onclick = null; }

		flipElement.object = new AppleInfoButton(flipElement, document.getElementById(spec.frontID), spec.foregroundStyle, spec.backgroundStyle, onclick);
	}

	return flipElement.object;
}

function getSavedStation()
{
    station_id = widget.preferenceForKey(widget.identifier + "station_id");
    return station_id;
}

// save the currently selected station
// in prefs
function saveSelection()
{
    station_list = document.getElementById('station_list');
	station_id = station_list.options[station_list.selectedIndex].value;

    widget.setPreferenceForKey(station_id, widget.identifier + "station_id");
    return station_id;
}

function doOnRemove()
{
    // remove the station pref
    widget.setPreferenceForKey(null, widget.identifier + "station_id");
}

function doOnHide()
{
    theframe = document.getElementById('theframe');
    //theframe.src = "";
}

//var int_timer = null;
function doOnShow()
{
    loadStationFromList();
}

// loads the iframe with the station id
// that is saved in prefs
function loadStationFromList()
{
	loadStation(getSavedStation());
}

// load the wmata content in the iframe for
// the selected station
function loadStation(station_id)
{
	base_station = "http://www.wmata.com:80/metrorail/Stations/showpid/showpid_refresh.cfm?station=";

	theframe = document.getElementById('theframe');
	theframe.src = "";
	theframe.src = base_station + station_id;
	
	// transfer stations have 4 signs so we use
	// a larger background
	if(isTransferStation(station_id))
    {
	    window.resizeTo(255,460);
	    document.getElementById('front-img').src = "Images/3-bg.png"
	    document.getElementById('back-img').src = "Images/3-bg.png"
	}
	else
	{
	    // some of the titles wrap which pushes the iframe content
	    // down and so we use a slightly taller background
	    if(isWrappedTitle(station_id))
        {
	        window.resizeTo(255,290);
	        document.getElementById('front-img').src = "Images/2-bg.png"
	        document.getElementById('back-img').src = "Images/2-bg.png"
        }
        // default/normal background image
        else
        {
	        window.resizeTo(255,277);
	        document.getElementById('front-img').src = "Images/1-bg.png"
	        document.getElementById('back-img').src = "Images/1-bg.png"
        }
	}
}

function isWrappedTitle(station_id)
{
    retval = false;
    switch(station_id)
    {
        case '93':
        case '81':
        case '70':
        case '73':
        case '108':
            retval = true;
            break;
    }
    
    return retval;
}
// 1-bg.img 255x277
// 2-bg.img 255x288
// 3-bg.img 255x460

// transfer stations have 4 signs
// instead of 2
function isTransferStation(station_id)
{
    retval = false;
    switch(station_id)
    {
        case '1':
        case '21':
        case '28':
        case '82':
            retval = true;
            break;
    }
    
    return retval;
}

// setup
function load()
{
    if(load.called == true) return;

    load.called = true;


    widget.onshow = doOnShow;
    widget.onhide = doOnHide;
    widget.onremove = doOnRemove;
    
    CreateInfoButton('info', { frontID: 'front', foregroundStyle: 'white', backgroundStyle: 'black', onclick: 'showBack' });
    CreateGlassButton('done', { text: 'Done', onclick: 'showFront' });
    
    if(getSavedStation() == null)
     {
         window.resizeTo(255,277);
         document.getElementById('front-img').src = "Images/1-bg.png"
         document.getElementById('back-img').src = "Images/1-bg.png"

         setTimeout('showBack();', 500);
     }
     else
     {
         setTimeout('doOnShow();', 500);
     }
}
window.addEventListener('load', load, false);
