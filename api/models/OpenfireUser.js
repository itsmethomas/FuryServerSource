/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	tableName: 'user',
    adapter: 'mysqlAdapter',
    migrate: 'safe',
		
	attributes: {
		UserID: {
			type: 'string',
		},
		UserName: {
			type: 'string',
		},
		DeviceToken: {
			type: 'string',
		},
		openfire_username: {
			type: 'string',
		},
		Status: {
			type: 'string',
		},
	},

	updateStatus: function (userId, language) {
		var query = "UPDATE user SET status='" + language + "' WHERE UserID='" + userId + "'";
		OpenfireUser.query(query, null);
	}
};