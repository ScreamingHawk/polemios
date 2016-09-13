module.exports.pageData = {};

module.exports.initPageData = function(session){
	if (!session){
		session = {};
	}
	pageData = {
		title: 'Polemios',
		user: session.user,
		errorMsg: (session.errorMsg ? session.errorMsg : ''),
		successMsg: (session.successMsg ? session.successMsg : ''),
		bodyClass: '',
		javascriptFiles: [],
		chatbox: {
			active: (session.chatboxActive ? true : false)
		}
	};
	session.errorMsg = '';
	session.successMsg = '';
	return pageData;
};