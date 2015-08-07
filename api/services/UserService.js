/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	randomizeString: function (strLength) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < strLength; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	},

	initOpenfireInfo: function (name, email) {
		var d = new Date();
		var timestamp = d.getTime();
		var username = 'op_user_' + this.randomizeString(5) + '_' + timestamp;
		var password = this.randomizeString(10);

		var http = require("http");

		var pathComp = "/plugins/userService/userservice?type=add&secret=T1N15RwD&username="
					+ username + "&password=" + password + "&name=" + encodeURIComponent(name) + "&email=" + encodeURIComponent(email);
		var ops = {
		  host: '52.8.37.193',
		  port: 9090,
		  path: pathComp,
		  method: 'GET'
		};

		var req = http.request(ops, function(res) {
		  console.log('STATUS: ' + res.statusCode);
		  console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.setEncoding('utf8');
		  res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		  });
		});

		req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});

		req.end();

		return {opuser_name:username, op_password:password};
	},

	initUserInfo: function (orgInfo) {
		var openfireInfo = UserService.initOpenfireInfo(orgInfo.name, orgInfo.email);
		orgInfo.openfire_username = openfireInfo.opuser_name;
		orgInfo.openfire_password = openfireInfo.op_password;

		if (orgInfo.aboutMe == null) {
			orgInfo.aboutMe = '';
		}
		if (orgInfo.height == null) {
			orgInfo.height = '0';
		}
		if (orgInfo.job == null) {
			orgInfo.job = '';
		}
		if (orgInfo.location == null) {
			orgInfo.location = '';
		}
		if (orgInfo.hobbies == null) {
			orgInfo.hobbies = [];
		}

		if (orgInfo.email == null) {
			orgInfo.email = '';
		}

		if (orgInfo.settings == null) {
			orgInfo.settings = {showMe:2, lowerAgeLimit:18, upperAgeLimit:51, newApplication:1, chatMessage:1};
		}

		orgInfo.apiKey = UserService.randomizeString(40);

		return orgInfo;
	},

	setDinnerInfo: function (userInfo, res) {
		Dinner.find({creator:userInfo.id}, function (err, dinners) {
			var createdDinnerList = [];
			for (i=0; i<dinners.length; i++){
				createdDinnerList.push(dinners[i].id);
			}
			userInfo.createdDinnerList = createdDinnerList;
			DinnerApply.find({applyUserId:userInfo.id}, function (err, dinners) {
				var appliedDinnerList = [];
				for (i=0; i<dinners.length; i++){
					appliedDinnerList.push(dinners[i].dinnerId);
				}
				userInfo.appliedDinnerList = appliedDinnerList;
				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:userInfo}};
				res.end(JSON.stringify(result));
			});
		});
	},

	loginWithFacebook: function (param, res) {
		User.find({facebookID:param.facebookID}, function (err, users) {
			if (err == null && users.length > 0) {
				var user = users[0];
				user.apiKey = UserService.randomizeString(40);
				User.update({id:user.id}, user).exec(function (err, result){});

				UserService.setDinnerInfo(user, res);
			} else {
				if (err != null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
				} else {
					var userInfo = UserService.initUserInfo(param);

					User.create(userInfo, function(err, user) {
						if (err == null) {
							user.createdDinnerList = [];
							user.appliedDinnerList = [];
							var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:user}};
							res.end(JSON.stringify(result));
						} else {
							console.log(err);
							var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
							res.end(JSON.stringify(result));
						}
					});
				}
			}
		});
	},

	loginWithWeChat: function (param, res) {
		User.find({weChatID:param.weChatID}, function (err, users) {
			console.log(err);
			console.log(users);
			if (err == null && users.length > 0) {
				var user = users[0];
				user.apiKey = UserService.randomizeString(40);
				User.update({id:user.id}, user).exec(function (err, result){});

				UserService.setDinnerInfo(user, res);
			} else {
				if (err != null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:err}};
					res.end(JSON.stringify(result));
				} else {
					var userInfo = UserService.initUserInfo(param);
					User.create(userInfo, function(err, user) {
						if (err == null) {
							user.createdDinnerList = [];
							user.appliedDinnerList = [];
							var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:user}};
							res.end(JSON.stringify(result));
						} else {
							var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:err}};
							res.end(JSON.stringify(result));
						}
					});
				}
			}
		});
	},

	registerWithEmail: function (param, res) {
		User.find({email:param.email}, function (err, users) {
			if (err == null && users.length > 0) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'User already exist.'}};
				res.end(JSON.stringify(result));
			} else {
				if (err != null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
				} else {
					var userInfo = UserService.initUserInfo(param);

					// Saving Photo...
					if (userInfo.photo) {
						var d = new Date();
						var timestamp = d.getTime();
						var photoname = 'photo_' + UserService.randomizeString(5) + '_' + timestamp + '.jpg';
						require("fs").writeFile("./assets/photos/" + photoname, userInfo.photo, 'base64', function (err) {
							console.log(err);
						});

						userInfo.photoUrls = [userInfo.baseUrl + "photos/" + photoname];
					}

					// Hash Password
					if (userInfo.password) {
						var crypto = require('crypto');
						userInfo.password = crypto.createHash('md5').update(userInfo.password).digest('hex');
					}

					User.create(userInfo, function(err, user) {
						if (err == null) {
							user.createdDinnerList = [];
							user.appliedDinnerList = [];
							var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:user}};
							res.end(JSON.stringify(result));
						} else {
							var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
							res.end(JSON.stringify(result));
						}
					});
				}
			}
		});
	},
	
	loginWithEmail: function (param, res) {
		User.find({email:param.email}, function (err, users) {
			if (err == null && users.length == 0) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'User does not exist.'}};
				res.end(JSON.stringify(result));
			} else {
				if (err != null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
				} else {
					var userInfo = users[0];
					var crypto = require('crypto');
					var hashed_pwd = crypto.createHash('md5').update(param.password).digest('hex');

					if (userInfo.password != hashed_pwd) {
						var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:"Email and password doesn't match."}};
						res.end(JSON.stringify(result));
					} else {
						userInfo.apiKey = UserService.randomizeString(40);
						User.update({id:userInfo.id}, userInfo).exec(function (err, result){});

						UserService.setDinnerInfo(user, res);
					}
				}
			}
		});
	},

	saveSettings: function (param, user, res) {
		user.settings = {
			showMe: param.showMe,
			lowerAgeLimit: param.lowerAgeLimit,
			upperAgeLimit: param.upperAgeLimit,
			newApplication: param.newApplication,
			chatMessage: param.chatMessage,
		};
		user.deviceToken = param.deviceToken;

		User.update({id:user.id}, user).exec(function (err, result){
			var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:user}};
			res.end(JSON.stringify(result));
		});
	},

	editUserPictures: function (param, user, res) {
		user.deviceToken = param.deviceToken;
		user.photoUrls = [];
		for (i=0; i<param.photos.length; i++) {
			var d = new Date();
			var timestamp = d.getTime();
			var photoname = 'photo_' + UserService.randomizeString(5) + '_' + timestamp + '.jpg';
			require("fs").writeFile("./assets/photos/" + photoname, param.photos[i], 'base64', function (err) {
				console.log(err);
			});

			user.photoUrls.push (param.baseUrl + "photos/" + photoname);
		}

		User.update({id:user.id}, user).exec(function (err, result){
			var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:user}};
			res.end(JSON.stringify(result));
		});
	}
};

