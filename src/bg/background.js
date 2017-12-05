function install_notice() {
	if (localStorage.getItem('install_time'))
		return;

	var now = new Date().getTime();
	localStorage.setItem('install_time', now);
	chrome.tabs.create({url: "/src/page_action/page_action.html"});
}
install_notice();


pubsub.subscribe( 'gotSafeWord', sendSafeWord);

chrome.storage.sync.get(["safeWord"], function(items){
	if($.isEmptyObject(items)){
		chrome.runtime.sendMessage({type:"safeWord",safeWord: randomWordGen()});
	}else{
		safeWord = items.safeWord;
		chrome.runtime.sendMessage({type:"safeWord",safeWord: safeWord});
	}	
});

function randomWordGen(){
	let dictionary =["tickle","squeeze","drum","wave","lame","hang","sheep","shock","imported","acoustics","pull","fancy","heartbreaking","strap","wild","scattered","damaging","ambiguous","warm","phone","health","swift","kick","blush","kaput","shelter","tin","clumsy","annoying","steel","unable","green","complete","intend","marble","order","ghost","uninterested","boot","adhesive","untidy","ring","curl","drab","lopsided","mountainous","burn","argue","homeless","itch","border","pastoral","resolute","mature","dog","drunk","truck","needle","lace","breezy","supreme","cross","vacation","bow","disillusioned","dysfunctional","knot","soak","degree","top","work","weigh","absorbing","poison","fork","cluttered","racial","arrest","shaggy","servant","fresh","dazzling","trains","imaginary","obese","alleged","crowded","bead","daffy","curly","misty","tap","uncle","snotty","star","dangerous","trip","stranger","brave","amazing","hall","history","tenuous","left","magic","fold","zipper","nippy","friendly","jam","spicy","money","crate","clam","icicle","waggish","bright","hate","disagree","society"];
	return dictionary[Math.floor(Math.random()*dictionary.length)] + " " + dictionary[Math.floor(Math.random()*dictionary.length)];
	;
}

function getDomain(tabId){
	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		let taburl =  new URL(tabs[0].url);
		if(! taburl.href.startsWith("chrome")){
			let tabfulldom =  taburl.hostname;
			let tabdom =  tabfulldom.match(/[^\.]*\.[^.]*$/)[0];		
			checkDomain(tabdom,tabId);
		}
	});

}

function checkDomain(currentDomain,tabId){
	let status = "d";
	if(dictionary.whiteList.indexOf(currentDomain) >= 0){
		status = "g";		
	}else if(dictionary.blackList.indexOf(currentDomain) >= 0){
		status = "r";		
	}

	setIcon(status);
	chrome.storage.sync.get(["safeWord"], function(items){				
		pubsub.publish('gotSafeWord', {"tabId":tabId, "safeWord":items.safeWord,"status":status});
	});


}

function sendSafeWord(items){	
	chrome.tabs.sendMessage(items.tabId, {action: "newPage",value:items.status,safeWord:items.safeWord}, function(response) {});  
}


function setIcon(type){	
	if(type == "d"){
		chrome.browserAction.setIcon({
			path : {
				"16": "/icons/icon16.png",
				"19": "/icons/icon19.png",
				"48": "/icons/icon48.png"
			}
		});
		chrome.browserAction.setBadgeText({text:""});
	}
	if(type == "g"){
		chrome.browserAction.setIcon({
			path : {
				"16": "/icons/icon16-g.png",
				"19": "/icons/icon19-g.png",
				"48": "/icons/icon48-g.png"
			}
		});
		chrome.browserAction.setBadgeText({text:"SAFE"});
		chrome.browserAction.setBadgeBackgroundColor({color:"#33CC33"});
	}
	if(type == "r"){
		chrome.browserAction.setIcon({
			path : {
				"16": "/icons/icon16-r.png",
				"19": "/icons/icon19-r.png",
				"48": "/icons/icon48-r.png"
			}
		});
		chrome.browserAction.setBadgeText({text:"DANGER"});
		chrome.browserAction.setBadgeBackgroundColor({color:"#CC3333"});
	}




}


chrome.tabs.onUpdated.addListener(function(tabId){
	getDomain(tabId);
});

chrome.tabs.onActivated.addListener(function(info){
	getDomain(info.tabId);
});


chrome.runtime.onMessage.addListener( function(request,sender,sendResponse){	

	console.log(request);
	if(request.type == "safeword"){
		chrome.storage.sync.set({ "safeWord": request.safeWord}, function(){			
			chrome.runtime.sendMessage({type:"safeWord",safeWord: request.safeWord});
		});
	}
});
