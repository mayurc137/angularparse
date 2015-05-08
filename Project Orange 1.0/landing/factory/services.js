var parseServices = angular.module('parseServices', ['parse-angular']);

parseServices.factory('ParseFactory', ['$q',
    function($q) {

        var factory = {};

        factory.init = function() {
            Parse.initialize("ZaHk6NzbXLus8EmO0DetfsigR3I2zi4O9D8u5iIG", "kqu6hlxW83BqIeaOBuEgaFr1wyOZ6kNO9VxO5f89");
            window.fbAsyncInit = function() {
                Parse.FacebookUtils.init({ // this line replaces FB.init({
                    appId: '778139162267115', // Facebook App ID
                    status: true, // check Facebook Login status
                    cookie: true, // enable cookies to allow Parse to access the session
                    xfbml: true, // initialize Facebook social plugins on the page
                    version: 'v2.2' // point to the latest Facebook Graph API version
                });

                // Run code after the Facebook SDK is loaded.
            };

            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = "http://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }

        /* Functions For User SignUp and Login Start Here */
        factory.fbLogin = function() {

            var deferred = $q.defer();

            Parse.FacebookUtils.logIn("email", {
                success: function(user) {
                    if (!user.existed()) {
                        console.log("User signed up and logged in through Facebook!");
                        user.infoSet = false;
                        deferred.resolve(user);

                    } else {
                        console.log("User logged in through Facebook!");
                        user.infoSet = true;
                        deferred.resolve(user);
                    }
                },
                error: function(error, message) {
                    alert("User cancelled the Facebook login or did not fully authorize.");
                    deferred.reject(message);

                }
            });

            return deferred.promise;
        }

        factory.shareToFb = function(url) {
            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.likes',
                action_properties: JSON.stringify({
                    object: url,
                })
            }, function(response) {});
        }

        factory.getCurrentUser = function() {
            var currentUser = Parse.User.current();
            return currentUser;
        }

        factory.logOut = function() {
            Parse.User.logOut();
        }

        factory.getUserData = function() {

            var deferred = $q.defer();
            var currentUser = Parse.User.current();
            var userData = {};
            if (currentUser) {
                FB.api("/me", function(response) {
                    userData.email = response.email;
                    userData.name = response.name;
                    userData.id = response.id;
                    userData.gender = response.gender;
                    deferred.resolve(userData);
                });
            } else {
                deferred.reject("User Not Signed In");
            }

            return deferred.promise;
        }

        factory.getUserPicture = function() {

            var deferred = $q.defer();
            var currentUser = Parse.User.current();
            var userData = {};
            if (currentUser) {
                FB.api("/me/picture", function(response) {
                    userData.picture = response.data.url;
                    deferred.resolve(userData.picture);

                });
            } else {
                console.log("User Not Signed In");
                deferred.reject("Sorry Bitch!!");
            }

            return deferred.promise;
        }

        factory.setUserData = function(userData) {

            var deferred = $q.defer();
            var currentUser = Parse.User.current();
            if (currentUser) {
                var image = new Image();
                //console.log(userData.picture);
                image.src = userData.picture;
                image.onload = function() {
                    var canvas = document.createElement("canvas");
                    canvas.width = image.width;
                    canvas.height = image.height;

                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0);

                    var newUserName = userData.name.split(" ");

                    var dataURL = canvas.toDataURL("image/png");
                    var parseFile = new Parse.File(newUserName[0], {
                        base64: dataURL
                    });

                    parseFile.save().then(function() {

                            var username = currentUser.get("username");
                            currentUser.set("user_id", username);
                            currentUser.set("username", newUserName[0] + userData.id);
                            currentUser.set("name", userData.name);
                            currentUser.set("email", userData.email);
                            currentUser.set("is_complete", false);
                            currentUser.set("gender", userData.gender);
                            currentUser.set("profile_image", parseFile);

                            currentUser.set("collections", []);
                            currentUser.set("stores_upvoted", []);
                            currentUser.set("collections_favorited", []);
                            currentUser.set("followers", []);
                            currentUser.set("users_followed", []);
                            currentUser.set("stores_followed", []);
                            currentUser.set("stores_reviewed", []);
                            currentUser.set("coupons_redeemed", []);
                            currentUser.set("coupons_claimed", []);
                            currentUser.set("review_ids", []);
                            currentUser.set("messages", []);
                            currentUser.set("is_store", false);
                            currentUser.save(null, {

                                success: function(user) {
                                    console.log("Added User Data");
                                    deferred.resolve(user);
                                },
                                error: function(error, message) {
                                    console.log(message);
                                    deferred.reject(message);
                                }
                            });
                        },
                        function(error, message) {
                            console.log(error);
                            deferred.reject(message);
                        });
                }
            } else {
                console.log("Not Logged In");
                deferred.reject("Not Logged In");
            }

            return deferred.promise;
        }

        factory.mailChimpListAddUser = function(user) {

            var deferred = $q.defer();

            Parse.Cloud.run('mailchimp', {
                userId: user.id,
            }, {
                success: function(result) {
                    console.log(result);
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        /* user Signup Ends Here */
        factory.createStoreRequest = function(storeDetails) {
            var deferred = $q.defer();

            var Request = Parse.Object.extend("Request");
            var requestObject = new Request();
            requestObject.set("name", storeDetails.ownerName);
            requestObject.set("business_name", storeDetails.storeName);
            requestObject.set("phone", storeDetails.phone);
            requestObject.set("city", storeDetails.city);
            requestObject.save(null, {
                success: function(request) {
                    deferred.resolve(request);
                },
                error: function(error, message) {
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        return factory;
    }


]);