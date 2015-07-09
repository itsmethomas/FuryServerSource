/**
 * ApiController
 *
 * @description :: Server-side logic for managing Apis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
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
		} else {
			User.findOne({id:param.UserID}, function (err, user) {
				if (err != null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
				} else if (user == null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
				} else {
					if (user.apiKey != param.APIKey) {
						var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Token does not match.'}};
						res.end(JSON.stringify(result));
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

					User.update({id:user.id}, user).exec(function (err, result){
						var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:result}};
						res.end(JSON.stringify(result));
					});
				} else if (reqMethod == 'editUserAboutMe') {
					user.deviceToken = param.RequestParam.deviceToken;
					user.aboutMe = param.RequestParam.aboutMe;
					user.job = param.RequestParam.job;
					user.height = param.RequestParam.height;
					user.location = param.RequestParam.location;

					User.update({id:user.id}, user).exec(function (err, result){
						var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:result}};
						res.end(JSON.stringify(result));
					});
				} else if (reqMethod == 'editUserHobbies') {
					user.deviceToken = param.RequestParam.deviceToken;
					user.hobbies = param.RequestParam.hobbies;

					User.update({id:user.id}, user).exec(function (err, result){
						var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:result}};
						res.end(JSON.stringify(result));
					});
				} else if (reqMethod == 'logoutUser') {
					user.deviceToken = param.RequestParam.deviceToken;
					user.status = 0;
					user.apiKey = "";

					User.update({id:user.id}, user).exec(function (err, result){
						var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:result}};
						res.end(JSON.stringify(result));
					});
				} else if (reqMethod == 'deleteUser') {
					user.deviceToken = param.RequestParam.deviceToken;
					user.status = -1;
					user.apiKey = "";

					User.update({id:user.id}, user).exec(function (err, result){
						var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:result}};
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

				} else if (reqMethod == 'getDatesNearCurrentLocation') {
					DinnerService.getDatesNearCurrentLocation(param.RequestParam, res);

				} else if (reqMethod == 'getDinnersNearCurrentLocation') {
					DinnerService.fetchAllDinners(param.RequestParam, res);

				} else if (reqMethod == 'applyDinner') {
					DinnerService.applyDinner(param.RequestParam, res);

				} else if (reqMethod == 'quitDinner') {
					DinnerService.quitDinner(param.RequestParam, res);

				} else if (reqMethod == 'getDinnerWithID') {
					DinnerService.getDinnerWithID(param.RequestParam, res);

				} else if (reqMethod == 'cancelDinner') {
					DinnerService.cancelDinner(param.RequestParam, res);

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

