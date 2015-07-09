/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	blockUser: function (param, res) {
		var blockInfo = {
			blockedUserId:param.userID
		};

		Block.create(blockInfo, function (err, block) {
			if (err) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
				res.end(JSON.stringify(result));
			} else {
				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:block}};
				res.end(JSON.stringify(result));
			}
		});
	},
	getBlockedUsers: function (param, res) {
		Block.find({}, function (err, rows) {
			var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:rows}};
			res.end(JSON.stringify(result));
		});
	},
	unBlockUser: function (param, res) {
		Block.destroy({blockedUserId:param.userID}, function (err, result) {
			var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:{}}};
			res.end(JSON.stringify(result));
		});
	}
};

