$("body").on("input",".safeword-input",function(e){
	e.preventDefault();
	let sword = $(this).val();
	$(".safeword-bnr").text(sword);

	chrome.runtime.sendMessage({type:"safeword", safeWord: sword},
		function (response) {
			console.log("sent")
		});
})

function randomWordGen(){
	let dictionary =["tickle","squeeze","drum","wave","lame","hang","sheep","shock","imported","acoustics","pull","fancy","heartbreaking","strap","wild","scattered","damaging","ambiguous","warm","phone","health","swift","kick","blush","kaput","shelter","tin","clumsy","annoying","steel","unable","green","complete","intend","marble","order","ghost","uninterested","boot","adhesive","untidy","ring","curl","drab","lopsided","mountainous","burn","argue","homeless","itch","border","pastoral","resolute","mature","dog","drunk","truck","needle","lace","breezy","supreme","cross","vacation","bow","disillusioned","dysfunctional","knot","soak","degree","top","work","weigh","absorbing","poison","fork","cluttered","racial","arrest","shaggy","servant","fresh","dazzling","trains","imaginary","obese","alleged","crowded","bead","daffy","curly","misty","tap","uncle","snotty","star","dangerous","trip","stranger","brave","amazing","hall","history","tenuous","left","magic","fold","zipper","nippy","friendly","jam","spicy","money","crate","clam","icicle","waggish","bright","hate","disagree","society"];
	return dictionary[Math.floor(Math.random()*dictionary.length)] + " " + dictionary[Math.floor(Math.random()*dictionary.length)];
	;
}
