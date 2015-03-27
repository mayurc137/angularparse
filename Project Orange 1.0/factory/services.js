
var appServices = angular.module('AppServices', ['parse-angular']);

//similar to localStorage
appServices.service('storeData', [ function(){
	var storeData = null;

	var setStoreData = function(newData){
		storeData = newData;
	};

	var getStoreData = function(){
		return storeData;
	};

	return{
		setStoreData : setStoreData,
		getStoreData : getStoreData
	};
}

appServices.factory('ParseServices', ['$q', function($q){
	var factory = {};

	factory.init = function(){
		Parse.initialize("1ZeyYfTJAhabLrrRpu9AwT8bWlpU9W3Fj0hesIzN", "wl2trYAjBeN1X7BVroZJjEtTuuFdnb3gmKDGC0D0");
		window.fbAsyncInit = function () {
         	Parse.FacebookUtils.init({ // this line replaces FB.init({
            	appId: '778139162267115', // Facebook App ID
                status: true, // check Facebook Login status
                cookie: true, // enable cookies to allow Parse to access the session
                xfbml: true, // initialize Facebook social plugins on the page
                version: 'v2.2' // point to the latest Facebook Graph API version
            });
        };

        (function (d, s, id) {
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

    factory.getStoreByHandle = function(handle){

     	init();

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
     		success: function(store){
     			deferred.resolve(store);
     		},
     		error: function(error, message){
     			deferred.reject(message);
     		}
     	});

     	return deferred.promise;
     };

     return factory;
 }]);