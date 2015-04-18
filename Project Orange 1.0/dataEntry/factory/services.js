var parseServices = angular.module('parseServices', ['parse-angular']);

parseServices.factory('ParseFactory', ['$q',
    function($q) {

        var factory = {};

        factory.init = function() {
            Parse.initialize("ZaHk6NzbXLus8EmO0DetfsigR3I2zi4O9D8u5iIG", "kqu6hlxW83BqIeaOBuEgaFr1wyOZ6kNO9VxO5f89");
        }

        factory.getCurrentUser = function() {
            var currentUser = Parse.User.current();
            return currentUser;
        }

        factory.logOut = function() {
            Parse.User.logOut();
        }

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

        factory.getLocality = function() {

            var deferred = $q.defer();

            var query = new Parse.Query("Locality");
            query.ascending("city");

            query.find({
                success: function(localities) {
                    deferred.resolve(localities);
                },
                error: function(error, message) {

                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.getCategories = function() {
            var deferred = $q.defer();

            var query = new Parse.Query("Categories");
            query.ascending("categoryName");

            query.find({
                success: function(categories) {
                    deferred.resolve(categories);
                },
                error: function(error, message) {
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.getTags = function() {
            var deferred = $q.defer();

            var query = new Parse.Query("Tags");
            query.include("tag_category");
            query.ascending("tag_description");

            query.find({
                success: function(tags) {
                    deferred.resolve(tags);
                },
                error: function(error, message) {
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

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
                                deferred.resolve(store);
                            },
                            error: function(error, message) {
                                deferred.reject(message);
                            }
                        });

                    }
                }, function(error) {
                    deferred.reject(error);
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

        factory.storeReg = function(userDetails) {

            var deferred = $q.defer();

            var email = userDetails.email;
            var phone = userDetails.phone;
            var name = userDetails.name;
            var store_id = userDetails.store_id;

            Parse.Cloud.run('storeSignUp', {
                email: email,
                phone: phone,
                name: name,
                store_id: store_id
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

        factory.checkStoreOwnerEmailAvailablility = function(email) {

            var deferred = $q.defer();

            var query = new Parse.Query(Parse.User);
            query.equalTo("email", email);

            query.find({
                success: function(users) {
                    if (users.length == 0)
                        deferred.resolve(null);
                    else
                        deferred.resolve(users[0]);
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
                success: function(stores) {
                    if (stores.length == 0)
                        deferred.resolve(null);
                    else
                        deferred.resolve(stores[0]);
                },
                error: function(error, message) {
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

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
                    store.set("phone", storeDetails.phone);
                    store.set("store_handle", storeDetails.store_handle);
                    store.set("website_link", storeDetails.website_link);
                    store.set("primary_category", category);
                    store.set("twitter_link", storeDetails.twitter_link);
                    store.set("facebook_link", storeDetails.facebook_link);
                    store.set("tags", tags);
                    store.save(null, {
                        success: function(store) {
                            console.log(object);
                            deferred.resolve(store);
                        },
                        error: function(error, message) {
                            console.log(error);
                            deferred.reject(message);
                        }
                    });
                });
            } else {
                console.log("No logo uploaded");
                deferred.reject("No logo Image");
            }

            return deferred.promise;
        }

        return factory;
    }


]);