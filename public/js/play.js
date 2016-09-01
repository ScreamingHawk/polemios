var gameForm = null;
var gameContainer = $('#gameContainer');

setUpGameForm = function(){
	gameForm = $('#gameForm');
	// Set up inventory
	$('#showHideInventory').click(function(e){
		e.preventDefault();
		var inventory = $('#inventory');
		if (inventory.hasClass('hidden')){
			inventory.removeClass('hidden');
			$(this).text('Hide Inventory');
		} else {
			inventory.addClass('hidden');
			$(this).text('Show Inventory');
		}
	});
	$('[data-unequipleft]').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('unequipleft', $(this).data('unequipleft'));
	});
	$('[data-unequipright]').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('unequipright', $(this).data('unequipright'));
	});
	$('[data-equipleft]').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('equipleft', $(this).data('equipleft'));
	});
	$('[data-equipright]').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('equipright', $(this).data('equipright'));
	});
	$('[data-unequipbody]').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('unequipbody', $(this).data('unequipbody'));
	});
	$('[data-equipbody]').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('equipbody', $(this).data('equipbody'));
	});
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
	$('#move-refresh').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('refresh', 'refresh');
	});
	// Set up shop buttons
	$('#buyWeaponButton').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('buyWeapon', $('#buyWeapon').val());
	});
	$('#buyArmourButton').click(function(e){
		e.preventDefault();
		return ajaxGameFormAction('buyArmour', $('#buyArmour').val());
	});
};
setUpGameForm();

ajaxGameFormAction = function(action, value){
	//TODO Block inputs
	console.log('ajaxing');
	
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