/* Hash the password field and send form */
function formhash(form, password) {
	var p = document.createElement("input");
	
	form.appendChild(p);
	p.name = "p";
	p.type = "hidden";
	p.value = hex_sha512(password.value);
	
	// Clear password so plain text is not sent.
	password.value = "";
	
	form.submit();
}

/* Validate form for registration, hash password field and send form */
function regformhash(form, username, email, password, conf) {
	if (username.value == '' || email.value == '' || password.value == '' || conf.value == '') {	
		//TODO remove alerts, add error message
		alert('You must provide all the requested details. Please try again.');
		return false;
	}
	
	var re = /^\w+$/;
	if (!re.test(username.value)) {
		//TODO remove alerts
		alert('Username must contain only letter, numbers and underscores. Please try again.');
		return false;
	}
	if (password.value.length < 6) {
		//TODO remove alerts, add error message
		alert('Passwords must be at least 6 characters. Please try again.');
		return false;
	}
	if (password.value != conf.value) {
		//TODO remove alerts, add error message
		alert('Your password and confirmation do not match. Please try again.');
		return false;
	}
	
	var p = document.createElement("input");
	
	form.appendChild(p);
	p.name = "p";
	p.type = "hidden";
	p.value = hex_sha512(password.value);
	
	// Clear password so plain text is not sent.
	password.value = "";
	conf.value = "";
	
	form.submit();
	return true;
}