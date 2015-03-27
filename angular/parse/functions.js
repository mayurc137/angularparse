function init() {
	Parse.initialize("ZaHk6NzbXLus8EmO0DetfsigR3I2zi4O9D8u5iIG", "kqu6hlxW83BqIeaOBuEgaFr1wyOZ6kNO9VxO5f89");
	console.log("Parse Initialized");
}


//test
function logIn() {
	Parse.User.logIn("mayur", "mayur", {
		success: function (user) {
			console.log("Logged In");
		},
		error: function (user, error) {
			// The login failed. Check error to see why.
			console.log(error);
		}
	});
}

//test
function getUserData(userId) {

	var query = new Parse.Query(Parse.User);
	query.equalTo("objectId", userId);
	query.include("collections");
	query.include("collections.store_ids");
	query.include("collections.product_ids");
	query.include("collections.service_ids");
	query.find({
		success: function (user) {

			// Syntax = user[0].get('name of column')
			console.log(user);
			//createCollection(user[0], "My Collection", $("#image")[0]);
			editUserProfile(user[0]);

		},
		error: function (error, message) {
			console.log(message);
		}
	});

}

//done not tested
function changePassword(user, password) {

	user.set("password", password);
	user.save(null, {

		success: function (object) {
			console.log("Password Changed");
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}

//done
function editUserProfile(user) {

	var userDetails = {
		name: "myra",
		email: "b117@refocusTech.com",
		description: "Swag yolo",
		profile_image: $("#image")[0],
		website: "abcd.com"
	}



	if (userDetails.profile_image.files.length > 0) {
		var file = userDetails.profile_image.files[0];
		console.log(userDetails.profile_image.files[0]);
		var parseFile = new Parse.File(file.name, file);

		parseFile.save().then(function () {

			user.set("name", userDetails.name);
			user.set("email", userDetails.email);
			user.set("description", userDetails.description);
			user.set("profile_image", parseFile);
			user.set("website", userDetails.website);
			user.save(null, {

				success: function (object) {
					console.log("Profile Changed");
				},
				error: function (error, message) {
					console.log(message);
				}
			});

		});
	}

}

//user1 is following user2 (NOT WORK) DO VIA CLOUD CODE
function userFollow(user1, user2) {

	user1.addUnique("user_following", user2);
	user1.save(null, {

		success: function (object) {
			console.log("Added to user1");
		},
		error: function (error, message) {
			console.log(message);
		}
	});

	user2.addUnique("user_followed", user1);
	user2.save(null, {

		success: function (object) {
			console.log("Added to user2");
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}

//Done (test)
function getStoreDataByStoreId(storeid) {

	var query = new Parse.Query("Stores");
	query.equalTo("objectId", storeid);
	query.include("products");
	query.include("primary_category");
	query.include("secondary_category");
	query.include("collections");
	query.include("services");
	query.include("followers");
	query.include("locality");
	query.include("upvoted_by");
	query.include("tags");
	query.find({
		success: function (store) {
			console.log(store);
			//addServices(store[0]);
			//changeLocality("xxVQCLrbtm", 18.561128, 73.807060);
			/*var point = new Parse.GeoPoint({
				latitude: 18.561128,
				longitude: 73.807060
			});

			getNearestStores(point);
			*/


			/*var lat = 18.561127;
			var lon = 73.807060;
			findClosestLocality(lat, lon);*/
		},
		error: function (error) {
			console.log(error);
		}

	});
}

//done 
function getNearestStores(locality) {

	var query = new Parse.Query("Stores");
	query.near("geolocation", locality);

	query.find({
		success: function (localityArray) {
			console.log(localityArray);
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}

//Done
function changeLocality(storeId, lat, lon) {

	var point = new Parse.GeoPoint({
		latitude: lat,
		longitude: lon
	});

	var query = new Parse.Query("Locality");
	query.near("location", point);
	query.limit(2);

	query.find({
		success: function (locality) {
			var location = locality[0];
			console.log(location);
			var storequery = new Parse.Query("Stores");
			storequery.get(storeId, {
				success: function (store) {
					store.set("locality", location);
					store.set("geolocation", point);
					store.save(null, {
						success: function (object) {
							console.log("Success");
						},
						error: function (error, message) {
							console.log(message);
						}
					})
				},
				error: function (error, message) {
					console.log(message);
				}
			});

		},
		error: function (error, message) {
			console.log(message);
		}

	});
}


/*function getStoreDataByUserId(userid) {

	var query = new Parse.Query(Parse.User);
	query.equalTo("objectId", userid);
	query.include("store_id");
	query.include("store_id.products");

	query.find({
		success: function (user) {
			console.log(user[0].get("store_id"));
		},
		error: function (error) {
			console.log(error);
		}

	});

}*/


//Done not tested with new database
function fetchGalleryOfStore(storeId) {

	var storequery = new Parse.Query("Stores");
	storequery.equalTo("objectId", storeId);

	var query = new Parse.Query("Gallery");
	query.matchesQuery("store_id", storequery);
	query.find({
		success: function (gallery) {

			console.log(gallery);
		},
		error: function (error) {
			console.log(error);
		}
	});

}

//Done not tested with new database
function addStoreImagesToGallery(storeId) {

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
						},
						error: function (error) {
							console.log("Error in adding to Database");
						}
					});
				}, function (error) {
					console.log(error);
				});
			}
		},
		error: function (object, error) {
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and message.
		}
	});
}

//Done not tested with new database
function addProductImagesToGallery(productId) {

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
						},
						error: function (error) {
							console.log("Error in adding to Database");
						}
					});
				}, function (error) {
					console.log(error);
				});
			}
		},
		error: function (object, error) {
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and message.
		}
	});
}

//Done not tested with new database
function addServiceImagesToGallery(serviceId) {

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
						},
						error: function (error) {
							console.log("Error in adding to Database");
						}
					});
				}, function (error) {
					console.log(error);
				});
			}
		},
		error: function (object, error) {
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and message.
		}
	});
}

//done not tested
function deleteImagesInGallery(imageId) {

	var query = new Parse.Query("Gallery");
	query.get(imageId, {
		success: function (picture) {
			picture.destroy({});
			console.log("Deleted");
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}

//done not tested with new database
function editImagesToGallery() {

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
						},
						error: function (error) {
							console.log("Error in adding to Database");
						}
					});
				},
				error: function (error, message) {
					console.log(message);
				}
			});

		}, function (error) {
			console.log(error);
		});
	} else {
		console.log("No image selected");
	}
}


//to be recoded
function fetchComment() {

	var userId = 'OHjLjnyS4K';

	var userquery = new Parse.Query("User");
	userquery.equalTo("objectId", userId);
	//storequery.find({ success: function(store) { console.log(store);}})

	var query = new Parse.Query("Comments");
	query.matchesQuery("user_id", userquery);
	query.find({
		success: function (comment) {

			console.log("Fetched Comment");
			console.log(comment);
		},
		error: function (error) {
			console.log(error);
		}
	});
}

//to be recoded
function addComment() {

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
				},
				error: function (error) {
					console.log(error);
				}
			});
		},
		error: function (error) {
			console.log(error);
		}
	});
}


//Done
function createStore() {
	var Store = Parse.Object.extend("Stores");
	var store = new Store();
	store.save();
}

//done (both store and user are parse objects)
function upvoteStore(store, user) {

	store.addUnique("upvoted_by", user);
	store.save(null, {
		success: function (object) {
			console.log("Success");
		},
		error: function (error, message) {
			console.log(message);
		}
	});

	user.addUnique("stores_upvoted", store);
	user.save(null, {
		success: function (object) {
			console.log("Success");
		},
		error: function (error, message) {
			console.log(message);
		}
	});

}

//done
function followStore(store, user) {

	store.addUnique("followers", user);
	store.save(null, {
		success: function (object) {
			console.log("Success");
		},
		error: function (error, message) {
			console.log(message);
		}
	});

	user.addUnique("stores_followed", store);
	user.save(null, {
		success: function (object) {
			console.log("Success");
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}


// Done argument - store, storeDetails
function addDetailsToStore(store) {

	getCategoryById();
	getTags();

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
				},
				error: function (error) {
					console.log(error);
				}
			});

		});
	} else {
		console.log("No logo uploaded");
	}
}

var category;
//test function (done in front end)
function getCategoryById() {
	var querycategory = new Parse.Query("Categories");
	querycategory.get("2zHBKSc2IZ", {
		success: function (primary_category) {
			category = primary_category;
		},
		error: function (error, message) {}
	});
}

var tags;
//test function (done in front end)
function getTags() {
	var query = new Parse.Query("Tags");
	query.find({
		success: function (tag) {
			tags = tag;
		},
		error: function (error, message) {

		}
	});
}


// to be recoded
function addNotification() {

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
						},
						error: function (error) {
							console.log(error);
						}
					});

				});
			},
			error: function (error) {

			}
		});
	} else {
		console.log("No picture selected");
	}
}


//done not tested
function addServices(store) {

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
						},
						error: function (error, message) {
							console.log(message);
						}
					});

				},
				error: function (error, message) {
					console.log(message);
				}
			});
		});

	} else {
		console.log("No product picture selected");
	}
}

//done not tested
function addProduct(store) {

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
						},
						error: function (error, message) {
							console.log(message);
						}
					});

				},
				error: function (error, message) {
					console.log(message);
				}
			});
		});

	} else {
		console.log("No product picture selected");
	}
}

//done not tested
function editProduct(product, productDetails) {
	/*var productDetails = {
		cprice: 102.50,
		description: "Wow much swag",
		image: $("#productpic")[0],
		is_sale: true,
		is_visible: false,
		name: "New Product",
		sprice: 99.99
	};*/

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
			},
			error: function (error, message) {
				console.log(message);
			}
		});
	});
}

//done not tested
function editService(service, serviceDetails) {

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
			},
			error: function (error, message) {
				console.log(message);
			}
		});
	});
}

//done not tested
function editStore(store, storeDetails) {

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
			},
			error: function (error, message) {
				console.log(message);
			}
		});
	});
}

//test function
function fetchProducts(storeId) {

	var storequery = new Parse.Query("Stores");
	storequery.equalTo("objectId", storeId);
	//storequery.find({ success: function(store) { console.log(store);}})

	var query = new Parse.Query("Products");
	query.matchesQuery("store_id", storequery);
	query.find({
		success: function (product) {

			console.log("Fetched Products");
			console.log(product);
		},
		error: function (error) {
			console.log(error);
		}
	});
}

// not tested 
function deleteProduct(product, store) {

	store.remove("products", product);
	store.save(null, {
		success: function (object) {
			console.log("Removed Product");
			product.destroy({});

		},
		error: function (error, message) {
			console.log(message);
		}
	});


}
// not tested
function deleteService(service, store) {

	store.remove("services", service);
	store.save(null, {
		success: function (object) {
			console.log("Removed Service");
			service.destroy({});

		},
		error: function (error, message) {
			console.log(message);
		}
	});

}

//done not tested
function createCollection(user, name, image) {

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
						},
						error: function (object, error) {
							console.log(error);
						}
					});

				},
				error: function (error) {
					console.log(error);
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
					},
					error: function (object, error) {
						console.log(error);
					}
				});

			},
			error: function (error, message) {
				console.log(message);
			}
		});
	}
}

//done not tested
function editCollection(collection, name, image) {

	var picture = image.files[0];
	var parseFile = new Parse.File(picture.name, picture);
	parseFile.save().then(function () {
		collection.set("image", parseFile);
		collection.set("collection_name", name);
		collection.save(null, {
			success: function (object) {
				console.log("Edited Collection");
			},
			error: function (error, message) {
				console.log(message);
			}
		});

	});

}


// done 
function addProductToCollection(product, collection) {

	collection.addUnique("product_ids", product);
	collection.save(null, {
		success: function (object) {
			console.log("Added Product");
		},
		error: function (error, message) {
			console.log(message);
		}
	});

	product.addUnique("collections", collection);
	product.save(null, {
		success: function (object) {
			console.log("Added To Collection");
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}

//done 
function addServiceToCollection(service, collection) {

	collection.addUnique("service_ids", service);
	collection.save(null, {
		success: function (object) {
			console.log(object);
		},
		error: function (error, message) {
			console.log(message);
		}
	});

	service.addUnique("collections", collection);
	service.save(null, {
		success: function (object) {
			console.log(object);
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}


//done
function addStoreToCollection(store, collection) {

	collection.addUnique("store_ids", store);
	collection.save(null, {
		success: function (object) {
			console.log(object);
		},
		error: function (error, message) {
			console.log(message);
		}
	});

	store.addUnique("collections", collection);
	store.save(null, {
		success: function (object) {
			console.log(object);
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}

//done
function favoriteCollection(user, collection) {

	user.addUnique("collections_favorited", collection);
	user.save(null, {
		success: function (object) {
			console.log("Added collection");
		},
		error: function (error, message) {
			console.log(message);
		}
	});

	collection.addUnique("favorited_by", user);
	collection.save(null, {
		success: function (object) {
			console.log("Added User");
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}

//test function
function getAllProductsOfCollection() {

	var collectionId = "qVlpiQgFC6";

	var query = new Parse.Query("Collections");
	query.equalTo("objectId", collectionId);
	query.include("product_ids");

	query.find({
		success: function (collection) {
			console.log(collection[0].get("product_ids"));
			//deleteProductFromCollection(collection[0].get("product_ids")[0], collection[0]);
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}

//test function
function getAllServicesOfCollection(collectionId) {

	var query = new Parse.Query("Collections");
	query.equalTo("objectId", collectionId);
	query.include("service_ids");

	query.find({
		success: function (collection) {
			console.log(collection[0].get("service_ids"));
			//addStoreToCollection(collection[0].get("store_ids")[0], collection[0]);
		},
		error: function (error) {
			console.log(error);
		}
	});
}

//test function
function getAllStoresOfCollection() {

	var collectionId = "jk7briy5lx";

	var query = new Parse.Query("Collections");
	query.equalTo("objectId", collectionId);
	query.include("store_ids");

	query.find({
		success: function (collection) {
			console.log(collection[0].get("store_ids"));
			//addStoreToCollection(collection[0].get("store_ids")[0], collection[0]);
		},
		error: function (error) {
			console.log(error);
		}
	});
}


//done not tested
function deleteProductFromCollection(product, collection) {

	collection.remove("product_ids", product);
	collection.save(null, {
		success: function (object) {
			console.log("Remove Product");
		},
		error: function (error, message) {
			console.log(message);
		}
	});

	product.remove("collections", collection);
	product.save(null, {
		success: function (object) {
			console.log("Removed From Collection");
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}

//done not tested
function deleteServiceFromCollection(service, collection) {

	collection.remove("service_ids", service);
	collection.save(null, {
		success: function (object) {
			console.log("Removed Service");
		},
		error: function (error, message) {
			console.log(message);
		}
	});

	service.remove("collections", collection);
	service.save(null, {
		success: function (object) {
			console.log("Removed From Collection");
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}

//done not tested
function deleteStoreFromCollection(store, collection) {

	collection.remove("store_ids", store);
	collection.save(null, {
		success: function (object) {
			console.log("Removed Store");
		},
		error: function (error, message) {
			console.log(message);
		}
	});

	store.remove("collections", collection);
	store.save(null, {
		success: function (object) {
			console.log("Removed from Collection");
		},
		error: function (error, message) {
			console.log(message);
		}
	});
}