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
	},
	emailTest: function (req, res) {
		require("fs").readFile("./assets/templates/mail_template.ejb", 'utf-8', function (err, emailcontents) {
			console.log(err);

			emailcontents = emailcontents.replace('USER_NAME', "Thomas");
			emailcontents = emailcontents.replace('RESET_LINK', "http://www.google.com/");

			var nodemailer = require('nodemailer');
			var smtpTransport = require('nodemailer-smtp-transport');
			var transport = nodemailer.createTransport(smtpTransport({
			  host: 'smtp.mxhichina.com',
			  port: 25,
			  auth: {
			    user: 'recoverpwd@godinnery.com',
			    pass: "BP3MkLvfMk8ghw<}'m9_d@Xa"
			  }
			}));

			// var transport = nodemailer.createTransport({
			//     service: 'Gmail',
			//     auth: {
			//         user: 'no-reply@mandoo.com.hk',
			//         pass: 'mandoo123'
			//     }
			// });

			transport.sendMail({
				from: 'Mandoo',
				to: 'taeyong325@hotmail.com',
				subject: 'Forgot Password?',
				html: emailcontents
			}, function(err, responseStatus) {
				if (err) {
					console.log(err);
				} else {
					console.log(responseStatus.message);
				}
	        });
        });
		res.end('aa');
	}
};

  