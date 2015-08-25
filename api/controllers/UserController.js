/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	login: function (param, res) {
		User.create(param, function(err, user) {
			console.log(err);
			res.end(JSON.stringify(user));
		});
		//res.end(JSON.stringify(param));
	},
	resetPassword: function (req, res) {
		var token = req.param('token');
		var protocol = req.connection.encrypted?'https':'http';
		var baseUrl = protocol + '://' + req.headers.host + '/';

		res.view('recover/recover.ejs', {
			token: token,
			baseUrl: baseUrl
		})
	},
	savePassword: function (req, res) {
		var token = req.param('token');
		var password = req.param('newPwd');

		console.log(token);

		User.findOne({recoverToken:token}, function (err, userInfo) {
			console.log(userInfo);
			if (userInfo != null) {
				var crypto = require('crypto');
				userInfo.password = crypto.createHash('md5').update(password).digest('hex');
				userInfo.recoverToken = '';
				User.update({id:userInfo.id}, userInfo).exec(function(err, result){});
			}

			res.view('recover/recover_done.ejs', {});
		})
	}
};

  