/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var LANGUAGE_EN: 'en';
var LANGUAGE_CHINESE_TRADITIONAL: 'zh_hant';
var LANGUAGE_CHINESE_SIMPLIFIED: 'zh_hans';

module.exports = {
	LANGUAGE_EN: 'en',
	LANGUAGE_CHINESE_TRADITIONAL: 'zh_hant',
	LANGUAGE_CHINESE_SIMPLIFIED: 'zh_hans',
		
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
		recoverToken: {
			type: 'string'
		},
		language: {
			type: 'string'
		}
	},
	sendPush: function (deviceToken, msg) {
		var apnagent = require('apnagent');
		agent = module.exports = new apnagent.Agent();

		var join = require('path').join;
		var pfx = join(__dirname, '../../certs/aps_dev.p12');

		agent.set('pfx file', pfx);
		agent.enable('sandbox');

		agent.connect(function (err) {
		});

		console.log(deviceToken);
		console.log(msg);

		agent.createMessage().device(deviceToken).alert(msg).send();
	},
};