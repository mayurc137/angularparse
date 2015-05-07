var parseServices = angular.module('parseServices', ['parse-angular']);

parseServices.service('storeLocalStorage', [

    function() {
        var storeData = null;

        var setStoreData = function(newData) {
            storeData = newData;
        }

        var getStoreData = function() {
            return storeData;
        }

        return {
            setStoreData: setStoreData,
            getStoreData: getStoreData
        };

    }
]);


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

        factory.shareToFb = function(url) {
            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.likes',
                action_properties: JSON.stringify({
                    object: url,
                })
            }, function(response) {});
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
                            currentUser.set("user_following", []);
                            currentUser.set("user_followed", []);
                            currentUser.set("stores_followed", []);
                            currentUser.set("coupons_redeemed", []);
                            currentUser.set("review_ids", []);
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
            query.include("products.gallery_ids");
            query.include('primary_category');
            query.include('collections');
            query.include('services');
            query.include("services.gallery_ids");
            query.include('followers');
            query.include('locality');
            query.include('upvoted_by');
            query.include('tags');
            query.include('review_ids');
            query.include('review_ids.user_id');

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

        factory.getCurrentUserCollections = function(currentUser) {
            var deferred = $q.defer();

            var collectionQuery = new Parse.Query("Collections");
            collectionQuery.equalTo('created_by', currentUser);
            collectionQuery.find({
                success: function(collections) {
                    deferred.resolve(collections);
                },
                error: function(error, message) {
                    deferred.resolve(message);
                }
            });

            return deferred.promise;
        }


        factory.fetchGalleryOfStore = function(store) {

            var deferred = $q.defer();
            var query = new Parse.Query("Gallery");
            query.equalTo("store_id", store);
            query.descending("createdAt");
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

        factory.getActivityByStore = function(store) {

            var deferred = $q.defer();

            var query = new Parse.Query("Activity");
            query.equalTo("store_id", store);
            query.include("comment_ids");
            query.include("comment_ids.user_id");
            query.include("user_id");
            query.include("coupon_id");
            query.include("product_id");
            query.include("service_id");
            query.include("liked_by");
            query.descending("createdAt");
            query.equalTo("is_visible", true);
            query.find({
                success: function(activities) {
                    deferred.resolve(activities);
                },
                error: function(error, message) {
                    deferred.reject(message);
                }
            });

            return deferred.promise;

        }

        factory.addReview = function(user, store, reviewText) {

            var deferred = $q.defer();

            var Review = new Parse.Object.extend("Review");
            var review = new Review();

            review.set("user_id", user);
            review.set("store_id", store);
            review.set("review", reviewText);

            review.save(null, {
                success: function(review) {
                    user.addUnique("review_ids", review);
                    user.addUnique("stores_reviewed", store.id);

                    user.save(null, {
                        success: function(user) {
                            store.addUnique("review_ids", review);
                            store.save(null, {
                                success: function(store) {
                                    var promise = reviewStoreActivity(user, review, store);
                                    promise.then(
                                        function(result) {
                                            console.log("Success");
                                            deferred.resolve(store);
                                        }, function(message) {
                                            console.log(message);
                                            deferred.resolve(store);
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
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;

        }

        factory.reviewStoreActivity = function(user, review, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            var text = "has reviewed ";

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("review_concerned", review);
            activity.set("activity_type", 6);
            activity.set("inline_content", text);
            activity.set("is_visible", true);
            activity.set("is_notification", true);
            activity.set("is_seen", false);

            activity.save(null, {
                success: function(object) {
                    console.log("Success Activity");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.followUser = function(usera, userb) {

            var deferred = $q.defer();

            Parse.Cloud.run('followUsers', {
                user1: usera.id,
                user2: userb.id
            }, {
                success: function(user2) {
                    var promise = followUserActivity(usera, userb);
                    promise.then(
                        function(result) {
                            console.log("Success");
                            deferred.resolve(user2);
                        }, function(message) {
                            console.log(message);
                            deferred.resolve(user2);
                        });
                },
                error: function(error, message) {
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.followUserActivity = function(usera, userb) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            var text = "is now following ";

            activity.set("user_id", usera);
            activity.set("user_concerned", userb);
            activity.set("activity_type", 1);
            activity.set("inline_content", text);
            activity.set("is_visible", true);
            activity.set("is_notification", true);
            activity.set("is_seen", false);

            activity.save(null, {
                success: function(object) {
                    console.log("Success Activity");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.unfollowUser = function(usera, userb) {

            var deferred = $q.defer();

            Parse.Cloud.run('unfollowUsers', {
                user1: usera.id,
                user2: userb.id
            }, {
                success: function(user2) {
                    if (user2) {
                        deferred.resolve(user2);
                    } else {
                        deferred.reject("Unable to follow");
                    }
                },
                error: function(error, message) {
                    deferred.reject(message);
                }
            });

            return deferred.promise;

        }

        factory.upvoteStore = function(store, user) {

            var deferred = $q.defer();

            store.addUnique("upvoted_by", user);
            store.save(null, {
                success: function(store) {
                    user.addUnique("stores_upvoted", store);
                    user.save(null, {
                        success: function(user) {
                            console.log("Success");
                            var promise = upvoteStoreActivity(user, activity);
                            promise.then(
                                function(result) {
                                    deferred.resolve(store);
                                }, function(message) {
                                    console.log(message);
                                    deferred.resolve(store);
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

        factory.upvoteStoreActivity = function(user, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            var text = "has upvoted ";

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("activity_type", 4);
            activity.set("inline_content", text);
            activity.set("is_visible", true);
            activity.set("is_notification", true);
            activity.set("is_seen", false);

            activity.save(null, {
                success: function(object) {
                    console.log("Success Activity");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.downvoteStore = function(store, user) {

            var deferred = $q.defer();

            store.remove("upvoted_by", user);
            store.save(null, {
                success: function(store) {
                    user.remove("stores_upvoted", store);
                    user.save(null, {
                        success: function(user) {
                            var promise = downvoteStoreActivity(user, store);
                            promise.then(
                                function(result) {
                                    deferred.resolve(store);
                                }, function(message) {
                                    console.log(message);
                                    deferred.resolve(store);
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

        factory.downvoteStoreActivity = function(user, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("activity_type", 5);
            activity.set("is_visible", false);
            activity.set("is_notification", false);
            activity.set("is_seen", false);

            activity.save(null, {
                success: function(object) {
                    console.log("Success Activity");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.followStore = function(store, user) {

            var deferred = $q.defer();

            store.addUnique("followers", user);
            store.save(null, {
                success: function(object) {
                    user.addUnique("stores_followed", store);
                    user.save(null, {
                        success: function(object) {
                            console.log("Success");
                            var promise = followStoreActivity(user, store);
                            promise.then(
                                function(result) {
                                    console.log("Success");
                                    deferred.resolve(store);
                                }, function(message) {
                                    console.log(message);
                                    deferred.resolve(store);
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
                    deferred.reject(message)
                }
            });

            return deferred.promise;
        }

        factory.followStoreActivity = function(user, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            var text = "is now following ";

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("activity_type", 2);
            activity.set("inline_content", text);
            activity.set("is_visible", true);
            activity.set("is_notification", true);
            activity.set("is_seen", false);

            activity.save(null, {
                success: function(object) {
                    console.log("Success Activity");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.unfollowStore = function(store, user) {

            var deferred = $q.defer();

            store.remove("followers", user);
            store.save(null, {
                success: function(object) {
                    user.remove("stores_followed", store);
                    user.save(null, {
                        success: function(object) {
                            var promise = unfollowStoreActivity(user, store);
                            promise.then(
                                function(result) {
                                    console.log("Success");
                                    deferred.resolve(store);
                                }, function(message) {
                                    console.log(message);
                                    deferred.resolve(store);
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

        factory.unfollowStoreActivity = function(user, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("activity_type", 3);
            activity.set("is_visible", false);
            activity.set("is_notification", false);
            activity.set("is_seen", false);

            activity.save(null, {
                success: function(object) {
                    console.log("Success Activity");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.createCollection = function(user, name, description) {

            var deferred = $q.defer();

            var Collection = Parse.Object.extend("Collections");
            var collection = new Collection();

            collection.set("collection_name", name);
            collection.set("description", description);
            collection.set("created_by", user);
            collection.save(null, {
                success: function(collection) {
                    console.log(user);
                    user.addUnique("collections", collection);
                    user.save(null, {
                        success: function(user) {
                            var promise = createCollectionActivity(user, collection);
                            promise.then(
                                function(result) {
                                    console.log("Success");
                                    deferred.resolve(collection);
                                }, function(message) {
                                    console.log(message);
                                    deferred.resolve(collection);
                                });
                            console.log("Added to user");
                        },
                        error: function(object, error) {
                            console.log(error);
                            deferred.reject(error);
                        }
                    });

                },
                error: function(error) {
                    console.log(error);
                    deferred.reject(error);
                }
            });

            return deferred.promise;
        }

        factory.createCollectionActivity = function(user, collection) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();


            activity.set("collection_concerned", collection);
            activity.set("user_id", user);
            activity.set("activity_likes", 0);
            activity.set("activity_type", 30)
            activity.set("inline_content", "added a new Collection ");
            activity.set("liked_by", []);
            activity.set("comment_ids", []);
            activity.set("is_visible", true);
            activity.set("is_notification", false);
            activity.set("is_seen", false);
            activity.save(null, {
                success: function(object) {
                    console.log("Added Coupon Post");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }


        factory.addProductToCollection = function(product, collection) {

            var deferred = $q.defer();

            collection.addUnique("product_ids", product);
            collection.save(null, {
                success: function(collection) {
                    product.addUnique("collections", collection);
                    product.save(null, {
                        success: function(product) {
                            var promise = productToCollectionActivity(collection.get("created_by"), product, product.get("store_id"), collection);
                            promise.then(
                                function(result) {
                                    console.log("Success");
                                    deferred.resolve(product);
                                }, function(message) {
                                    console.log(message);
                                    deferred.resolve(product);
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

        factory.productToCollectionActivity = function(user, product, store, collection) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("product_id", product);
            activity.set("collection_concerned", collection);
            activity.set("activity_type", 20);
            activity.set("is_visible", false);
            activity.set("is_notification", true);
            activity.set("is_seen", false);

            activity.save(null, {
                success: function(object) {
                    console.log("Success Activity");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.addServiceToCollection = function(service, collection) {

            var deferred = $q.defer();

            collection.addUnique("service_ids", service);
            collection.save(null, {
                success: function(collection) {
                    service.addUnique("collections", collection);
                    service.save(null, {
                        success: function(service) {
                            var promise = serviceToCollectionActivity(collection.get("created_by"), service, service.get("store_id"), collection);
                            promise.then(
                                function(result) {
                                    console.log("Success");
                                    deferred.resolve(service);
                                }, function(message) {
                                    console.log(message);
                                    deferred.resolve(service);
                                });
                        },
                        error: function(error, message) {
                            console.log(message);
                        }
                    });
                },
                error: function(error, message) {
                    console.log(message);
                }
            });

            return deferred.promise;
        }

        factory.serviceToCollectionActivity = function(user, service, store, collection) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("service_id", service);
            activity.set("collection_concerned", collection);
            activity.set("activity_type", 21);
            activity.set("is_visible", false);
            activity.set("is_notification", true);
            activity.set("is_seen", false);

            activity.save(null, {
                success: function(object) {
                    console.log("Success Activity");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.addStoreToCollection = function() {
            var deferred = $q.defer();

            collection.addUnique("store_ids", store);
            collection.save(null, {
                success: function(collection) {
                    store.addUnique("collections", collection);
                    store.save(null, {
                        success: function(store) {
                            var promise = storeToCollectionActivity(collection.get("created_by"), store, collection);
                            promise.then(
                                function(result) {
                                    console.log("Success");
                                    deferred.resolve(store);
                                }, function(message) {
                                    console.log(message);
                                    deferred.resolve(store);
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

        factory.storeToCollectionActivity = function(user, store, collection) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("collection_concerned", collection);
            activity.set("activity_type", 22);
            activity.set("is_visible", false);
            activity.set("is_notification", true);
            activity.set("is_seen", false);

            activity.save(null, {
                success: function(object) {
                    console.log("Success Activity");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.likeActivity = function(activity, store, user) {

            var deferred = $q.defer();

            activity.addUnique("liked_by", user);
            activity.increment("activity_likes");

            activity.save(null, {
                success: function(activity) {
                    var promise = likePostActivity(user, activity, store);
                    promise.then(
                        function(result) {
                            console.log("Success");
                            deferred.resolve(activity);
                        }, function(message) {
                            console.log(message);
                            deferred.resolve(activity);
                        });
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.likePostActivity = function(user, storeactivity, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            var text = "has liked this post";

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("activity_concerned", storeactivity);
            activity.set("activity_type", 10);
            activity.set("inline_content", text);
            activity.set("is_visible", true);
            activity.set("is_notification", true);
            activity.set("is_seen", false);

            activity.save(null, {
                success: function(object) {
                    console.log("Success Activity");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.dislikeActivity = function(activity, store, user) {

            var deferred = $q.defer();

            activity.remove("liked_by", user);
            activity.decrement("activity_likes");
            activity.save(null, {
                success: function(activity) {
                    var promise = dislikePostActivity(user, activity, store);
                    promise.then(
                        function(result) {
                            console.log("Success");
                            deferred.resolve(activity);
                        }, function(message) {
                            console.log(message);
                            deferred.resolve(activity);
                        }
                    );
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.dislikePostActivity = function(user, unlikeactivity, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("activity_concerned", unlikeactivity);
            activity.set("activity_type", 11);
            activity.set("is_visible", false);
            activity.set("is_notification", false);
            activity.set("is_seen", false);

            activity.save(null, {
                success: function(object) {
                    console.log("Success Activity");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.mailChimpListAdd = function(user) {
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

        return factory;

    }


]);