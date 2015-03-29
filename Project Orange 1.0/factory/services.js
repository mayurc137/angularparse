var parseServices = angular.module('parseServices', ['parse-angular']);

parseServices.service('storeLocalStorage', [

    function() {
        var storeData = null;

        var setStoreData = function(newData) {

        }

        var getStoreData = function() {
            return storeData;
        }

        return {
            setStoreData: setStoreData,
            getStoreData: getStoreData
        };

    }
])

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
                        console.log(user);
                        user.infoSet = false;
                        deferred.resolve(user);

                    } else {
                        console.log("User logged in through Facebook!");
                        console.log(user);
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

        factory.getUserData = function() {

            var deferred = $q.defer();
            var currentUser = Parse.User.current();
            var userData = {};
            if (currentUser) {
                FB.api("/me", function(response) {
                    userData.email = response.email;
                    userData.name = response.name;
                    userData.id = response.id;
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

                    userData.name = userData.name.split(" ");

                    var dataURL = canvas.toDataURL("image/png");
                    var parseFile = new Parse.File(userData.name[0], {
                        base64: dataURL
                    });

                    parseFile.save().then(function() {

                            var username = currentUser.get("username");
                            currentUser.set("user_id", username);
                            currentUser.set("username", userData.name[0] + userData.id)
                            currentUser.set("email", userData.email);
                            currentUser.set("is_complete", false);
                            currentUser.set("profile_image", parseFile);
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
        }



        //Set user Data
        factory.setUserProfile = function(userData) {

            var deferred = $q.defer();

            var user = Parse.User.current();
            user.set("username", userData.username);
            user.set("email", userData.email);
            user.set("website", userData.website);
            user.set("is_complete", true);
            user.set("description", userData.description);
            user.save(null, {

                success: function(user) {
                    console.log("Added User");
                    deferred.resolve(user);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.checkUsernameAvailablility = function(username) {

            var deferred = $q.defer();

            var query = new Parse.Query(Parse.User);
            query.equalTo("username", username);

            query.find({
                success: function(user) {
                    if (user.length == 0)
                        deferred.resolve(true);
                    else
                        deferred.resolve(false);
                },
                error: function(error, message) {
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }
        /* Functions for user Login and Sign Up End Here */

        factory.getStoreByHandle = function(handle) {

            var deferred = $q.defer();

            var query = new Parse.Query("Stores");
            query.equalTo('store_handle', handle);
            query.include('products');
            query.include('primary_category');
            query.include('collections');
            query.include('services');
            query.include('followers');
            query.include('locality');
            query.include('upvoted_by');
            query.include('tags');

            query.find({
                success: function(store) {
                    deferred.resolve(store[0]);
                },
                error: function(error, message) {
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        };

        factory.getCurrentUser = function() {
            var currentUser = Parse.User.current();
            return currentUser;
        }

        //For testing purposes only
        factory.getUser = function(userId) {

            var deferred = $q.defer();

            var query = new Parse.Query(Parse.User);
            query.equalTo("user_id", userId);

            query.find({
                success: function(user) {
                    // Syntax = user[0].get('name of column')
                    deferred.resolve(user[0]);
                },
                error: function(error, message) {
                    deferred.reject(message);
                }
            });

            return deferred.promise;

        }

        factory.fetchGalleryOfStore = function(storeId) {

            var deferred = $q.defer();
            var storequery = new Parse.Query("Stores");
            storequery.equalTo("objectId", storeId);
            var query = new Parse.Query("Gallery");
            query.matchesQuery("store_id", storequery);
            query.find({
                success: function(gallery) {

                    deferred.resolve(gallery);
                },
                error: function(error, message) {
                    console.log(error);
                    deferred.reject(message);
                }
            });
            return deferred.promise;

        }

        factory.addReview = function(user, store, reviewText) {

            var deferred = $q.defer();

            var Review = Parse.Object.extend("Reviews");
            var review = new Review();

            review.set("user_id", user);
            review.set("store_id", store);
            review.set("review", reviewText);

            review.save(null, {
                success: function(review) {
                    user.addUnique("review_ids", review);
                    user.save(null, {
                        success: function(user) {
                            store.addUnique("review_ids", review);
                            store.save(null, {
                                success: function(store) {
                                    console.log("Success");
                                    deferred.resolve(review);
                                },
                                error: function(error, message) {
                                    console.log(message);
                                    deferred.reject(message);
                                }
                            });
                        },
                        error: function(error, message) {
                            console.log(message);
                            deferred.reject(message);
                        }
                    });
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;

        }


        return factory;

    }


]);