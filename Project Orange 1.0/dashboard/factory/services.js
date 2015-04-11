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

        factory.getGeneralActivityByStore = function(store) {

            var deferred = $q.defer();

            var query = new Parse.Query("Activity");
            query.equalTo("store_id", store);
            query.equalTo("activity_type", 23);
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

        return factory;
    }


]);