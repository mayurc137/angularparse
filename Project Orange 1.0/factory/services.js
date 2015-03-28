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


        return factory;

    }


]);