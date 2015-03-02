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
    
    //Error handling not done, also function may be incomplete
    factory.createStore = function() {
        var Store = Parse.Object.extend("Stores");
        var store = new Store();
        store.save();
    }
    
    //Pass the store id and an object with all the store details
    factory.addDetailsToStore() {

        var deferred = $q.defer();
        var storeId = "Ik3uYT99O4";
        var Store = Parse.Object.extend("Stores");
        var query = new Parse.Query(Store);

        var storeDetails = {
            name: "Store1",
            primary_category_id: "abcd",
            categories: [
                "defg",
                "hijk"
            ],
            description: "A new store",
            logo: $("#logo")[0],
            address: "b1-17 refocusTech",
            locality: "bhosale paradise",
            phone: "7507118432",
            website_link: "www.refocusTech.com",
            latitude: "18.03",
            longitude: "73.10",
            upvote_count: 10,
            store_joined_number: 2,
            followers_count: 12,
            email: "refocusTech@gmail.com",
            twitter_handler: "haha"
        };

        if (storeDetails.logo.files.length > 0) {

            var logo = storeDetails.logo.files[0];
            var parseFile = new Parse.File(logo.name, logo);
            parseFile.save().then(function () {
                query.get(storeId, {
                    success: function (store) {
                        store.set("name", storeDetails.name);
                        store.set("primary_category_id", storeDetails.primary_category_id);
                        store.set("categories", storeDetails.categories);
                        store.set("description", storeDetails.description);
                        store.set("logo", parseFile);
                        store.set("address", storeDetails.address);
                        store.set("locality", storeDetails.locality);
                        store.set("phone", storeDetails.phone);
                        store.set("website_link", storeDetails.website_link);
                        store.set("latitude", storeDetails.latitude);
                        store.set("longitude", storeDetails.longitude);
                        store.set("email", storeDetails.email);
                        store.save(null, {
                            success: function (object) {
                                console.log(object);
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
            });
        } else {
            console.log("No logo uploaded");
            deferred.reject("No logo Image");
        }
    }
    
    //pass a notification object to this function
    //No need of picture at the moment
    factory.addNotification = function() {

        var deferred = $q.defer();
        var notificationDetails = {
            userId: "OHjLjnyS4K",
            type: "Coupon",
            description: "Wah naya coupon mil gaya tujhya",
            picture: $("#notificationpicture")[0],
            seen: false,
            global: false
        }

        if (notificationDetails.picture.files.length > 0) {

            var query = new Parse.Query(Parse.User);
            query.get(notificationDetails.userId, {
                success: function (user) {

                    var picture = notificationDetails.picture.files[0];
                    var parseFile = new Parse.File(picture.name, picture);
                    parseFile.save().then(function () {
                        var Notification = Parse.Object.extend("Notifications");
                        var notification = new Notification();

                        notification.set("user_id", user);
                        notification.set("type", notificationDetails.type);
                        notification.set("description", notificationDetails.description);
                        notification.set("picture", parseFile);
                        notification.set("seen", notificationDetails.seen);
                        notification.set("global", notificationDetails.global);
                        notification.save(null, {
                            success: function (object) {
                                console.log(object);
                                deferred.resolve(true);
                            },
                            error: function (error, message) {
                                console.log(error);
                                deferred.reject(message);
                            }
                        });

                    });
                },
                error: function (error, message) {
                    deferred.reject(message);
                }
            });
        } else {
            console.log("No picture selected");
            deferred.reject("No picture selected");
        }
    }
    
    //pass the product object with the product details
    factory.addProduct = function() {

        var deferrred = $q.defer();
        
        var productDetails = {
            name: "Test Product",
            store_id: "r13wY0LqKW",
            image: $("#productpic")[0],
            stock: 10,
            cprice: 102.50,
            sprice: 99.99,
            is_sale: true,
            is_visible: false,
            description: "Wow much swag"
        };

        if (productDetails.image.files.length > 0) {

            var query = new Parse.Query("Stores");
            query.get(productDetails.store_id, {
                success: function (store) {
                    var picture = productDetails.image.files[0];
                    var parseFile = new Parse.File(picture.name, picture);
                    parseFile.save().then(function () {
                        var Product = Parse.Object.extend("Products");
                        var product = new Product();
                        product.set("name", productDetails.name);
                        product.set("store_id", store);
                        product.set("image", parseFile);
                        product.set("stock", productDetails.stock);
                        product.set("cprice", productDetails.cprice);
                        product.set("sprice", productDetails.sprice);
                        product.set("is_sale", productDetails.is_sale);
                        product.set("is_visible", productDetails.is_visible);
                        product.set("description", productDetails.description);

                        product.save(null, {
                            success: function (object) {
                                console.log(object);
                                store.addUnique("products", object);
                                store.save(null, {
                                    success: function (object) {
                                        console.log("Added to Store");
                                        deferrred.resolve(true);
                                    },
                                    error: function (error, message) {
                                        console.log(message);
                                        deferrred.reject(message);
                                    }
                                });

                            },
                            error: function (error, message) {
                                console.log(error);
                                deferrred.reject(message);
                            }
                        });
                    });
                },
                error: function (error, message) {
                    console.log(error);
                    deferrred.reject(message);
                }

            });
        } else {
            console.log("No product picture selected");
            deferrred.reject("No picture selected");
        }
    }
    
    //Pass the product details as an object which should include the product id
    factory.editProduct = function() {
        
        var deferred = $q.defer();
        
        var productDetails = {
            objectId: "QVYgvi4nxJ",
            name: "New Product",
            image: $("#productpic")[0],
            stock: 10,
            cprice: 102.50,
            sprice: 99.99,
            is_sale: true,
            is_visible: false,
            description: "Wow much swag"
        };

        if (productDetails.image.files.length > 0) {
            var query = new Parse.Query("Products");
            query.get(productDetails.objectId, {
                success: function (product) {
                    var picture = productDetails.image.files[0];
                    var parseFile = new Parse.File(picture.name, picture);
                    parseFile.save().then(function () {
                        product.set("name", productDetails.name);
                        product.set("image", parseFile);
                        product.set("stock", productDetails.stock);
                        product.set("cprice", productDetails.cprice);
                        product.set("sprice", productDetails.sprice);
                        product.set("is_sale", productDetails.is_sale);
                        product.set("is_visible", productDetails.is_visible);
                        product.set("description", productDetails.description);

                        product.save(null, {
                            success: function (object) {
                                console.log(object);
                                deferred.resolve(true);
                            },
                            error: function (error, message) {
                                console.log(message);
                                deferred.reject(message);
                            }
                        });
                    });
                },
                error: function (error, message) {
                    console.log(message);
                    deferred.reject(message);
                }
            });
        } else {
            var query = new Parse.Query("Products");
            query.get(productDetails.objectId, {
                success: function (product) {

                    product.set("name", productDetails.name);
                    product.set("stock", productDetails.stock);
                    product.set("cprice", productDetails.cprice);
                    product.set("sprice", productDetails.sprice);
                    product.set("is_sale", productDetails.is_sale);
                    product.set("is_visible", productDetails.is_visible);
                    product.set("description", productDetails.description);

                    product.save(null, {
                        success: function (object) {
                            console.log(object);
                            deferred.resolve(true);
                        },
                        error: function (error, message) {
                            console.log(message);
                            deferred.reject(message);
                        }
                    });

                },
                error: function (error, message) {
                    console.log(message);
                    deferred.reject(message);s
                }
            });
        }
    }

    
    return factory;
    
}]);
