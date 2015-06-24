/**
 * ApiController
 *
 * @description :: Server-side logic for managing Apis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	apiAction: function(req, res) {
		req = req.body.FuryRequest;
		var reqMethod = req.RequestMethod;

		if (reqMethod == 'loginWithFacebook') {
			UserService.loginWithFacebook(req.RequestParam, res);
		} else if (reqMethod == 'loginWithWechat') {
			UserService.loginWithWechat(req.RequestParam, res);
		} else if (reqMethod == 'registerWithEmail') {
			UserService.registerWithEmail(req.RequestParam, res);
		}
	}
};

