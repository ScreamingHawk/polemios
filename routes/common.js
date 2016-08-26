module.exports.pageData = {};

module.exports.initPageData = function(session){
	if (!session){
		session = {};
	}
	pageData = {
		title: 'Polemios',
		user: session.user,
		errorMsg: '',
		successMsg: '',
		bodyClass: '',
		javascriptFiles: [],
		chatbox: {
			active: (session.chatboxActive ? true : false)
		}
	};
	return pageData;
};