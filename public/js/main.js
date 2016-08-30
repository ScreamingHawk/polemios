submitFormWithAction = function(form, action, value){
	form.append('<input type="hidden" name="'+action+'" value="'+value+'">');
	form.submit();
	return false;
};
