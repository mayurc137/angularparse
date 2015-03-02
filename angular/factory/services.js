var phonecatServices = angular.module('phonecatServices', ['parse-angular']);

phonecatServices.factory('Phone', [ '$q', function($q){
    
    var factory = {};
    
    factory.init = function(){
		Parse.initialize("1ZeyYfTJAhabLrrRpu9AwT8bWlpU9W3Fj0hesIzN", "wl2trYAjBeN1X7BVroZJjEtTuuFdnb3gmKDGC0D0");
    	window.fbAsyncInit = function() {
	    Parse.FacebookUtils.init({ // this line replaces FB.init({
	      appId      : '369037209950062', // Facebook App ID
	      status     : true,  // check Facebook Login status
	      cookie     : true,  // enable cookies to allow Parse to access the session
	      xfbml      : true,  // initialize Facebook social plugins on the page
	      version    : 'v2.2' // point to the latest Facebook Graph API version
	    });
	 
	    // Run code after the Facebook SDK is loaded.
	  };
	 
	  (function(d, s, id){
	    var js, fjs = d.getElementsByTagName(s)[0];
	    if (d.getElementById(id)) {return;}
	    js = d.createElement(s); js.id = id;
	    js.src = "//connect.facebook.net/en_US/sdk.js";
	    fjs.parentNode.insertBefore(js, fjs);
	  }(document, 'script', 'facebook-jssdk'));
    }

    factory.fbLogin = function(){
    		
    	Parse.FacebookUtils.logIn("email", {
		    success: function(user) {
			    if (!user.existed()) {
			      alert("User signed up and logged in through Facebook!");
			    } else {
			      alert("User logged in through Facebook!");
			    }
			  },
			  error: function(user, error) {
			    alert("User cancelled the Facebook login or did not fully authorize.");
			  }
		});
    }
    
    factory.getUserData = function(){

    	var deferred = $q.defer();
    	var currentUser = Parse.User.current();
    	var userData = {};
    	if(currentUser){
    		FB.api("/me/picture" , function(response){
    			userData.picture = response.data.url;
    		});
    		FB.api("/me" , function(response){
    			userData.email = response.email;
    			userData.name = response.name;
    			deferred.resolve(userData);
    		});    		
    	}else{
    		console.log("User Not Signed In");
    		deferred.reject("Sorry Bitch!!");
    	}

    	return deferred.promise;
    }

    //Pass the userID
    factory.getUserDataParse = function(userId){
        
        var deferred = $q.defer();
        
        var query = new Parse.Query(Parse.User);
        query.equalTo("user_id", userId);
        query.include("collections");
        query.include("collections.store_ids");
        query.include("collections.product_ids");
        query.find({
            success: function (user) {
                // Syntax = user[0].get('name of column')
                console.log(user);
                deferred.resolve(user);
            },
            error: function (error, message) {
                console.log(message);
                deferrred.reject(message);
            }
        });

    }

    //Pass the storeID
    factory.getStoreDataByStoreId = function(storeid) {

        var deferred = $q.defer();
        
        var query = new Parse.Query("Stores");
        query.equalTo("objectId", storeid);
        query.include("products");
        query.find({
            success: function (store) {
                console.table(store);
                deferred.resolve(store);
            },
            error: function (error, message) {
                console.log(error);
                deferred.reject(message);
            }

        });
    }

    //Pass the userID
    factory.getStoreDataByUserId = function(userid) {

        var deferred = $q.defer();
        var query = new Parse.Query(Parse.User);
        query.equalTo("objectId", userid);
        query.include("store_id");
        query.include("store_id.products");

        query.find({
            success: function (user) {
                console.log(user[0].get("store_id"));
                deferred.resolve(user[0].get("store_id"));
            },
            error: function (error, message) {
                console.log(error);
                deferred.reject(message);
            }

        });
    }
    
    //Pass the storeID
    factory.fetchGalleryOfStore = function(storeId) {

        var deferred = $q.defer();
        var storequery = new Parse.Query("Stores");
        storequery.equalTo("objectId", storeId);
        var query = new Parse.Query("Gallery");
        query.matchesQuery("store_id", storequery);
        query.find({
            success: function (gallery) {

                console.log(gallery[0].attributes.image._url);
                deferred.resolve(gallery);
            },
            error: function (error, message) {
                console.log(error);
                deferred.reject(message);
            }
        });

    }
    
    //Pass Store id and images from file selector
    factory.addStoreImagesToGallery = function(storeId) {

        var deferred = $q.defer(); 
        
        var image = $("#image")[0];

        var Store = Parse.Object.extend("Stores");
        var query = new Parse.Query(Store);
        query.get(storeId, {
            success: function (store) {
                var Gallery = Parse.Object.extend("Gallery");
                var picture = new Gallery();
                if (image.files.length > 0) {
                    var file = image.files[0];
                    console.log(image.files[0]);
                    var parseFile = new Parse.File(file.name, file);

                    parseFile.save().then(function () {
                        console.log("Saved");
                        picture.set("image", parseFile);
                        picture.set("store_id", store);
                        picture.save(null, {

                            success: function (picture) {
                                console.log("Added to Database");
                                deferred.resolve(true);
                            },
                            error: function (error, message) {
                                console.log("Error in adding to Database");
                                deferred.reject(message);
                            }
                        });
                    }, function (error, message) {
                        console.log(error);
                        deferred.reject(message);
                    });
                }
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
            }
        });
    }
    
    //Pass product ID and the images from file selector
    factory.addProductImagesToGallery = function(productId) {

        var deferred = $q.defer();
            
        var image = $("#image")[0];

        var Store = Parse.Object.extend("Products");
        var query = new Parse.Query(Store);
        query.get(productId, {
            success: function (product) {
                var Gallery = Parse.Object.extend("Gallery");
                var picture = new Gallery();
                if (image.files.length > 0) {
                    var file = image.files[0];
                    console.log(image.files[0]);
                    var parseFile = new Parse.File(file.name, file);

                    parseFile.save().then(function () {
                        console.log("Saved");
                        picture.set("image", parseFile);
                        picture.set("product_id", product);
                        picture.save(null, {

                            success: function (picture) {
                                console.log("Added to Database");
                                deferred.resolve(true);
                            },
                            error: function (error, message) {
                                console.log("Error in adding to Database");
                                deferred.reject(error);
                            }
                        });
                    }, function (error, message) {
                        console.log(error);
                        deferred.reject(error);
                    });
                }
            },
            error: function (object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
                deferred.reject(error);
            }
        });
    }
    
    //Pass imageId and image from file selector
    factory.editStoreImagesToGallery = function() {

        var deferred = $q.defer();
        var imageId = "4YXtxaf5E2";
        var image = $("#image")[0];
        
        if (image.files.length > 0) {
            var file = image.files[0];
            console.log(image.files[0]);
            var parseFile = new Parse.File(file.name, file);

            parseFile.save().then(function () {
                console.log("Saved");
                var query = new Parse.Query("Gallery");
                query.get(imageId, {
                    success: function (picture) {
                        picture.set("image", parseFile);
                        picture.save(null, {

                            success: function (picture) {
                                console.log("Added to Database");
                                deferred.resolve(true);
                            },
                            error: function (error, message) {
                                console.log("Error in adding to Database");
                                deferred.reject(message);
                            }
                        });
                    },
                    error: function (error, message) {
                        console.log(message);
                        deferred.reject(message);
                    }
                });

            }, function (error, message) {
                console.log(error);
                deferred.reject(message);
            });
        } else {
            console.log("No image selected");
            deferred.reject("No image selected");
        }
    }
    
    //Pass the userId
    factory.fetchComment = function() {

        var deferred = $q.defer();
        var userId = 'OHjLjnyS4K';

        var userquery = new Parse.Query("User");
        userquery.equalTo("objectId", userId);
        
        var query = new Parse.Query("Comments");
        query.matchesQuery("user_id", userquery);
        query.find({
            success: function (comment) {

                console.log("Fetched Comment");
                console.log(comment);
                deferred.resolve(comment);
            },
            error: function (error, message) {
                console.log(error);
                deferred.reject(message);
            }
        });
    }
    
    //Pass the userId and the commentText
    //StoreID / CollectionID needs to be added
    factory.addComment = function() {

        var deferred = $q.defer();
        var userId = "OHjLjnyS4K";
        var commenttext = "lorem impsum some shizz";

        var query = new Parse.Query(Parse.User);
        query.get(userId, {
            success: function (user) {
                var Comment = Parse.Object.extend("Comments");
                var comment = new Comment();
                comment.set("user_id", user);
                comment.set("comment", commenttext);
                comment.save(null, {

                    success: function (comment) {
                        console.log("Added to Database" + comment);
                        deferred.resolve(true);
                    },
                    error: function (error, message) {
                        console.log(error);
                        deferred.reject(message);
                    }
                });
            },
            error: function (error, message) {
                console.log(error);
                deferred.reject(message);
            }
        });
    }
    
    return factory;
    
}]);
