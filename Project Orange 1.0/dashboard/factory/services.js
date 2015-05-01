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

        factory.getStoreById = function(id) {

            var deferred = $q.defer();

            var query = new Parse.Query("Stores");
            query.equalTo('objectId', id);
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

        factory.getCouponsByStore = function(store) {

            var deferred = $q.defer();

            var query = new Parse.Query("Coupons");
            query.equalTo("store_id", store);
            query.include("coupon_category");
            query.include("store_id");
            query.descending("createdAt");

            query.find({
                success: function(coupons) {
                    console.log(coupons);
                    deferred.resolve(coupons);
                },
                error: function(error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });

            return deferred.promise;
        }

        factory.getCouponCategories = function() {
            var deferred = $q.defer();

            var query = new Parse.Query("CouponCat");
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

        factory.addCoupons = function(store, couponDetails) {

            var deferred = $q.defer();

            var Coupon = Parse.Object.extend("Coupons");
            var coupon = new Coupon();

            coupon.set("coupon_name", couponDetails.name);
            coupon.set("terms", couponDetails.terms);
            coupon.set("store_id", store);
            coupon.set("redemption_limit", couponDetails.redeemCount);
            coupon.set("claim_limit", couponDetails.redeemCount);
            coupon.set("user_claimed_ids", []);
            coupon.set("user_redeemed_ids", []);
            coupon.set("expiry_date", couponDetails.endDate);
            coupon.set("start_date", couponDetails.startDate);
            coupon.set("active", true);
            coupon.set("coupon_category", couponDetails.selectedCategory);

            var self = this;

            coupon.save(null, {
                success: function(coupon) {
                    console.log("Success");
                    var promise = self.createCouponPost(store, coupon);
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

        factory.getGeneralActivityByStore = function(store) {

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

        factory.getLocality = function(city) {

            var deferred = $q.defer();

            var query = new Parse.Query("Locality");
            query.equalTo("city", city);
            query.ascending('locality_name');

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

        return factory;
    }


]);