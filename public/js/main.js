submitFormWithAction = function(form, action, value){
	form.append('<input type="hidden" name="'+action+'" value="'+value+'">');
	form.submit();
	return false;
};

getLocationSansQuery = function(){
	var url = window.location.href; 
	if (url.indexOf("?") != -1){
		return url.split("?")[0];
	}
	return url;
};

/* Ads */
function adBlockDetected() {
	$('#adBlockPlea').removeClass('hidden');
}

if (typeof blockAdBlock === 'undefined') {
	adBlockDetected();
} else {
	blockAdBlock.onDetected(adBlockDetected);
}
