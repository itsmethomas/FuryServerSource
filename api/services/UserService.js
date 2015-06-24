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

		var pathComp = "/plugins/userService/userservice?type=add&secret=2W27gUNY&username="
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

		orgInfo.apiKey = UserService.randomizeString(40);

		return orgInfo;
	},

	loginWithFacebook: function (param, res) {
		User.find({facebookID:param.facebookID}, function (err, users) {
			if (err == null && users.length > 0) {
				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:users[0]}};
				res.end(JSON.stringify(result));
			} else {
				if (err != null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
				} else {
					var userInfo = UserService.initUserInfo(param);

					User.create(userInfo, function(err, user) {
						if (err == null) {
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
			if (err == null && users.length > 0) {
				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:users[0]}};
				res.end(JSON.stringify(result));
			} else {
				if (err != null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
				} else {
					var userInfo = UserService.initUserInfo(param);
					User.create(userInfo, function(err, user) {
						if (err == null) {
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
					User.create(userInfo, function(err, user) {
						if (err == null) {
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
};
