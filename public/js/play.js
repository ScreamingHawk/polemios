var gameForm = $('#gameForm');

$('#move-never').click(function(e){
	e.preventDefault();
	return submitFormWithAction(gameForm, 'move', 'north');
});
$('#move-eat').click(function(e){
	e.preventDefault();
	return submitFormWithAction(gameForm, 'move', 'east');
});
$('#move-soggy').click(function(e){
	e.preventDefault();
	return submitFormWithAction(gameForm, 'move', 'south');
});
$('#move-weetbix').click(function(e){
	e.preventDefault();
	return submitFormWithAction(gameForm, 'move', 'west');
});