module.exports = function (appCallback){
	
	var express = require('express');
	var path = require('path');
	var favicon = require('serve-favicon');
	var cookieParser = require('cookie-parser');
	var bodyParser = require('body-parser');
	var session = require('express-session');
	var async = require('async');
	var log = require('./log');

	var app = express();

	var db = require('./db');

	async.series([
		function(callback){
			if (process.env.POLEMIOS_DB_RESET === 'true') {
				log.warn('Creating database from scratch. ');
				db.createDatabaseFromScratch(callback);
			} else {
				log.warn('Updaing database. ');
				db.updateDatabase(callback);
			}
		}], function(){

			var routes = require('./routes/index');
			var userRoutes = require('./routes/user');
			var gameRoutes = require('./routes/game');

			// view engine setup
			app.set('views', path.join(__dirname, 'views'));
			app.set('view engine', 'ejs');
			
			// Force https in production
			if (app.get('env') === 'production'){
				app.use(function(req, res, next) {
					if(!req.secure && req.get('X-Forwarded-Proto') !== 'https') {
						res.redirect('https://' + req.get('Host') + req.url);
					} else {
						next();
					}
				});
			}

			// set up static and configure app
			app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
			if (app.get('env') === 'development') {
				var morgan = require('morgan');
				app.use(morgan('dev'));
			}
			app.use(bodyParser.json());
			app.use(bodyParser.urlencoded({extended: false}));
			app.use(cookieParser());
			app.use(express.static(path.join(__dirname, 'public')));

			// configure session
			var sess = {
				secret: process.env.POLEMIOS_SESSION_SECRET,
				cookie: {
					httpOnly: true,
					maxAge: 600000 // Expire session after 10 min of inactivity
				},
				rolling: true,
				saveUninitialized: true,
				resave: true
			}
			if (app.get('env') === 'production') {
				app.set('trust proxy', 1);
				sess.cookie.secure = true;
			}
			app.session = session(sess);
			app.use(app.session);

			// set up routes
			app.use('/', routes);
			app.use('/user', userRoutes);
			app.use('/game', gameRoutes);

			// catch 404 and forward to error handler
			app.use(function(req, res, next) {
				res.status(404);

				// respond with html page
				if (req.accepts('html')) {
					res.render('404', {url: req.url});
					return;
				}

				// respond with json
				if (req.accepts('json')) {
					res.send({error: 'Not found'});
					return;
				}

				// default to plain-text
				res.type('txt').send('Not found');
			});

			// error handlers

			// development error handler
			// will print stacktrace
			if (app.get('env') === 'development') {
				app.use(function(err, req, res, next) {
					res.status(err.status || 500);
					res.render('error', {
						message: err.message,
						error: err
					});
				});
			}

			// production error handler
			// no stacktraces leaked to user
			app.use(function(err, req, res, next) {
				res.status(err.status || 500);
				res.render('error', {
					message: err.message,
					error: {}
				});
			});
			
			appCallback(app);
	});
}
