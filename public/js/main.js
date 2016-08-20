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