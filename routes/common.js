module.exports.pageData = {};

module.exports.initPageData = function(session){
	pageData = {
		title: 'Polemios',
		user: session.user,
		errorMsg: '',
		successMsg: '',
		javascriptFiles: []
	};
	return pageData;
};