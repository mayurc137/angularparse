var phonecatServices = angular.module('phonecatServices', ['parse-angular']);

phonecatServices.factory('Phone', ['$q',
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

        factory.shareToFb = function(user, store) {
            var url = "sampleUrl.html";
            FB.ui({
                method: 'share_open_graph',
                action_type: 'og.likes',
                action_properties: JSON.stringify({
                    object: 'http://refocustech.in/orange/store/',
                })
            }, function(response) {

                var promise = shareActivity(user, );
                promise.then(
                    function(result) {
                        console.log("Success");
                        deferred.resolve(activity);
                    }, function(message) {
                        console.log(message);
                        deferred.resolve(activity);
                    }
                );

            });
        }

        factory.fbLogin = function() {

            var deferred = $q.defer();

            Parse.FacebookUtils.logIn("email", {
                success: function(user) {
                    if (!user.existed()) {
                        alert("User signed up and logged in through Facebook!");
                        console.log(user);
                        user.infoSet = false;
                        deferred.resolve(user);

                    } else {
                        alert("User logged in through Facebook!");
                        console.log(user);
                        user.infoSet = true;
                        deferred.resolve(user);

                    }
                },
                error: function(user, error) {
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
                console.log("User Not Signed In");
                deferred.reject("Error Getting Data");
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
                    deferred.resolve(userData);

                });
            } else {
                console.log("User Not Signed In");
                deferred.reject("Error ");
            }

            return deferred.promise;
        }

        factory.setUserData = function(userData) {

            var deferred = $q.defer();
            var currentUser = Parse.User.current();
            if (currentUser) {



                var image = new Image();
                console.log(userData.picture);
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
                                    console.log("Added User");
                                    deferred.resolve(true);
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
            }
        }

        //Pass the userID
        factory.getUserDataParse = function(userId) {

            var deferred = $q.defer();

            var query = new Parse.Query(Parse.User);
            query.equalTo("user_id", userId);
            query.include("collections");
            query.include("collections.store_ids");
            query.include("collections.product_ids");
            query.find({
                success: function(user) {
                    // Syntax = user[0].get('name of column')
                    console.log(user);
                    deferred.resolve(user);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;

        }

        //Set user Data

        factory.setUserDataParse = function(userData) {

            var deferred = $q.defer();

            var user = Parse.User.current();
            user.set("username", userData.username);
            user.set("email", userData.email);
            user.set("website", userData.website);
            user.set("is_complete", true);
            user.set("description", userData.description);
            user.set("no_stores_upvoted", 0);
            user.save(null, {

                success: function(user) {
                    console.log("Added User");
                    deferred.resolve(true);
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

        factory.checkStoreHandleAvailablility = function(storeHandle) {

            var deferred = $q.defer();

            var query = new Parse.Query("Stores");
            query.equalTo("store_handle", storeHandle);

            query.find({
                success: function(store) {
                    if (store.length == 0)
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

        factory.checkStoreOwnerEmailAvailablility = function(email) {

            var deferred = $q.defer();

            var query = new Parse.Query(Parse.User);
            query.equalTo("email", email);

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


        factory.storeReg = function(userDetails) {

            var deferred = $q.defer();

            function storeReg(userDetails) {

                Parse.Cloud.run('storeSignUp', {
                    userDetails: userDetails
                }, {
                    success: function(result) {
                        console.log(result);
                        deferred.resolve(result);
                    },
                    error: function(error) {
                        console.log(error);
                        deferred.reject(error);
                    }
                });
            }

            return deferred.promise;
        }

        factory.storeLogin = function(email, password) {

            var deferred = $q.defer();

            Parse.User.logIn(email, password, {
                success: function(user) {
                    var query = new Parse.Query("Stores");
                    var storeId = user.get("store_id").id;

                    query.get(storeId, {
                        success: function(store) {
                            console.log(store);
                            deferred.resolve(store);
                        },
                        error: function(error, message) {
                            console.log(message);
                            deferred.reject(message);
                        }
                    });
                },
                error: function(error, message) {
                    console.log(message);
                }
            });

            return deferred.promise;
        }

        //Pass the storeID
        factory.getStoreDataByStoreId = function(storeid) {

            var deferred = $q.defer();

            var query = new Parse.Query("Stores");
            query.equalTo("objectId", storeid);
            query.include("products");
            query.include("products.gallery_ids");
            query.include("primary_category");
            query.include("collections");
            query.include("services");
            query.include("services.gallery_ids");
            query.include("followers");
            query.include("locality");
            query.include("upvoted_by");
            query.include("tags");
            query.include('review_ids');
            query.include('review_ids.user_id');
            query.find({
                success: function(store) {
                    console.log(store);
                    deferred.resolve(store);
                },
                error: function(error, message) {
                    console.log(error);
                    deferred.reject(message);
                }

            });

            return deferred.promise;
        }

        //Pass the userID
        factory.getStoreDataByStoreHandle = function(handle) {

            var deferred = $q.defer();

            var query = new Parse.Query("Stores");
            query.equalTo("store_handle", handle);
            query.include("products");
            query.include("products.gallery_ids");
            query.include("primary_category");
            query.include("collections");
            query.include("services");
            query.include("services.gallery_ids");
            query.include("followers");
            query.include("locality");
            query.include("upvoted_by");
            query.include("tags");
            query.include('review_ids');
            query.include('review_ids.user_id');
            query.find({
                success: function(store) {
                    console.log(store);
                    deferred.resolve(store);
                },
                error: function(error, message) {
                    console.log(error);
                    deferred.reject(message);
                }

            });
            return deferred.promise;
        }

        factory.getNearestStores = function(locality) {

            var deferred = $q.defer();

            var query = new Parse.Query("Stores");
            query.near("geolocation", locality);

            query.find({
                success: function(localityArray) {
                    console.log(localityArray);
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise
        }

        factory.changeLocality = function(storeId, lat, lon) {

            var deferred = $q.defer();

            var point = new Parse.GeoPoint({
                latitude: lat,
                longitude: lon
            });

            var query = new Parse.Query("Locality");
            query.near("location", point);
            query.limit(2);

            query.find({
                success: function(locality) {
                    var location = locality[0];
                    console.log(location);
                    var storequery = new Parse.Query("Stores");
                    storequery.get(storeId, {
                        success: function(store) {
                            store.set("locality", location);
                            store.set("geolocation", point);
                            store.save(null, {
                                success: function(object) {
                                    console.log("Success");
                                    deferred.resolve(true);
                                },
                                error: function(error, message) {
                                    console.log(message);
                                    deferred.reject(message);
                                }
                            })
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

        //Pass the storeID
        factory.fetchGalleryOfStore = function(store) {

            var deferred = $q.defer();
            var query = new Parse.Query("Gallery");
            query.equalTo("store_id", store);
            query.find({
                success: function(gallery) {
                    console.log(gallery);
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(error);
                    deferred.reject(message);
                }
            });
            return deferred.promise;

        }

        //Pass Store id and images from file selector
        factory.addStoreImageToGallery = function(store, image) {

            var deferred = $q.defer();

            var Gallery = Parse.Object.extend("Gallery");
            var picture = new Gallery();
            if (image.files.length > 0) {
                var file = image.files[0];
                var parseFile = new Parse.File(file.name, file);

                parseFile.save().then(function() {
                    console.log("Saved");
                    picture.set("image", parseFile);
                    picture.set("store_id", store);
                    picture.save(null, {

                        success: function(picture) {
                            console.log("Added to Database");
                            deferred.resolve(true);
                        },
                        error: function(error, message) {
                            console.log("Error in adding to Database");
                            deferred.reject(message);
                        }
                    });
                }, function(error, message) {
                    console.log(error);
                    deferred.reject(message);
                });
            }

            return deferred.promise;
        }

        //Pass product ID and the images from file selector
        factory.addProductImageToGallery = function(product, image) {

            var deferred = $q.defer();

            var Gallery = Parse.Object.extend("Gallery");
            var picture = new Gallery();
            if (image.files.length > 0) {
                var file = image.files[0];
                var parseFile = new Parse.File(file.name, file);

                parseFile.save().then(function() {
                    console.log("Saved");
                    picture.set("image", parseFile);
                    picture.set("product_id", product);
                    picture.save(null, {

                        success: function(picture) {
                            console.log("Added to Database");
                            deferred.resolve(true);
                        },
                        error: function(error, message) {
                            console.log("Error in adding to Database");
                            deferred.reject(message);
                        }
                    });
                }, function(error, message) {
                    console.log(error);
                    deferred.reject(message);
                });
            }
            return deferred.promise;

        }


        factory.addServiceImageToGallery = function(service, image) {

            var deferred = $q.defer();

            var Gallery = Parse.Object.extend("Gallery");
            var picture = new Gallery();
            if (image.files.length > 0) {
                var file = image.files[0];
                var parseFile = new Parse.File(file.name, file);

                parseFile.save().then(function() {
                    console.log("Saved");
                    picture.set("image", parseFile);
                    picture.set("service_id", service);
                    picture.save(null, {

                        success: function(picture) {
                            console.log("Added to Database");
                            deferred.resolve(true);
                        },
                        error: function(error, message) {
                            console.log("Error in adding to Database");
                            deferred.reject(message);
                        }
                    });
                }, function(error, message) {
                    console.log(error);
                    deferred.reject(message);
                });
            }

            return deferred.promise;

        }

        factory.removeStoreImageFromGallery = function(store, image) {

            var deferred = $q.defer();

            if (image.get("store_id") == store.id) {
                image.destroy({
                    success: function(image) {
                        console.log(image);
                        deferred.resolve(true);
                    },
                    error: function(error, message) {
                        console.log(message);
                        deferred.reject(message);
                    }
                });
            }

            return deferred.promise;
        }

        factory.removeProductImageFromGallery = function(product, image) {

            var deferred = $q.defer();

            if (image.get("product_id") == product.id) {
                product.remove("gallery_ids", image);
                product.save(null, {
                    success: function(object) {
                        image.destroy({
                            success: function(image) {
                                console.log(image);
                                deferred.resolve(true);
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
            }

            return deferred.promise;

        }

        factory.removeServiceImageFromGallery = function(service, image) {

            var deferred = $q.defer();

            if (image.get("service_id") == service.id) {
                service.remove("gallery_ids", image);
                service.save(null, {
                    success: function(object) {
                        image.destroy({
                            success: function(image) {
                                console.log(image);
                                deferred.resolve(true);
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
            }
            return deferred.promise;

        }

        //Pass the userId and the commentText
        //StoreID / CollectionID needs to be added
        factory.addUserComment = function(activity, user, comment) {

            var deferred = $q.defer();

            var Comment = Parse.Object.extend("Comments");
            var commentobject = new Comment();
            commentobject.set("user_id", user);
            commentobject.set("first_level_comment", comment);
            commentobject.set("activity_id", activity);
            commentobject.set("store_id", activity.get("store_id"));
            commentobject.save(null, {
                success: function(comment) {
                    activity.addUnique("comment_ids", comment);
                    activity.increment("engage_count");
                    activity.save(null, {
                        success: function(activity) {
                            var promise = commentActivity(user, activity, activity.get("store_id"));
                            promise.then(
                                function(newActivity) {
                                    deferred.resolve(activity);
                                }, function(message) {
                                    console.log(message)
                                    deferred.resolve(activity);
                                }
                            );
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

        factory.commentActivity = function(user, storeactivity, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            var text = "has commented on this post ";

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("activity_concerned", storeactivity);
            activity.set("activity_type", 12);
            activity.set("inline_content", text);
            activity.set("is_visible", true);
            activity.set("is_notification", true);
            activity.set("is_seen", false);

            activity.save(null, {
                success: function(activity) {
                    console.log("Success Activity");
                    deferred.resolve(activity);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.resolve(message);
                }
            });

            return deferred.promise;
        }


        function addStoreComment(comment, store_comment) {

            var deferred = $q.defer();

            comment.set("second_level_comment", store_comment);
            comment.save(null, {
                success: function(comment) {
                    //Add notification to User
                    console.log("Success");
                    var promise = commentReplyActivity(comment.get("store_id"), comment.get("activity_id"), comment.get("user_id"));
                    promise.then(
                        function(result) {
                            deferred.resolve(comment);
                        }, function(message) {
                            console.log(message);
                            deferred.resolve(comment);
                        });
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });
            return deferred.promise;

        }

        factory.commentReplyActivity = function(store, storeactivity, user) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();


            activity.set("store_id", store);
            activity.set("activity_concerned", storeactivity);
            activity.set("user_concerned", user);
            activity.set("activity_likes", 0);
            activity.set("activity_type", 29)
            activity.set("liked_by", []);
            activity.set("comment_ids", []);
            activity.set("is_visible", false);
            activity.set("is_notification", true);
            activity.set("inline_content", "has replied to your comment");
            activity.set("is_seen", false);
            activity.save(null, {
                success: function(object) {
                    console.log("Added Comment Reply Post");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        //Done
        factory.createStore = function(storeDetails) {

            var deferred = $q.defer();

            var Store = Parse.Object.extend("Stores");
            var store = new Store();
            var point = new Parse.GeoPoint({
                latitude: parseFloat(storeDetails.latitude),
                longitude: parseFloat(storeDetails.longitude)
            });

            store.set("address", storeDetails.address);
            store.set("description", storeDetails.description);
            store.set("email", storeDetails.email);
            store.set("end_time", storeDetails.endTime);
            store.set("facebook_link", storeDetails.facebook_link);
            store.set("geolocation", point);
            store.set("locality", storeDetails.locality);
            store.set("major_sale", storeDetails.majorSale);
            store.set("name", storeDetails.name);
            store.set("online_store_link", storeDetails.onlineStore);
            store.addUnique("phone", storeDetails.primaryPhone);
            store.addUnique("phone", storeDetails.secPhone);
            store.set("primary_category", storeDetails.selectedCategory);
            store.addUnique("payment_type", storeDetails.selectedPayment);
            store.set("tags", storeDetails.selectedTags);
            store.set("start_time", storeDetails.startTime);
            store.set("store_handle", storeDetails.storeHandle);
            store.set("twitter_link", storeDetails.twitterLink);
            store.set("website_link", storeDetails.website);
            store.set("working_days", storeDetails.workingDays);

            store.set("followers", []);
            store.set("products", []);
            store.set("services", []);
            store.set("upvoted_by", []);
            store.set("collections", []);
            store.set("review_ids", []);

            var logofile = storeDetails.logoImage;
            var parseFile2 = new Parse.File(logofile.name, logofile);
            parseFile2.save().then(
                function() {

                    store.set("logo", parseFile2);

                    if (storeDetails.bannerImage != null) {

                        var file = storeDetails.bannerImage;
                        var parseFile = new Parse.File(file.name, file);
                        parseFile.save().then(function() {
                            store.set("banner_image", parseFile);
                            store.save(null, {
                                success: function(store) {
                                    console.log(store);
                                    deferred.resolve(store);
                                },
                                error: function(error, message) {
                                    console.log(message);
                                    deferred.reject(message);
                                }
                            });
                        }, function(error) {
                            console.log(error);
                            deferred.reject(error);
                        });

                    } else {

                        store.save(null, {
                            success: function(store) {
                                console.log(store);
                                deferred.resolve(store);
                            },
                            error: function(error, message) {
                                console.log(message);
                                deferred.reject(message);
                            }
                        });

                    }
                }, function(error) {
                    console.log(error);
                    deferred.reject(error);
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

        function upvoteStoreActivity(user, store) {

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
                    console.log("Success");
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

        //done
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
                            console.log("Success");
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

        //Pass the store id and an object with all the store details
        factory.addDetailsToStore = function(store, storeDetails, category, tags) {

            var deferred = $q.defer();

            if (storeDetails.logo.files.length > 0) {

                var logo = storeDetails.logo.files[0];
                var parseFile = new Parse.File(logo.name, logo);
                parseFile.save().then(function() {

                    store.set("address", storeDetails.address);
                    store.set("description", storeDetails.description);
                    store.set("email", storeDetails.email);
                    store.set("logo", parseFile);
                    store.set("name", storeDetails.name);
                    store.addUnique("phone", storeDetails.phone);
                    store.set("store_handle", storeDetails.store_handle);
                    store.set("website_link", storeDetails.website_link);
                    store.set("primary_category", category);
                    store.set("twitter_link", storeDetails.twitter_link);
                    store.set("facebook_link", storeDetails.facebook_link);
                    store.set("tags", tags);
                    store.set("start_time", storeDetails.start_time);
                    store.set("end_time", storeDetails.end_time);
                    store.set("working_days", storeDetails.working_days);
                    store.addUnique("payment_type", storeDetails.payment_type);
                    store.set("online_store_link", storeDetails.online_store_link);
                    store.set("contact_email", storeDetails.contact_email);

                    store.save(null, {
                        success: function(store) {
                            console.log(object);
                            deferred.resolve(store);
                        },
                        error: function(error, message) {
                            console.log(message);
                            deferred.reject(message);
                        }
                    });
                }, function(error) {
                    console.log(error);
                });

            } else {
                console.log("No logo uploaded");
                deferred.reject("No logo Image");
            }

            return deferred.promise;
        }

        factory.editStoreOwner = function(user, ownerDetails) {

            var deferred = $q.defer();

            Parse.Cloud.run('editStoreOwner', {
                user: user.id,
                ownerDetails: ownerDetails
            }, {
                success: function(result) {
                    console.log(result);
                    deferred.resolve(object);;
                },
                error: function(error) {
                    console.log(error);
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
                success: function(result) {
                    if (result) {
                        deferred.resolve(true);
                    } else {
                        deferred.reject(false);
                    }
                },
                error: function(error, message) {
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.addService = function(store, serviceDetails) {

            var deferred = $q.defer();

            if (serviceDetails.image.files.length > 0) {

                var picture = serviceDetails.image.files[0];
                var parseFile = new Parse.File(picture.name, picture);
                parseFile.save().then(function() {
                    var Service = Parse.Object.extend("Services");
                    var service = new Service();
                    service.set("cprice", serviceDetails.cprice);
                    service.set("description", serviceDetails.description);
                    service.set("image", parseFile);
                    service.set("is_sale", serviceDetails.is_sale);
                    service.set("is_visible", serviceDetails.is_visible);
                    service.set("name", serviceDetails.name);
                    service.set("sprice", serviceDetails.sprice);
                    service.set("store_id", store);

                    service.save(null, {
                        success: function(service) {
                            console.log("Added To services");
                            store.addUnique("services", service);
                            store.save(null, {
                                success: function(store) {
                                    console.log("Added to Store");
                                    var promise = createServicePost(store, service);
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
                });

            } else {
                var Service = Parse.Object.extend("Services");
                var service = new Service();
                service.set("cprice", serviceDetails.cprice);
                service.set("description", serviceDetails.description);
                service.set("is_sale", serviceDetails.is_sale);
                service.set("is_visible", serviceDetails.is_visible);
                service.set("name", serviceDetails.name);
                service.set("sprice", serviceDetails.sprice);
                service.set("store_id", store);

                service.save(null, {
                    success: function(service) {
                        console.log("Added To services");
                        store.addUnique("services", service);
                        store.save(null, {
                            success: function(store) {
                                var promise = createServicePost(store, service);
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
            }

            return deferred.promise();
        }

        factory.createServicePost = function(store, service) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();


            activity.set("store_id", store);
            activity.set("service_id", service);
            activity.set("activity_type", 25);
            activity.set("inline_content", "added a new Service");
            activity.set("activity_likes", 0);
            activity.set("liked_by", []);
            activity.set("comment_ids", []);
            activity.set("activity_image", service.get("image"));
            activity.set("is_visible", true);
            activity.set("is_notification", false);
            activity.set("is_seen", false);
            activity.save(null, {
                success: function(object) {
                    console.log("Added Service Post");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        //pass the product object with the product details
        factory.addProduct = function(store, productDetails) {

            var deferred = $q.defer();

            if (productDetails.image.files.length > 0) {

                var picture = productDetails.image.files[0];
                var parseFile = new Parse.File(picture.name, picture);
                parseFile.save().then(function() {
                    var Product = Parse.Object.extend("Products");
                    var product = new Product();
                    product.set("cprice", productDetails.cprice);
                    product.set("description", productDetails.description);
                    product.set("image", parseFile);
                    product.set("is_sale", productDetails.is_sale);
                    product.set("is_visible", productDetails.is_visible);
                    product.set("name", productDetails.name);
                    product.set("sprice", productDetails.sprice);
                    product.set("store_id", store);

                    product.save(null, {
                        success: function(product) {
                            console.log(object);
                            store.addUnique("products", object);
                            store.save(null, {
                                success: function(store) {
                                    var promise = createProductPost(store, product);
                                    promise.then(
                                        function(result) {
                                            console.log("Success");
                                            deferred.resolve(store);
                                        }, function(message) {
                                            console.log(message);
                                            deferred.resolve(store);
                                        });
                                    console.log("Added to Store");
                                },
                                error: function(error, message) {
                                    console.log(message);
                                    deferred.reject(message);
                                }
                            });

                        },
                        error: function(error, message) {
                            console.log(error);
                            deferred.reject(message);
                        }
                    });
                });

            } else {
                var Product = Parse.Object.extend("Products");
                var product = new Product();
                product.set("cprice", productDetails.cprice);
                product.set("description", productDetails.description);
                product.set("image", parseFile);
                product.set("is_sale", productDetails.is_sale);
                product.set("is_visible", productDetails.is_visible);
                product.set("name", productDetails.name);
                product.set("sprice", productDetails.sprice);
                product.set("store_id", store);

                product.save(null, {
                    success: function(product) {
                        store.addUnique("products", product);
                        store.save(null, {
                            success: function(store) {
                                var promise = createProductPost(store, product);
                                promise.then(
                                    function(result) {
                                        console.log("Success");
                                        deferred.resolve(store);
                                    }, function(message) {
                                        console.log(message);
                                        deferred.resolve(store);
                                    });
                                console.log("Added to Store");
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
            }

            return deferred.promise;
        }

        //Pass the product details as an object which should include the product id
        factory.editProduct = function(product, productDetails) {

            var deferred = $q.defer();

            if (productDetails.image.files.length > 0) {

                var picture = productDetails.image.files[0];
                var parseFile = new Parse.File(picture.name, picture);
                parseFile.save().then(function() {
                    product.set("cprice", productDetails.cprice);
                    product.set("description", productDetails.description);
                    product.set("image", parseFile);
                    product.set("is_sale", productDetails.is_sale);
                    product.set("is_visible", productDetails.is_visible);
                    product.set("name", productDetails.name);
                    product.set("sprice", productDetails.sprice);
                    product.set("store_id", store);

                    product.save(null, {
                        success: function(object) {
                            console.log(object);
                            deferred.resolve(true);
                        },
                        error: function(error, message) {
                            console.log(message);
                            deferred.reject(message);
                        }
                    });
                });

            } else {

                product.set("cprice", productDetails.cprice);
                product.set("description", productDetails.description);
                product.set("is_sale", productDetails.is_sale);
                product.set("is_visible", productDetails.is_visible);
                product.set("name", productDetails.name);
                product.set("sprice", productDetails.sprice);
                product.set("store_id", store);

                product.save(null, {
                    success: function(object) {
                        console.log(object);
                        deferred.resolve(true);
                    },
                    error: function(error, message) {
                        console.log(message);
                        deferred.reject(message);
                    }
                });

            }

            return deferred.promise;
        }

        factory.deleteProduct = function(store, product) {

            var deferred = $q.defer();

            store.remove("products", product);
            store.save(null, {
                success: function(store) {
                    product.destroy({
                        success: function(product) {
                            console.log("Deleted");
                            deferred.resolve(product);
                        },
                        error: function(error, message) {
                            console.log(message);
                            deferred.reject(message);
                        }
                    });
                },
                error: function(error, message) {
                    console.log(message);
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

        //pass productId and CollectionID
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

        //pass the store Id and the collection ID
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

        factory.deleteProductFromCollection = function(product, collection) {

            var deferred = $q.defer();

            collection.remove("product_ids", product);
            collection.save(null, {
                success: function(object) {
                    console.log("Remove Product");
                    product.remove("collections", collection);
                    product.save(null, {
                        success: function(object) {
                            console.log("Removed From Collection");
                            deferred.resolve(true);
                        },
                        error: function(error, message) {
                            console.log(message);
                            deferred.reject(message);
                        }
                    });
                },
                error: function(error, message) {
                    console.log(message);
                }
            });

            return deferred.promise;
        }

        factory.deleteServiceFromCollection = function(service, collection) {

            var deferred = $q.defer();

            collection.remove("service_ids", service);
            collection.save(null, {
                success: function(object) {
                    console.log("Removed Service");
                    service.remove("collections", collection);
                    service.save(null, {
                        success: function(object) {
                            console.log("Removed From Collection");
                            deferred.resolve(true);
                        },
                        error: function(error, message) {
                            console.log(message);
                            deferred.reject(message);
                        }
                    });
                },
                error: function(error, message) {
                    console.log(message);
                }
            });

            return deferred.promise;
        }

        factory.deleteStoreFromCollection = function(store, collection) {

            var deferred = $q.defer();

            collection.remove("store_ids", store);
            collection.save(null, {
                success: function(object) {
                    console.log("Removed Store");
                    store.remove("collections", collection);
                    store.save(null, {
                        success: function(object) {
                            console.log("Removed from Collection");
                            deferred.resolve(true);
                        },
                        error: function(error, message) {
                            console.log(message);
                            deferred.reject(message);
                        }
                    });
                },
                error: function(error, message) {
                    console.log(message);
                }
            });

            return deferred.promise;
        }

        factory.favoriteCollection = function(collection, user) {

            var deferred = $q.defer();

            collection.addUnique("favorited_by", user);
            collection.save(null, {
                success: function(collection) {
                    user.addUnique("collections_favorited", collection);
                    user.save(null, {
                        success: function(user) {
                            console.log("Success");
                            var promise = favoriteCollectionActivity(user, collection.get("created_by"), collection);
                            promise.then(
                                function(result) {
                                    console.log("Success");
                                    deferred.resolve(collection);
                                }, function(message) {
                                    console.log(message);
                                    deferred.resolve(collection);
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

        factory.favoriteCollectionActivity = function(usera, userb, collection) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            var text = "has favorited collection ";

            activity.set("user_id", usera);
            activity.set("user_concerned", userb);
            activity.set("collection_concerned", collection);
            activity.set("activity_type", 9);
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

        factory.addReview = function(user, store, text) {

            var deferred = $q.defer();


            var Review = new Parse.Object.extend("Reviews");
            var review = new Review();

            review.set("user_id", user);
            review.set("store_id", store);
            review.set("review", text);

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
                                    console.log("Success");
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

        factory.replyReview = function(review, reply) {

            var deferred = $q.defer();

            review.set("review_reply", reply);
            review.save(null, {
                success: function(review) {
                    console.log("Added reply");
                    var promise = reviewReplyActivity(review.get("store_id"), review, review.get("user_id"));
                    promise.then(
                        function(result) {
                            console.log("Success");
                            deferred.resolve(review);
                        }, function(message) {
                            console.log(message);
                            deferred.resolve(review);
                        });
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.reviewReplyActivity = function(store, review, user) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("store_id", store);
            activity.set("review_concerned", review);
            activity.set("user_concerned", user);
            activity.set("activity_likes", 0);
            activity.set("activity_type", 28)
            activity.set("liked_by", []);
            activity.set("comment_ids", []);
            activity.set("is_visible", false);
            activity.set("is_notification", true);
            activity.set("is_seen", false);
            activity.set("inline_content", "has replied to your review");

            activity.save(null, {
                success: function(object) {
                    console.log("Added Review Reply Post");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }
        //check for visibility

        factory.getActivityByStore = function(store) {

            var deferred = $q.defer();

            var query = new Parse.Query("Activity");
            query.equalTo("store_id", store);
            query.include("comment_ids");
            query.include("coupon_id");
            query.include("product_id");
            query.include("service_id");
            query.include("liked_by");
            query.descending("createdAt");
            query.equalTo("is_visible", true);
            query.find({
                success: function(activity) {
                    console.log(activity);
                },
                error: function(error, message) {
                    console.log(message);
                }
            });

            return deferred.promise;
        }

        //check for visibility
        factory.getGeneralActivityByStore = function(store) {

            var deferred = $q.defer();

            var query = new Parse.Query("Activity");
            query.equalTo("store_id", store);
            query.equalTo("activity_type", 23);
            query.descending("createdAt");
            query.equalTo("is_visible", true);
            query.include("comment_ids");
            query.include("user_id");
            query.include("coupon_id");
            query.include("product_id");
            query.include("service_id");
            query.include("liked_by");
            query.find({
                success: function(activity) {
                    console.log(activity);
                    deferred.resolve(activity);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        function getActivityForUser(user) {

            var deferred = $q.defer();

            var stores_followed = user.get("stores_followed");
            var user_followed = user.get("user_followed");

            var storequery = new Parse.Query("Activity");
            storequery.containedIn("store_id", stores_followed);
            storequery.equalTo("is_visible", true);

            var userquery = new Parse.Query("Activity");
            userquery.containedIn("user_id", user_followed);
            userquery.equalTo("is_visible", true);

            var mainquery = Parse.Query.or(storequery, userquery);
            mainquery.descending("createdAt");
            mainquery.find({
                success: function(activity) {
                    console.log(activity);
                    deferred.resolve(activity);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.addCoupons = function(store, couponDetails) {

            var deferred = $q.defer();

            var Coupon = Parse.Object.extend("Coupons");
            var coupon = new Coupon();

            coupon.set("coupon_name", couponDetails.coupon_name);
            coupon.set("coupon_description", couponDetails.coupon_description);
            coupon.set("store_id", store);
            coupon.set("redemption_limit", couponDetails.redemption_limit);
            coupon.set("claim_limit", couponDetails.redemption_limit);
            coupon.set("user_claimed_ids", []);
            coupon.set("user_redeemed_ids", []);
            coupon.set("expiry_date", couponDetails.expiry_date);
            coupon.set("start_date", couponDetails.start_date);
            coupon.set("active", true);
            coupon.set("coupon_category", couponDetails.category);


            coupon.save(null, {
                success: function(coupon) {
                    console.log("Success");
                    var promise = createCouponPost(store, coupon);
                    promise.then(
                        function(result) {
                            console.log("Success");
                            deferred.resolve(coupon);
                        }, function(message) {
                            console.log(message);
                            deferred.resolve(coupon);
                        });
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.createCouponPost = function(store, coupon) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("store_id", store);
            activity.set("coupon_id", coupon);
            activity.set("activity_likes", 0);
            activity.set("activity_type", 27);
            activity.set("inline_content", "added a new Coupon ");
            activity.set("liked_by", []);
            activity.set("comment_ids", []);
            activity.set("is_visible", true);
            activity.set("is_notification", true);
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

        factory.getCouponsByStore = function(store) {

            var deferred = $q.defer();

            var query = new Parse.Query("Coupons");
            query.equalTo("store_id", store);
            query.equalTo("active", true);
            query.descending("createdAt");

            query.find({
                success: function(coupons) {
                    console.log(coupons);
                },
                error: function(error, message) {
                    console.log(message);
                }
            });

            return deferred.promise;
        }

        factory.claimCoupon = function(user, coupon) {

            var deferred = $q.defer();

            if (coupon.get("redemption_limit") == undefined) {
                coupon.addUnique("user_claimed_ids", user);
                coupon.save(null, {
                    success: function(coupon) {
                        user.addUnique("coupons_claimed", coupon);
                        user.save(null, {
                            success: function(user) {
                                var promise = claimCouponActivity(user, coupon, coupon.get("store_id"));
                                promise.then(
                                    function(result) {
                                        console.log("Success");
                                        deferred.resolve(coupon);
                                    }, function(message) {
                                        console.log(message);
                                        deferred.resolve(coupon);
                                    });
                                console.log("Success");
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
            } else if (coupon.get("redemption_limit") > coupon.get("user_claimed_ids").length) {
                coupon.addUnique("user_claimed_ids", user);
                if (coupon.get("redemption_limit") == coupon.get("user_claimed_ids").length) {
                    coupon.set("active", false);
                }
                coupon.save(null, {
                    success: function(coupon) {
                        console.log("Coupon Save success");

                        user.addUnique("coupons_claimed", coupon);
                        user.save(null, {
                            success: function(user) {
                                console.log("User Save success");

                                var promise = claimCouponActivity(user, coupon, coupon.get("store_id"));
                                promise.then(
                                    function(result) {
                                        console.log("Success");
                                        deferred.resolve(coupon);
                                    }, function(message) {
                                        console.log(message);
                                        deferred.resolve(coupon);
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
            }

            return deferred.promise;
        }

        function claimCouponActivity(user, coupon, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            var text = "has claimed coupon ";

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("coupon_id", coupon);
            activity.set("activity_type", 7);
            activity.set("inline_content", text);
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
            activity.increment("engage_count");

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
            activity.increment("activity_likes", -1);
            activity.increment("engage_count");

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

        factory.createGeneralPost = function(store, activityDetails) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            if (activityDetails.image.files.length > 0) {
                var picture = activityDetails.image.files[0];
                var parseFile = new Parse.File(picture.name, picture);
                parseFile.save().then(function() {

                    activity.set("store_id", store);
                    activity.set("activity_type", 26);
                    activity.set("activity_title", activityDetails.title);
                    activity.set("activity_content", activityDetails.content);
                    activity.set("activity_image", parseFile);
                    activity.set("activity_likes", 0);
                    activity.set("liked_by", []);
                    activity.set("comment_ids", []);
                    activity.set("is_visible", true);
                    activity.set("is_notification", false);
                    activity.set("is_seen", false);
                    activity.set("engage_count", 0);

                    activity.save(null, {
                        success: function(object) {
                            console.log("Added General Post");
                            deferred.resolve(object);
                        },
                        error: function(error, message) {
                            console.log(message);
                            deferred.reject(message);
                        }
                    });

                });
            } else {
                activity.set("store_id", store);
                activity.set("activity_type", 26);
                activity.set("activity_title", activityDetails.title);
                activity.set("activity_content", activityDetails.content);
                activity.set("activity_likes", 0);
                activity.set("liked_by", []);
                activity.set("comment_ids", []);
                activity.set("is_visible", true);
                activity.set("is_notification", false);
                activity.set("is_seen", false);
                activity.set("engage_count", 0);

                activity.save(null, {
                    success: function(object) {
                        console.log("Added General Post");
                        deferred.resolve(object);
                    },
                    error: function(error, message) {
                        console.log(message);
                        deferred.reject(message);
                    }
                });
            }

            return deferred.promise;

        }



        factory.createProductPost = function(store, product) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();


            activity.set("store_id", store);
            activity.set("product_id", product);
            activity.set("activity_type", 24);
            activity.set("inline_content", "added a new Product ");
            activity.set("activity_likes", 0);
            activity.set("liked_by", []);
            activity.set("comment_ids", []);
            activity.set("activity_image", product.get("image"));
            activity.set("is_visible", true);
            activity.set("is_notification", false);
            activity.set("is_seen", false);
            activity.save(null, {
                success: function(object) {
                    console.log("Added Product Post");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;

        }


        factory.createServicePost = function(store, service) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("store_id", store);
            activity.set("service_id", service);
            activity.set("activity_type", 25);
            activity.set("inline_content", "added a new Service");
            activity.set("activity_likes", 0);
            activity.set("liked_by", []);
            activity.set("comment_ids", []);
            activity.set("activity_image", service.get("image"));
            activity.set("is_visible", true);
            activity.set("is_notification", false);
            activity.set("is_seen", false);
            activity.save(null, {
                success: function(object) {
                    console.log("Added Service Post");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.createGalleryPost = function(store, gallery_count) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("store_id", store);
            activity.set("inline_content", "has added " + gallery_count + " photos to their Gallery");
            activity.set("activity_likes", 0);
            activity.set("activity_type", 26)
            activity.set("liked_by", []);
            activity.set("comment_ids", []);
            activity.set("activity_image", service.get("image"));
            activity.set("is_visible", true);
            activity.set("is_notification", false);
            activity.set("is_seen", false);
            activity.save(null, {
                success: function(object) {
                    console.log("Added Gallery Post");
                    deferred.resolve(true);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.shareActivity = function(user, activity, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("activity_concerned", activity);
            activity.set("activity_type", 13);
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

        factory.interactActivity = function(user, activity, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("activity_concerned", activity);
            activity.set("activity_type", 14);
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

        factory.visitStoreActivity = function(user, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("activity_type", 15);
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

        factory.couponViewActivity = function(user, coupon, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("coupon_id", coupon);
            activity.set("activity_type", 16);
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

        factory.galleryViewActivity = function(user, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("activity_type", 17);
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

        factory.productViewActivity = function(user, product, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("product_id", product);
            activity.set("activity_type", 18);
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

        factory.serviceViewActivity = function(user, service, store) {

            var deferred = $q.defer();

            var Activity = Parse.Object.extend("Activity");
            var activity = new Activity();

            activity.set("user_id", user);
            activity.set("store_concerned", store);
            activity.set("service_id", service);
            activity.set("activity_type", 19);
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

        factory.getUserNotifications = function(user) {

            var deferred = $q.defer();

            var query = new Parse.Query("Activity");
            query.equalTo("user_concerned", user);
            query.equalTo("is_notification", true);
            query.descending("createdAt");

            query.find({
                success: function(activities) {
                    console.log(activities);
                    deferred.resolve(activities);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.getAllCouponsUser = function(user) {

            var deferred = $q.defer();

            var stores_followed = user.get("stores_followed");

            var query = new Parse.Query("Activity");
            query.containedIn("store_id", stores_followed);
            query.equalTo("activity_type", 27);
            query.equalTo("is_notification", true);
            query.descending("createdAt");

            query.find({
                success: function(activities) {
                    console.log(activities);
                    deferred.resolve(activities);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.getStoreNotifications = function(store) {

            var deferred = $q.defer();

            var query = new Parse.Query("Activity");
            query.equalTo("store_concerned", store);
            query.equalTo("is_notification", true);
            query.descending("createdAt");

            query.find({
                success: function(activities) {
                    console.log(activities);
                    deferred.resolve(activities);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.addMetaData = function(store) {

            var deferred = $q.defer();

            var metadata = [];

            var address = store.get("address");
            address = address.replace(/[^a-zA-Z0-9 ]/g, "");
            address = address.split(" ");
            metadata.push.apply(metadata, address);

            var locality_name = store.get("locality").get("locality_name");
            metadata.push(locality_name);

            var category = store.get("primary_category").get("categoryName");
            metadata.push(category);

            var description = store.get("description");
            description = description.replace(/[^a-zA-Z0-9 ]/g, "");
            description = description.split(" ");
            metadata.push.apply(metadata, description);

            var tags = store.get("tags");
            for (var i = 0; i < tags.length; i++) {
                var tag = tags[i].get("tag_description").replace(/[^a-zA-Z0-9 ]/g, "");
                tag = tag.split(" ");
                metadata.push.apply(metadata, tag);
            }

            Parse.Cloud.run('lemmatize', {
                meta: metadata
            }, {
                success: function(result) {

                    var store_name = store.get("name");
                    store_name = store_name.replace(/[^a-zA-Z0-9 ]/g, "");
                    store_name = store_name.toLowerCase();
                    store_name = store_name.split(" ");
                    var store_handle = store.get("store_handle");
                    store.set("metadata", result);
                    store.addUnique("metadata", store_handle);
                    for (var i = 0; i < store_name.length; i++) {
                        store.addUnique("metadata", store_name[i]);
                    }

                    console.log(store.get("metadata"));

                    store.save(null, {
                        success: function(store) {
                            console.log("Success");
                            deferred.resolve(store);
                        },
                        error: function(error, message) {
                            console.log(message);
                            deferred.reject(message);
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

        factory.queryMetaData = function(search) {

            var deferred = $q.defer();

            Parse.Cloud.run('lemmatize', {
                meta: search
            }, {
                success: function(result) {
                    //console.log(result);
                    var query = new Parse.Query("Stores");
                    query.containedIn("metadata", result);

                    query.find({
                        success: function(stores) {
                            deferred.resolve(stores);
                        },
                        error: function(error, message) {
                            console.log(message);
                            deferred.reject(message);
                        }
                    });
                },
                error: function(error) {
                    console.log(error);
                }
            });

            return deferred.promise;
        }

        factory.getLocality = function() {

            var deferred = $q.defer();

            var query = new Parse.Query("Locality");
            query.ascending("city");
            query.find({
                success: function(localities) {
                    console.log(localities);
                    deferred.resolve(localities);
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