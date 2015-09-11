/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	createDinner: function (param, res) {
		var dinnerInfo = {
			creatorID: param.creatorID,
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
				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:dinner}};
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

		DinnerApply.find({dinnerId:dinnerID, applyUserId:userID}, function (err, result) {
			if (err != null) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
				res.end(JSON.stringify(result));
			} else if (result.length > 0) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'You already applied to this dinner.'}};
				res.end(JSON.stringify(result));
			} else {
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

						// send APNS
						console.log(dinnerInfo.creatorID);
						User.findOne({id:dinnerInfo.creatorID}, function (err, creatorInfo) {
							if (creatorInfo != null) {
								console.log(creatorInfo);
								var msg = userInfo.name;
								if (creatorInfo.language == 'zh_hant') {
									msg += " 剛剛申請了您的約飯";
								} else if (creatorInfo.language == 'zh_hans') {
									msg += " 刚刚申请了你的约饭";
								} else {
									msg += " just applied your dinner";
								}

								console.log(msg);
								User.sendPush(creatorInfo.deviceToken, msg);
							}
						});
					});
				});
			}
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
				DinnerApply.remove({dinnerId:dinnerID, applyUserId:userID}, function (err, result){});

				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:dinnerInfo}};
				res.end(JSON.stringify(result));
			}
		});
	},
	getDinnerWithID: function (param, res) {
		var dinnerID = param.dinnerID;
		var userID = param.id;

		console.log(dinnerID);
		Dinner.findOne({id:dinnerID}, function (err, dinnerInfo) {
			if (err || dinnerInfo == null) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
				res.end(JSON.stringify(result));
			} else {
				console.log(dinnerInfo);
				User.findOne({id:dinnerInfo.creatorID}, function (err, creatorInfo) {
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
				});
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
		var location = param.geoLocation;
		var page = param.page;

		var condition = {
			"geoLocation":{
				$near:{
					$geometry: {
						type: "Point",
						coordinates:
						[
							location.coordinates[0],
							location.coordinates[1]
						]
					}
				}
			},
			type: '1'
		};

		Dinner.native(function(err, collection) {
		    collection.ensureIndex({geoLocation:"2dsphere"}, function (err, result) {
		    	console.log(err);
		    	console.log(result);
				Dinner.find({where:condition, limit:60, skip:(page * 60)}, function (err, rows) {
					if (err) {
						console.log(err);
						var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
						res.end(JSON.stringify(result));
					} else {
						DinnerService.setCreatorInfo(rows, res);
					}
				});
		    });
		});

	},
	getDinnersNearCurrentLocation: function (param, res) {
		var dinnerID = param.dinnerID;
		var userID = param.id;
		var location = param.geoLocation;
		var page = param.page;

		var condition = {
			"geoLocation":{
				$near:{
					$geometry: {
						type: "Point",
						coordinates:
						[
							location.coordinates[0],
							location.coordinates[1]
						]
					}
				}
			},
			type: '0'
		};

		Dinner.native(function(err, collection) {
		    collection.ensureIndex({geoLocation:"2dsphere"}, function (err, result) {
				Dinner.find({where:condition, limit:60, skip:(page * 60)}, function (err, rows) {
					if (err) {
						console.log(err);
						var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
						res.end(JSON.stringify(result));
					} else {
						DinnerService.setCreatorInfo(rows, res);
					}
				});
		    });
		});

	},

	setCreatorInfo: function (dinners, res) {
		var creatorIdArray = [];
		for (i=0; i<dinners.length; i++ ) {
			creatorIdArray.push(dinners[i].creatorID);
		}

		console.log(creatorIdArray);

		User.find({id: {$in:creatorIdArray}}, function (err, users) {
			if (err != null) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
				res.end(JSON.stringify(result));
				return;
			}

			for (i=0; i<users.length; i++) {
				var creatorInfo = users[i];
				delete creatorInfo.password;
				delete creatorInfo.apiKey;
				delete creatorInfo.openfire_password;
			}

			for (i=0; i<dinners.length; i++) {
				var dinnerInfo = dinners[i];
				for (j=0; j<users.length; j++) {
					if (users[j].id == dinnerInfo.creatorID) {
						dinnerInfo.creatorInfo = users[j];
						break;
					}
				}
			}

			var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:dinners}};
			res.end(JSON.stringify(result));
		})
	},
	getDinnersIApplied: function (param, res) {
		var userId = param.id;
		DinnerApply.find({applyUserId:userId}, function (err, rows) {
			var dinnerIds = [];
			for (i = 0; i<rows.length; i++) {
				var item = rows[i];
				dinnerIds.push(item.dinnerId);
			}

			Dinner.find({id: {$in:dinnerIds}}, function (err, dinners) {
				if (err) {
					var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
					res.end(JSON.stringify(result));
				} else {
					var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:dinners}};
					res.end(JSON.stringify(result));
				}
			});
		});
	}, 
	getDinnersICreated: function (param, res) {
		var userId = param.id;
		Dinner.find({creatorID: userId}, function (err, dinners) {
			if (err) {
				var result = {FuryResponse:{ResponseResult:'NO', ResponseContent:'Internal Server Error'}};
				res.end(JSON.stringify(result));
			} else {
				var result = {FuryResponse:{ResponseResult:'YES', ResponseContent:dinners}};
				res.end(JSON.stringify(result));
			}
		});
	},
};

