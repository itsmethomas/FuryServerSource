/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
		
	attributes: {
		name: {
			type: 'string',
			required: true
		},
		email: {
			type: 'email', // Email type will get validated by the ORM
		},
		password: {
			type: 'string',
		},
		gender: {
			type: 'string'
		},
		birthday: {
			type: 'date'
		},
		height: {
			type: 'string'
		},
		job: {
			type: 'string'
		},
		location: {
			type: 'string'
		},
		hobbies: {
			type: 'json'
		},
		aboutMe: {
			type: 'string'
		},
		facebookID: {
			type: 'string'
		},
		weChatID: {
			type: 'string'
		},
		deviceToken: {
			type: 'string'
		},
		status: {
			type: 'string'
		},
		photoUrls: {
			type: 'json'
		},
		settings: {
			type: 'json'
		},
		openfire_username: {
			type: 'string'
		},
		openfire_password: {
			type: 'string'
		},
		deviceModel: {
			type: 'string'
		},
		settingID: {
			type: 'string'
		},
		apiKey: {
			type: 'string'
		},
		dinners: {
            collection: 'dinner',
            via: 'creatorID'
		}
	}
};