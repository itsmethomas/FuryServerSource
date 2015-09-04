/**
 * ApiController
 *
 * @description :: Server-side logic for managing Apis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	emailTest: function (req, res) {
		var nodemailer = require('nodemailer');
		// var smtpTransport = require('nodemailer-smtp-transport');
		// var transport = nodemailer.createTransport(smtpTransport({
		//   host: '52.8.37.193',
		//   port: 587,
		//   auth: {
		//     user: 'ubuntu',
		//     pass: '123'
		//   }
		// }));

		var transporter = nodemailer.createTransport({
		    service: 'Gmail',
		    auth: {
		        user: 'no-reply@mandoo.com.hk',
		        pass: 'mandoo1234'
		    }
		});

		transport.sendMail({
			from: 'taeyong325@hotmail.com',
			to: 'itsmethomas1225@hotmail.com',
			subject: 'Please confirm your e-mail address',
			html: 'adsfasdfasfasd',
			text: 'asdasdfasdf'
		}, function(err, responseStatus) {
			if (err) {
				console.log(err);
			} else {
				console.log(responseStatus.message);
			}
        });

        res.end('aa');
	},
	apiAction: function(req, res) {
		var param = req.body.FuryRequest;
		var reqMethod = param.RequestMethod;

		var protocol = req.connection.encrypted?'https':'http';
		var baseUrl = protocol + '://' + req.headers.host + '/';

		param.RequestParam.baseUrl = baseUrl;
		param.RequestParam.status = 1;

		if (reqMethod == 'loginWithFacebook') {
			UserService.loginWithFacebook(param.RequestParam, res);
		} else if (reqMethod == 'loginWithWeChat') {
			UserService.loginWithWeChat(param.RequestParam, res);
		} else if (reqMethod == 'registerWithEmail') {
			UserService.registerWithEmail(param.RequestParam, res);
		} else if (reqMethod == 'loginWithEmail') {
			UserService.loginWithEmail(param.RequestParam, res);
		} else if (reqMethod == 'recoverPassword') {
			UserService.recoverPassword(param.RequestParam, res);
		} else if (reqMethod == 'checkVersion') {
			AppVersion.findOne({}, function (err, version) {
				if (version == null) {
					AppVersion.create({
						minVersion: "1.0",
						remVersion: "1.0",
						maxVersion: "1.0"
					}, function (err, version) {
						var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:version}};
						res.end(JSON.stringify(result));
					});
				} else {
					var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:version}};
					res.end(JSON.stringify(result));
				}
			});

		} else {
			User.findOne({id:param.UserID}, function (err, user) {
				// set language Info...
				user.language = param.RequestParam.language;
				User.update({id:user.id}, user).exec(function (err, res){});
				OpenfireUser.updateStatus(user.id, user.language);

				if (err != null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
					return;
				} else if (user == null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
					return;
				} else {
					if (user.apiKey != param.APIKey) {
						var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Token does not match.'}};
						res.end(JSON.stringify(result));
						return;
					}
				}

				if (reqMethod == 'saveUserSettings') {
					UserService.saveSettings(param.RequestParam, user, res);
				} else if (reqMethod == 'editUserPictures') {
					UserService.editUserPictures(param.RequestParam, user, res);
				} else if (reqMethod == 'editUserNameAndBirthday') {
					user.deviceToken = param.RequestParam.deviceToken;
					user.name = param.RequestParam.name;
					user.birthday = param.RequestParam.birthday;

					User.update({id:user.id}, user).exec(function (err, users){
						var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:users[0]}};
						res.end(JSON.stringify(result));
					});
				} else if (reqMethod == 'editUserAboutMe') {
					user.deviceToken = param.RequestParam.deviceToken;
					user.aboutMe = param.RequestParam.aboutMe;
					user.job = param.RequestParam.job;
					user.height = param.RequestParam.height;
					user.location = param.RequestParam.location;

					User.update({id:user.id}, user).exec(function (err, result){
						var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:result[0]}};
						res.end(JSON.stringify(result));
					});
				} else if (reqMethod == 'editUserHobbies') {
					user.deviceToken = param.RequestParam.deviceToken;
					user.hobbies = param.RequestParam.hobbies;

					User.update({id:user.id}, user).exec(function (err, result){
						var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:result[0]}};
						res.end(JSON.stringify(result));
					});
				} else if (reqMethod == 'logoutUser') {
					user.deviceToken = param.RequestParam.deviceToken;
					user.status = 0;
					user.apiKey = "";

					User.update({id:user.id}, user).exec(function (err, result){
						var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:result[0]}};
						res.end(JSON.stringify(result));
					});
				} else if (reqMethod == 'deleteUser') {
					user.deviceToken = param.RequestParam.deviceToken;
					user.status = -1;
					user.apiKey = "";

					User.update({id:user.id}, user).exec(function (err, result){
						var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:result[0]}};
						res.end(JSON.stringify(result));
					});
				} else if (reqMethod == 'fetchUserProfile') {
					User.findOne({id:param.RequestParam.userID}, function (err, user){
						if (user == null) {
							var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'User does not exist.'}};
							res.end(JSON.stringify(result));
						} else {
							delete user.password;
							delete user.apiKey;
							delete user.openfire_password;

							var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:user}};
							res.end(JSON.stringify(result));
						}
					});
				} else if (reqMethod == 'fetchOfficialAccounts') {
					User.find({}, function (err, result){
						if (err == null) {
							for (i = 0; i < result.length; i++) {
								var user = result[i];

								delete user.password;
								delete user.apiKey;
								delete user.openfire_password;
							}
							var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:result}};
							res.end(JSON.stringify(result));
						} else {
							var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error.'}};
							res.end(JSON.stringify(result));
						}
					});
				} else if (reqMethod == 'createDinner') {
					DinnerService.createDinner(param.RequestParam, res);

				} else if (reqMethod == 'fetchAllDinners') {
					DinnerService.fetchAllDinners(param.RequestParam, res);

				} else if (reqMethod == 'getNearbyDates') {
					DinnerService.getDatesNearCurrentLocation(param.RequestParam, res);

				} else if (reqMethod == 'getNearbyDinners') {
					DinnerService.getDinnersNearCurrentLocation(param.RequestParam, res);

				} else if (reqMethod == 'applyDinner') {
					DinnerService.applyDinner(param.RequestParam, res);

				} else if (reqMethod == 'quitDinner') {
					DinnerService.quitDinner(param.RequestParam, res);

				} else if (reqMethod == 'getDinnerWithID') {
					DinnerService.getDinnerWithID(param.RequestParam, res);

				} else if (reqMethod == 'cancelDinner') {
					DinnerService.cancelDinner(param.RequestParam, res);

				} else if (reqMethod == 'getDinnersICreated') {
					DinnerService.getDinnersICreated(param.RequestParam, res);

				} else if (reqMethod == 'getDinnersIApplied') {
					DinnerService.getDinnersIApplied(param.RequestParam, res);

				} else if (reqMethod == 'blockUser') {
					BlockService.blockUser(param.RequestParam, res);

				} else if (reqMethod == 'getBlockedUsers') {
					BlockService.getBlockedUsers(param.RequestParam, res);

				} else if (reqMethod == 'unBlockUser') {
					BlockService.unBlockUser(param.RequestParam, res);
				}
			});
		}
	}
};

