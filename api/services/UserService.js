/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	loginWithFacebook: function (param, res) {
		User.find({FacebookID:param.FacebookID}, function (err, users) {
			if (err == null && users.length > 0) {
				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:users[0]}};
				res.end(JSON.stringify(result));
			} else {
				if (err != null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
				} else {
					User.create(param, function(err, user) {
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

	loginWithWechat: function (param, res) {
		User.find({WeChatID:param.WeChatID}, function (err, users) {
			if (err == null && users.length > 0) {
				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:users[0]}};
				res.end(JSON.stringify(result));
			} else {
				if (err != null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
				} else {
					User.create(param, function(err, user) {
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
		User.find({Email:param.Email}, function (err, users) {
			if (err == null && users.length > 0) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'User already exist.'}};
				res.end(JSON.stringify(result));
			} else {
				if (err != null) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
				} else {
					User.create(param, function(err, user) {
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

