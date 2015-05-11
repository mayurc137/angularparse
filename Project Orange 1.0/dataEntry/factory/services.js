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
        }

        factory.getStoreOwner = function(store) {

            var deferred = $q.defer();

            var query = new Parse.Query(Parse.User);
            query.equalTo("store_id", store);
            query.equalTo("is_store", true);
            query.find({
                success: function(user) {
                    console.log(user);
                    deferred.resolve(user[0]);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
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

        factory.getLocality = function() {

            var deferred = $q.defer();

            var query = new Parse.Query("Locality");
            query.ascending("locality_name");


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
            store.set("dirty_bit", false);

            store.set("followers", []);
            store.set("products", []);
            store.set("services", []);
            store.set("upvoted_by", []);
            store.set("collections", []);
            store.set("review_ids", []);

            if (storeDetails.logoImage == null) {

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

            } else {

                var logofile = storeDetails.logoImage;
                var parseFile2 = new Parse.File(logofile.name, logofile);
                parseFile2.save().then(function() {

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
            }

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

        factory.addDetailsToStore = function(store, storeDetails, logoImageChange, bannerImageChange) {

            var deferred = $q.defer();

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
            store.set('phone', []);
            store.addUnique("phone", storeDetails.primaryPhone);
            store.addUnique("phone", storeDetails.secPhone);
            store.set("primary_category", storeDetails.selectedCategory);
            store.set('payment_type', []);
            store.addUnique("payment_type", storeDetails.selectedPayment);
            store.set("tags", storeDetails.selectedTags);
            store.set("start_time", storeDetails.startTime);
            store.set("store_handle", storeDetails.storeHandle);
            store.set("twitter_link", storeDetails.twitterLink);
            store.set("website_link", storeDetails.website);
            store.set("working_days", storeDetails.workingDays);
            store.set("dirty_bit", false);

            if (logoImageChange && bannerImageChange) {

                var logofile = storeDetails.logoImage;
                var parseFile2 = new Parse.File(logofile.name, logofile);

                parseFile2.save().then(function() {
                    store.set("logo", parseFile2);
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
                }, function(error) {
                    console.log(error);
                });

            } else if (logoImageChange) {
                var logofile = storeDetails.logoImage;
                var parseFile = new Parse.File(logofile.name, logofile);

                parseFile.save().then(function() {
                    store.set("logo", parseFile);
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
                });
            } else if (bannerImageChange) {
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
                    deferred.resolve(result);;
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

        factory.addStoreImageToGallery = function(store, file) {

            var deferred = $q.defer();

            var Gallery = Parse.Object.extend("Gallery");
            var picture = new Gallery();

            var parseFile = new Parse.File(file.name, file);

            parseFile.save().then(function() {
                console.log("Saved");
                picture.set("image", parseFile);
                picture.set("store_id", store);
                picture.save(null, {

                    success: function(picture) {
                        console.log("Added to Database");
                        deferred.resolve(picture);
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

            return deferred.promise;
        }

        factory.removeStoreImageFromGallery = function(store, image) {

            var deferred = $q.defer();

            if (image.get("store_id").id == store.id) {
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

        return factory;
    }


]);