function sendIconChange(icon){
	chrome.runtime.sendMessage({
		action: 'updateIcon',
		value: icon
	});
}




function displayTrustRibbon(safeWord){
	console.log("Match");
	$("body").addClass("sc");
	$("body").prepend('<div id="safecoin"><div class="sc-text"><span>This domain is trusted by the community. SafeWord: '+safeWord+'</span><div class="donate"><a href="https://monxas.com/safecoin/donate.php">Donate</a></div></div></div>');
}

function displayAlert(){
	console.log("Match");
	$("body").on("click",".sc-close",closeAlert);
	let url = chrome.extension.getURL('icons/stop.png');
	$("body").prepend('<div id="safecoin-popup"><div class="sc-popup-box"><div class="sc-popup-content clearfix"><div class="sc-close"><a href="#">x</a></div><div class="icon"><img src="'+url+'" alt=""></div><div class="text"><h1>This webpage has been flagged as dangerous by the community.</h1><p>If you decide to go ahead and use it, you may end up losing your coins.</p></div><div class="sc-donate"><a href="https://monxas.com/safecoin/donate.php">Donate</a></div></div></div></div>');
}

function closeAlert(e){
	e.preventDefault();
	$("#safecoin-popup").remove();
}




function showResult(result,safeWord){
	if(result == "g"){
		displayTrustRibbon(safeWord);
		//displayAlert();
	}else if(result == "r"){
		displayAlert();
	}
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.action == 'newPage') {
		showResult(msg.value,msg.safeWord);
	}
	//sendResponse({farewell: "goodbye"});
});