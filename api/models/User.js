/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
		
	attributes: {
		Name: {
			type: 'string',
			required: true
		},
		Email: {
			type: 'email', // Email type will get validated by the ORM
			required: true
		},
		Password: {
			type: 'string',
		},
		Gender: {
			type: 'string'
		},
		Birthday: {
			type: 'date'
		},
		Height: {
			type: 'string'
		},
		Job: {
			type: 'string'
		},
		AboutMe: {
			type: 'json'
		},
		FacebookID: {
			type: 'json'
		},
		WeChatID: {
			type: 'string'
		},
		DeviceToken: {
			type: 'string'
		},
		Status: {
			type: 'string'
		},
		PhotoURLs: {
			type: 'json'
		},
		openfire_username: {
			type: 'string'
		},
		openfire_password: {
			type: 'string'
		},
		DeviceModel: {
			type: 'string'
		},
		SettingID: {
			type: 'string'
		},
		apiKey: {
			type: 'string'
		},
	}
};