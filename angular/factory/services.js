var phonecatServices = angular.module('phonecatServices', ['parse-angular']);

phonecatServices.factory('Phone', ['$q',
		function ($q) {

			var factory = {};

			factory.init = function () {
				Parse.initialize("1ZeyYfTJAhabLrrRpu9AwT8bWlpU9W3Fj0hesIzN", "wl2trYAjBeN1X7BVroZJjEtTuuFdnb3gmKDGC0D0");
				window.fbAsyncInit = function () {
					Parse.FacebookUtils.init({ // this line replaces FB.init({
						appId: '778139162267115', // Facebook App ID
						status: true, // check Facebook Login status
						cookie: true, // enable cookies to allow Parse to access the session
						xfbml: true, // initialize Facebook social plugins on the page
						version: 'v2.2' // point to the latest Facebook Graph API version
					});

					// Run code after the Facebook SDK is loaded.
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

			factory.fbLogin = function () {

				var deferred = $q.defer();

				Parse.FacebookUtils.logIn("email", {
					success: function (user) {
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
					error: function (user, error) {
						alert("User cancelled the Facebook login or did not fully authorize.");
						deferred.reject(message);

					}
				});

				return deferred.promise;

			}

			factory.getUserData = function () {

				var deferred = $q.defer();
				var currentUser = Parse.User.current();
				var userData = {};
				if (currentUser) {
					FB.api("/me", function (response) {
						userData.email = response.email;
						userData.name = response.name;
						userData.id = response.id;
						deferred.resolve(userData);
					});
				} else {
					console.log("User Not Signed In");
					deferred.reject("Sorry Bitch!!");
				}

				return deferred.promise;
			}

			factory.getUserPicture = function () {

				var deferred = $q.defer();
				var currentUser = Parse.User.current();
				var userData = {};
				if (currentUser) {
					FB.api("/me/picture", function (response) {
						userData.picture = response.data.url;
						deferred.resolve(userData);

					});
				} else {
					console.log("User Not Signed In");
					deferred.reject("Sorry Bitch!!");
				}

				return deferred.promise;
			}

			factory.setUserData = function (userData) {

				var deferred = $q.defer();
				var currentUser = Parse.User.current();
				if (currentUser) {

					var image = new Image();
					console.log(userData.picture);
					image.src = userData.picture;
					image.onload = function () {
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

						parseFile.save().then(function () {

								var username = currentUser.get("username");
								currentUser.set("user_id", username);
								currentUser.set("username", userData.name[0] + userData.id)
								currentUser.set("email", userData.email);
								currentUser.set("is_complete", false);
								currentUser.set("profile_image", parseFile);
								currentUser.save(null, {

									success: function (user) {
										console.log("Added User");
										deferred.resolve(true);
									},
									error: function (error, message) {
										console.log(message);
										deferred.reject(message);
									}
								});
							},
							function (error, message) {
								console.log(error);
								deferred.reject(message);
							});
					}
				} else {
					console.log("Not Logged In");
				}
			}

			factory.updateUserImageFromFB = function () {

				var deferred = $q.defer();
				var currentUser = Parse.User.current();
				if (currentUser) {
					var promise = getUserPicture();
					promise.then(function (url) {

							var image = new Image();
							image.src = url;
							image.onload = function () {
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

								parseFile.save().then(function () {

										currentUser.set("profile_image", parseFile);
										currentUser.save(null, {

											success: function (user) {
												console.log("Updated Image");
												deferred.resolve(true);
											},
											error: function (error, message) {
												console.log(message);
												deferred.reject(message);
											}
										});
									},
									function (error, message) {
										console.log(error);
										deferred.reject(message);
									});
							}

						}


					},
					function (error) {

					});
			} else {
				console.log("User not logged in");
			}

		}

		//Pass the userID
		/*	factory.getUserDataParse = function (userId) {

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
					deferred.reject(message);
				}
			});

			return deferred.promise;

		}
	*/
		//Set user Data

		factory.setUserDataParse = function (userData) {

			var deferred = $q.defer();

			var user = Parse.User.current();
			user.set("username", userData.username);
			user.set("email", userData.email);
			user.set("website", userData.website);
			user.set("is_complete", true);
			user.set("description", userData.description);
			user.set("no_stores_upvoted", 0);
			user.save(null, {

				success: function (user) {
					console.log("Added User");
					deferred.resolve(true);
				},
				error: function (error, message) {
					console.log(message);
					deferred.reject(message);
				}
			});

			return deferred.promise;

		}

		factory.checkUsernameAvailablility = function (username) {

			var deferred = $q.defer();

			var query = new Parse.Query(Parse.User);
			query.equalTo("username", username);

			query.find({
				success: function (user) {
					if (user.length == 0)
						deferred.resolve(true);
					else
						deferred.resolve(false);
				},
				error: function (error, message) {
					deferred.reject(message);
				}
			});

			return deferred.promise;
		}

		//Pass the storeID
		/*		factory.getStoreDataByStoreId = function (storeid) {

			var deferred = $q.defer();

			var query = new Parse.Query("Stores");
			query.equalTo("objectId", storeid);
			query.include("products");
			query.include("primary_category");
			query.include("secondary_category");
			query.include("collections");
			query.find({
				success: function (store) {
					console.log(store);
					deferred.resolve(store);
				},
				error: function (error, message) {
					console.log(error);
					deferred.reject(message);
				}

			});

			return deferred.promise;
		}
*/
		/*
		//Pass the userID
		factory.getStoreDataByUserId = function (userid) {

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
			return deferred.promise;

		}
*/
		//Pass the storeID
		factory.fetchGalleryOfStore = function (storeId) {

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
			return deferred.promise;

		}

		//Pass Store id and images from file selector
		factory.addStoreImagesToGallery = function (storeId) {

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
			return deferred.promise;

		}

		//Pass product ID and the images from file selector
		factory.addProductImagesToGallery = function (productId) {

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
					deferred.reject(error);
				}
			});
			return deferred.promise;

		}

		//Pass product ID and the images from file selector
		factory.addServiceImagesToGallery = function (productId) {

			var deferred = $q.defer();

			var image = $("#image")[0];

			var Service = Parse.Object.extend("Services");
			var query = new Parse.Query(Service);
			query.get(serviceId, {
				success: function (service) {
					var Gallery = Parse.Object.extend("Gallery");
					var picture = new Gallery();
					if (image.files.length > 0) {
						var file = image.files[0];
						console.log(image.files[0]);
						var parseFile = new Parse.File(file.name, file);

						parseFile.save().then(function () {
							console.log("Saved");
							picture.set("image", parseFile);
							picture.set("service_id", service);
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
					deferred.reject(error);
				}
			});
			return deferred.promise;

		}

		//Pass imageId and image from file selector
		factory.editImagesToGallery = function () {

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
			return deferred.promise;

		}

		//Delete Image in Gallery
		factory.deleteImagesInGallery = function (imageId) {

			var deferred = $q.defer();
			var query = new Parse.Query("Gallery");
			query.get(imageId, {
				success: function (picture) {
					picture.destroy({});
					console.log("Deleted");
					deferred.resolve(true);
				},
				error: function (error, message) {
					console.log(message);
					deferred.resolve(message);
				}
			});

		}

		/*
		//Pass the userId
		factory.fetchComment = function () {

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
			return deferred.promise;

		}

		factory.fetchCommentOfStore = function () {
			var deferred = $q.defer();
			var storeId = "Ik3uYT99O4";

			var storequery = new Parse.Query("Stores");
			storequery.equalTo("objectId", storeId);

			var query = new Parse.Query("Comments");
			query.matchesQuery("store_id", storequery);
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
			return deferred.promise;

		}

		//Pass the userId and the commentText
		//StoreID / CollectionID needs to be added
		factory.addComment = function () {

			var deferred = $q.defer();
			var userId = "OHjLjnyS4K";
			var storeId = "Ik3uYT99O4";
			var commenttext = "lorem impsum some shizz";

			var query = new Parse.Query(Parse.User);
			query.get(userId, {
				success: function (user) {
					var Comment = Parse.Object.extend("Comments");
					var comment = new Comment();

					var querystore = new Parse.Query("Stores");
					querystore.get(storeId, {
						success: function (store) {
							comment.set("user_id", user);
							comment.set("comment", commenttext);
							comment.set("store_id", store);
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

						}
					});
				},
				error: function (error, message) {
					console.log(error);
					deferred.reject(message);
				}
			});
			return deferred.promise;

		}
*/

		//Error handling not done, also function may be incomplete
		factory.createStore = function () {
			var Store = Parse.Object.extend("Stores");
			var store = new Store();
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
			return deferred.promise;

		}

		//Pass the store id and an object with all the store details 
		//Second argument needs to be storeDetails object
		factory.addDetailsToStore = function (store) {

			var deferred = $q.defer();


			var storeDetails = {
				address: "b1-17 refocusTech",
				description: "A new store",
				email: "refocusTech@gmail.com",
				logo: $("#logo")[0], //file
				name: "Store1",
				phone: "7507118432",
				store_handle: "@store",
				website_link: "www.refocusTech.com",
				primary_category: category, //category object from parse
				twitter_link: "#haha",
				facebook_link: "#abcd",
				tags: tags
			};

			if (storeDetails.logo.files.length > 0) {

				var logo = storeDetails.logo.files[0];
				var parseFile = new Parse.File(logo.name, logo);
				parseFile.save().then(function () {

					store.set("address", storeDetails.address);
					store.set("description", storeDetails.description);
					store.set("email", storeDetails.email);
					store.set("logo", parseFile);
					store.set("name", storeDetails.name);
					store.set("phone", storeDetails.phone);
					store.set("store_handle", storeDetails.store_handle);
					store.set("website_link", storeDetails.website_link);
					store.set("primary_category", storeDetails.primary_category);
					store.set("twitter_link", storeDetails.twitter_link);
					store.set("facebook_link", storeDetails.facebook_link);
					store.set("tags", storeDetails.tags);
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

				});
			} else {
				console.log("No logo uploaded");
				deferred.reject("No logo Image");
			}
			return deferred.promise;

		}

		/*
		//pass a notification object to this function
		//No need of picture at the moment
		factory.addNotification = function () {

			var deferred = $q.defer();
			var notificationDetails = {
				userId: "OHjLjnyS4K",
				type: "Coupon",
				description: "Wah naya coupon mil gaya tujhya",
				seen: false,
				global: false
			}


			var query = new Parse.Query(Parse.User);
			query.get(notificationDetails.userId, {
				success: function (user) {

					var Notification = Parse.Object.extend("Notifications");
					var notification = new Notification();

					notification.set("user_id", user);
					notification.set("type", notificationDetails.type);
					notification.set("description", notificationDetails.description);
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


				},
				error: function (error, message) {
					deferred.reject(message);
				}
			});
			return deferred.promise;

		}
*/
		//pass the product object with the product details
		factory.addProduct = function (store) {

			var deferrred = $q.defer();

			var productDetails = {
				cprice: 102.50,
				description: "Wow much swag",
				image: $("#productpic")[0],
				is_sale: true,
				is_visible: false,
				name: "Test Product",
				sprice: 99.99
			};

			if (productDetails.image.files.length > 0) {

				var picture = productDetails.image.files[0];
				var parseFile = new Parse.File(picture.name, picture);
				parseFile.save().then(function () {
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

			} else {
				console.log("No product picture selected");
				deferrred.reject("No picture selected");
			}
			return deferred.promise;

		}

		factory.addService = function (store) {

			var deferrred = $q.defer();

			var serviceDetails = {
				cprice: 102.50,
				description: "Wow much swag",
				image: $("#productpic")[0],
				is_sale: true,
				is_visible: false,
				name: "Test Product",
				sprice: 99.99
			};

			if (serviceDetails.image.files.length > 0) {

				var picture = serviceDetails.image.files[0];
				var parseFile = new Parse.File(picture.name, picture);
				parseFile.save().then(function () {
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
						success: function (object) {
							console.log("Added To services");
							store.addUnique("services", object);
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

			} else {
				console.log("No service picture selected");
				deferrred.reject("No service selected");
			}
			return deferred.promise;

		}

		//Pass the product details as an object which should include the product id
		factory.editProduct = function (product, productDetails) {

			var deferred = $q.defer();

			var picture = productDetails.image.files[0];
			var parseFile = new Parse.File(picture.name, picture);
			parseFile.save().then(function () {
				product.set("cprice", productDetails.cprice);
				product.set("description", productDetails.description);
				product.set("image", parseFile);
				product.set("is_sale", productDetails.is_sale);
				product.set("is_visible", productDetails.is_visible);
				product.set("name", productDetails.name);
				product.set("sprice", productDetails.sprice);

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

			return deferred.promise;

		}

		factory.editService = function (service, serviceDetails) {

			var deferred = $q.defer();

			var picture = serviceDetails.image.files[0];
			var parseFile = new Parse.File(picture.name, picture);
			parseFile.save().then(function () {
				service.set("cprice", serviceDetails.cprice);
				service.set("description", serviceDetails.description);
				service.set("image", parseFile);
				service.set("is_sale", serviceDetails.is_sale);
				service.set("is_visible", serviceDetails.is_visible);
				service.set("name", serviceDetails.name);
				service.set("sprice", serviceDetails.sprice);

				service.save(null, {
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

			return deferred.promise;

		}

		factory.editStore = function (store, storeDetails) {

			var deferred = $q.defer();

			var picture = storeDetails.image.files[0];
			var parseFile = new Parse.File(picture.name, picture);
			parseFile.save().then(function () {
				store.set("address", storeDetails.address);
				store.set("description", storeDetails.description);
				store.set("email", storeDetails.email);
				store.set("logo", parseFile);
				store.set("name", storeDetails.name);
				store.set("phone", storeDetails.phone);
				store.set("store_handle", storeDetails.store_handle);
				store.set("website_link", storeDetails.website_link);
				store.set("twitter_link", storeDetails.twitter_link);
				store.set("facebook_link", storeDetails.facebook_link);

				store.save(null, {
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

			return deferred.promise;

		}



		/*		//Pass the storeId to get store products
		factory.fetchProducts = function (storeId) {

			var deferred = $q.defer();

			var storequery = new Parse.Query("Stores");
			storequery.equalTo("objectId", storeId);

			var query = new Parse.Query("Products");
			query.matchesQuery("store_id", storequery);
			query.find({
				success: function (product) {

					console.log("Fetched Products");
					console.log(product);
					deferred.resolve(product);
				},
				error: function (error, message) {
					console.log(error);
					deferred.reject(message);
				}
			});
			return deferred.promise;

		}
*/
		//Pass the product id of the product to be deleted
		//Check if destroy function has success and error
		factory.deleteProduct = function (product, store) {

			var deferred = $q.defer();

			store.remove("products", product);
			store.save(null, {
				success: function (object) {
					console.log("Removed Product");
					product.destroy({
						success: function (myObject) {
							deferred.resolve(true);
						},
						error: function (myObject, error) {
							deferred.reject(error);
						}
					});
				},
				error: function (error, message) {
					console.log(message);
					deferred.reject(message);
				}
			});



			return deferred.promise;

		}

		factory.deleteService = function (service, store) {

			var deferred = $q.defer();

			store.remove("products", service);
			store.save(null, {
				success: function (object) {
					console.log("Removed Service");
					service.destroy({
						success: function (myObject) {
							deferred.resolve(true);
						},
						error: function (myObject, error) {
							deferred.reject(error);
						}
					});
				},
				error: function (error, message) {
					console.log(message);
					deferred.reject(message);
				}
			});

			return deferred.promise;

		}

		//Pass a collection object with relevant details
		//Remove the upvote count attribute from an object
		//Check retrieval Based on the views count from analytics
		factory.createCollection = function (user, name, image) {

			var deferred = $q.defer();

			var Collection = Parse.Object.extend("Collections");
			var collection = new Collection();

			if (image.files.length > 0) {
				var picture = image.files[0];
				var parseFile = new Parse.File(picture.name, picture);
				parseFile.save().then(function () {
					collection.set("image", parseFile);
					collection.set("collection_name", name);
					collection.set("created_by", user);

					collection.save(null, {
						success: function (object) {
							console.log(user);
							user.addUnique("collections", object);
							user.save(null, {
								success: function (object) {
									console.log("Added to user");
									deferred.resolve(true);
								},
								error: function (object, error) {
									console.log(error);
									deferred.reject(error);
								}
							});

						},
						error: function (error) {
							console.log(error);
							deferred.reject(error);
						}
					});
				});
			} else {
				collection.set("collection_name", name);
				collection.set("created_by", user);
				collection.save(null, {
					success: function (object) {
						console.log(user);
						user.addUnique("collections", object);
						user.save(null, {
							success: function (object) {
								console.log("Added to user");
								deferred.resolve(true);
							},
							error: function (error, message) {
								console.log(error);
								deferred.reject(message)
							}
						});

					},
					error: function (error, message) {
						console.log(message);
						deferred.reject(message);
					}
				});
			}
			return deferred.promise;

		}

		factory.editCollection = function (collection, name, image) {

			var deferred = $q.defer();

			var picture = image.files[0];
			var parseFile = new Parse.File(picture.name, picture);
			parseFile.save().then(function () {
				collection.set("image", parseFile);
				collection.set("collection_name", name);
				collection.save(null, {
					success: function (object) {
						console.log("Edited Collection");
						deferred.resolve(true);
					},
					error: function (error, message) {
						console.log(message);
						deferred.reject(message);
					}
				});

			});
		}

		factory.addProductToCollection = function (product, collection) {

			var deferred = $q.defer();

			collection.addUnique("product_ids", product);
			collection.save(null, {
				success: function (object) {
					console.log("Added Product");
					product.addUnique("collections", collection);
					product.save(null, {
						success: function (object) {
							console.log("Added To Collection");
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
					deferred.reject(message);
				}
			});

			return deferred.promise;
		}

		factory.addServiceToCollection = function (service, collection) {

			var deferred = $q.defer();

			collection.addUnique("service_ids", service);
			collection.save(null, {
				success: function (object) {
					console.log("Added Service");
					service.addUnique("collections", collection);
					service.save(null, {
						success: function (object) {
							console.log("Added To Collection");
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
					deferred.reject(message);
				}
			});

			return deferred.promise;
		}

		//pass the store Id and the collection ID
		factory.addStoreToCollection = function (store, collection) {
			var deferred = $q.defer();
			collection.addUnique("store_ids", store);
			collection.save(null, {
				success: function (object) {
					console.log("Added Store");
					store.addUnique("collections", collection);
					store.save(null, {
						success: function (object) {
							console.log("Added Collection");
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
					deferred.reject(message);
				}
			});


			return deferred.promise;

		}

		factory.favoriteCollection = function (user, collection) {

			var deferred = $q.defer();
			user.addUnique("collections_favorited", collection);
			user.save(null, {
				success: function (object) {
					console.log("Added collection");
					collection.addUnique("favorited_by", user);
					collection.save(null, {
						success: function (object) {
							console.log("Added User");
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
					deferred.reject(message);
				}
			});


			return deferred.promise;

		}

		/*		//Pass the collection ID
		factory.getAllProductsOfCollection = function () {

			var deferred = $q.defer();
			var collectionId = "wLE4KuCz1G";

			var query = new Parse.Query("Collections");
			query.equalTo("objectId", collectionId);
			query.include("product_ids");

			query.find({
				success: function (collection) {
					console.log(collection[0].get("product_ids"));
					deferred.resolve(collection[0].get("product_ids"));
				},
				error: function (error, message) {
					console.log(error);
					deferred.reject(message);
				}
			});
			return deferred.promise;

		}
*/

		/*		//Pass the collection ID
		factory.getAllStoresOfCollection = function () {

			var deferred = $q.defer();

			var collectionId = "jk7briy5lx";

			var query = new Parse.Query("Collections");
			query.equalTo("objectId", collectionId);
			query.include("store_ids");

			query.find({
				success: function (collection) {
					console.log(collection[0].get("store_ids"));
					deferred.resolve(collection[0].get("store_ids"));
				},
				error: function (error, message) {
					console.log(error);
					deferred.reject(message);
				}
			});
			return deferred.promise;

		}
*/

		factory.deleteProductFromCollection = function (product, collection) {
			var deferred = $q.defer();

			collection.remove("product_ids", product);
			collection.save(null, {
				success: function (object) {
					console.log("Remove Product");
					product.remove("collections", collection);
					product.save(null, {
						success: function (object) {
							console.log("Removed From Collection");
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
					deferred.reject(message);
				}
			});

			return deferred.promise;

		}

		//done not tested
		factory.deleteServiceFromCollection = function (service, collection) {

			var deferred = $q.defer();

			collection.remove("service_ids", service);
			collection.save(null, {
				success: function (object) {
					console.log("Removed Service");
					service.remove("collections", collection);
					service.save(null, {
						success: function (object) {
							console.log("Removed From Collection");
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
					deferred.reject(message);
				}
			});

			return deferred.promise;

		}

		//done not tested
		factory.deleteStoreFromCollection = function (store, collection) {

			var deferred = $q.defer();

			collection.remove("store_ids", store);
			collection.save(null, {
				success: function (object) {
					console.log("Removed Store");
					store.remove("collections", collection);
					store.save(null, {
						success: function (object) {
							console.log("Removed from Collection");
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
					deferred.reject(message);
				}
			});

			return deferred.promise;

		}

		/*		//Pass the user Id to fetch collections 
				//Integrate function to get collection of stores and products
		factory.getAllStoreCollectionOfUser = function (userId) {

			var deferred = $q.defer();

			var userquery = new Parse.Query(Parse.User);
			userquery.equalTo("objectId", userId);

			var query = new Parse.Query("Collections");
			query.matchesQuery("created_by", userquery);
			query.equalTo("type", "Store");
			query.include("store_ids");

			query.find({
				success: function (store) {
					console.log(store);
					deferred.resolve(store);
				},
				error: function (error, message) {
					deferred.reject(message);
				}
			});
			return deferred.promise;

		}

		//Integrate with above function
		factory.getAllProductCollectionOfUser = function (userId) {

			var deferrred = $q.defer();

			var userquery = new Parse.Query(Parse.User);
			userquery.equalTo("objectId", userId);

			var query = new Parse.Query("Collections");
			query.matchesQuery("created_by", userquery);
			query.equalTo("type", "Product");
			query.include("product_ids");

			query.find({
				success: function (product) {
					console.log(product);
					deferred.resolve(product);
				},
				error: function (error, message) {
					deferred.reject(message);
				}
			});
			return deferred.promise;

		}

		//Integrated function
		factory.getAllCollectionOfUser = function (userId) {

			var deferrred = $q.defer();

			var userquery = new Parse.Query(Parse.User);
			userquery.equalTo("objectId", userId);

			var query = new Parse.Query("Collections");
			query.matchesQuery("created_by", userquery);
			query.include("product_ids");
			query.include("store_ids")

			query.find({
				success: function (collections) {
					console.log(collection);
					deferred.resolve(collection);
				},
				error: function (error, message) {
					deferred.reject(message);
				}
			});
			return deferred.promise;

		}
*/

		factory.getCollectionById = function (collectionId) {

			var deferrred = $q.defer();

			var query = new Parse.Query("Collections");
			query.equals("objectId", collectionId);
			query.include("product_ids");
			query.include("store_ids");
			query.include("service_ids");
			query.include("favorited_by");
			query.find({
				success: function (collection) {
					console.log(collection);
					deferred.resolve(true);
				},
				error: function (error, message) {
					console.log(message);
					deferred.reject(message);
				}
			});

			return deferred.promise;
		}

		factory.getStoreByHandle = function (handle) {

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
				success: function (store) {
					deferred.resolve(store);
				},
				error: function (error, message) {
					deferred.reject(message);
				}
			});

			return deferred.promise;
		};

		return factory;

	}


]);