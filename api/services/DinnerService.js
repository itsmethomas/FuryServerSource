/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	createDinner: function (param, res) {
		var dinnerInfo = {
			creator: param.creator,
			type: param.type,
			date: param.date,
			geoLocation: param.geoLocation,
			location: param.location,
			restaurantPicURL: param.restaurantPicURL,
			restaurantName: param.restaurantName,
			restaurantAddress: param.restaurantAddress,
			carriedMessage: param.carriedMessage,
			genderLimit: param.genderLimit,
			ageUpperLimit: param.ageUpperLimit,
			ageLowerLimit: param.ageLowerLimit,
			status:0,
			candidateList:[]
		};

		Dinner.create(dinnerInfo, function (err, dinner) {
			if (err) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
				res.end(JSON.stringify(result));
			} else {
				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:{dinnerID:dinner.id}}};
				res.end(JSON.stringify(result));
			}
		});
	},
	fetchAllDinners: function (param, res) {
		Dinner.find({}, function (err, rows) {
			var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:rows}};
			res.end(JSON.stringify(result));
		});
	},
	applyDinner: function (param, res) {
		var dinnerID = param.dinnerID;
		var userID = param.id;

		Dinner.findOne({id:dinnerID}, function (err1, dinnerInfo) {
			User.findOne({id:userID}, function (err2, userInfo) {
				if (err1 || err2) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
				} else {
					console.log(userInfo);
					var candidateList = dinnerInfo.candidateList == '' ? [] : dinnerInfo.candidateList;
					var candidateInfo = {id:userInfo.id, name:userInfo.name, picURL: (userInfo.photoUrls == null ? '' : (userInfo.photoUrls.length > 0 ? userInfo.photoUrls[0] : ''))};

					candidateList.push(candidateInfo);
					console.log(candidateList);
					dinnerInfo.candidateList = candidateList;
					Dinner.update({id:dinnerID}, dinnerInfo).exec(function (err, result){});
					DinnerApply.create({dinnerId:dinnerID, applyUserId:userID}, function (err, dinner) {});

					var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:dinnerInfo}};
					res.end(JSON.stringify(result));
				}
			});
		});
	},
	quitDinner: function (param, res) {
		var dinnerID = param.dinnerID;
		var userID = param.id;

		Dinner.findOne({id:dinnerID}, function (err, dinnerInfo) {
			if (err) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
				res.end(JSON.stringify(result));
			} else {
				var candidateList = dinnerInfo.candidateList;
				for (i=0; i<candidateList.length; i++) {
					if (candidateList[0].id == userID) {
						candidateList.splice(i, 1);
						break;
					}
				}

				Dinner.update({id:dinnerID}, dinnerInfo).exec(function (err, result){});

				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:dinnerInfo}};
				res.end(JSON.stringify(result));
			}
		});
	},
	getDinnerWithID: function (param, res) {
		var dinnerID = param.dinnerID;
		var userID = param.id;

		Dinner.findOne({id:dinnerID}, function (err, dinnerInfo) {
			if (err) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
				res.end(JSON.stringify(result));
			} else {
				console.log(dinnerInfo);
				/*User.findOne({id:dinnerInfo.creator}, function (err, creatorInfo) {
					if (err) {
						var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
						res.end(JSON.stringify(result));
					} else {
						if (creatorInfo == null) {
							dinnerInfo.creator = {};
						} else {
							delete creatorInfo.password;
							delete creatorInfo.apiKey;
							delete creatorInfo.openfire_password;

							dinnerInfo.creator = creatorInfo;
						}
						var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:dinnerInfo}};
						res.end(JSON.stringify(result));
					}
				});*/
			}
		});
	},
	cancelDinner: function (param, res) {
		var dinnerID = param.dinnerID;
		var userID = param.id;

		Dinner.findOne({id:dinnerID}, function (err, dinnerInfo) {
			if (err) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
				res.end(JSON.stringify(result));
			} else {
				dinnerInfo.status = -1;
				Dinner.update({id:dinnerID}, dinnerInfo).exec(function (err, result){});

				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:dinnerInfo}};
				res.end(JSON.stringify(result));
			}
		});
	},
	getDatesNearCurrentLocation: function (param, res) {
		var dinnerID = param.dinnerID;
		var userID = param.id;

		Dinner.find({type:0}, function (err, rows) {
			if (err) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
				res.end(JSON.stringify(result));
			} else {
				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:rows}};
				res.end(JSON.stringify(result));
			}
		});
	},
	getDinnersNearCurrentLocation: function (param, res) {
		var dinnerID = param.dinnerID;
		var userID = param.id;

		Dinner.find({type:1}, function (err, rows) {
			if (err) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
				res.end(JSON.stringify(result));
			} else {
				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:rows}};
				res.end(JSON.stringify(result));
			}
		});
	},
};

