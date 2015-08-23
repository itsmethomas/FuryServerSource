/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	tableName: 'user_settings',
    adapter: 'mysqlAdapter',
    migrate: 'safe',
		
	attributes: {
		UserID: {
			type: 'string',
		},
		NoChatMessage: {
			type: 'string',
		}
	}
};