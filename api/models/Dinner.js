/**
* Dinner.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		creatorID: {
			type: 'string',
		},
		type: {
			type: 'string'
		},
		date: {
			type: 'date'
		},
		geoLocation: {
			type: 'json'
		},
		location: {
			type: 'string'
		},
		restaurantPicURL: {
			type: 'string'
		},
		restaurantName: {
			type: 'string'
		},
		restaurantAddress: {
			type: 'string'
		},	
		carriedMessage: {
			type: 'string'
		},
		genderLimit: {
			type: 'string'
		},
		ageLowerLimit: {
			type: 'string'
		},
		ageUpperLimit: {
			type: 'string'
		},
		status: {
		},
		candidateList: {
			type: 'json'
		},
	}
};