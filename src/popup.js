$("body").on("click",".save-safeword", saveSWord)
$("body").on("click",".send-domain", grabDomain)

function saveSWord(e) {
	e.preventDefault();

	let sword = $("#safeword").val();
	chrome.runtime.sendMessage({type:"safeword", safeWord: sword},
		function (response) {
			//console.log("sent")
		});
}

function grabDomain(e) {
	e.preventDefault();
	action = $(this).data("action");

	chrome.tabs.query({
		active: true,
		currentWindow: true
	}, function(tabs) {
		let taburl =  new URL(tabs[0].url);
		if(! taburl.href.startsWith("chrome")){
			let tabfulldom =  taburl.hostname;
			let tabdom =  tabfulldom.match(/[^\.]*\.[^.]*$/)[0];		
			sendDomain(tabdom,action);
		}
	});
}
function sendDomain(tabdom,action) {
	let arr = { domain: tabdom, action: action };
	console.log(arr);
	$.ajax({
		url: 'https://monxas.com/safecoin',
		type: 'GET',
		data: arr,
		contentType: 'application/json; charset=utf-8',
		dataType: 'json',
		async: false,
		success: function(msg) {
			alert("Thanks for your collaboration!");
		}
	});
}


chrome.storage.sync.get(["safeWord"], function(request){
	$("#safeword").val(request.safeWord);
})


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.type === "safeWord") {
		$("#safeword").val(request.safeWord);
	}
});