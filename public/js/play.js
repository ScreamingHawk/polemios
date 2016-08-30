var gameForm = null;
var gameContainer = $('#gameContainer');

setUpGameForm = function(){
	gameForm = $('#gameForm');
	// Set up movement buttons
	$('#move-never').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('move', 'north');
	});
	$('#move-eat').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('move', 'east');
	});
	$('#move-soggy').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('move', 'south');
	});
	$('#move-weetbix').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('move', 'west');
	});
};
setUpGameForm();

ajaxGameFormAction = function(action, value){
	//TODO Block inputs
	
	gameForm.append('<input type="hidden" name="'+action+'" value="'+value+'">');
	$.ajax({
		type: 'POST',
		url: getLocationSansQuery(),
		data: gameForm.serialize()
	}).done(function(response){
		gameContainer.empty();
		gameContainer.html(response);
		setUpGameForm();
	}).fail(function(response){
		//TODO Unblock inputs
	});
}