/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	login: function (param, res) {
		User.create(param, function(err, user) {
			console.log(err);
			res.end(JSON.stringify(user));
		});
		//res.end(JSON.stringify(param));
	}
};

  