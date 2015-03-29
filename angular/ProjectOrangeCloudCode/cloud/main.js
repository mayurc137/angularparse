// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("followUsers", function (request, response) {

	//var user1 = request.params.user1; // Logged In
	//var user2 = request.params.user2;


	var user1query = new Parse.Query(Parse.User);

	user1query.get(request.params.user1, {
		success: function (user1) {
			var user2query = new Parse.Query(Parse.User);
			user2query.get(request.params.user2, {
				success: function (user2) {
					user1.addUnique("user_following", user2);
					user1.save(null, {
						success: function (object) {
							user2.addUnique("user_followed", user1);
							user2.save(null, {
								useMasterKey: true
							}).then(function (user) {
								response.success(true);
							}, function (error) {
								response.error(error);
							})
						},
						error: function (error, message) {

						}
					});
				},
				error: function (error, message) {

				}
			});
		},
		error: function (error, message) {
			response.error(message);
		}
	});

});