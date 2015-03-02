function init() {
	Parse.initialize("1ZeyYfTJAhabLrrRpu9AwT8bWlpU9W3Fj0hesIzN", "wl2trYAjBeN1X7BVroZJjEtTuuFdnb3gmKDGC0D0");
	console.log("Parse Initialized");
}

function logIn() {
	Parse.User.logIn("mayur", "mayur", {
		success: function (user) {
			console.log("Logged In");
		},
		error: function (user, error) {
			// The login failed. Check error to see why.
		}
	});
}

function getUserData(userId) {

	var query = new Parse.Query(Parse.User);
	query.equalTo("user_id", userId);
	query.include("collections");
	query.include("collections.store_ids");
	query.include("collections.product_ids");
	query.find({
		success: function (user) {

			// Syntax = user[0].get('name of column')
			console.log(user);
		},
		error: function (error, message) {
			console.log(message);
		}
	});

}

function getStoreDataByStoreId(storeid) {

	var query = new Parse.Query("Stores");
	query.equalTo("objectId", storeid);
	query.include("products");
	query.find({
		success: function (store) {
			console.table(store);
		},
		error: function (error) {
			console.log(error);
		}

	});
}

function getStoreDataByUserId(userid) {

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

}

function fetchGalleryOfStore(storeId) {

	var storequery = new Parse.Query("Stores");
	storequery.equalTo("objectId", storeId);

	//storequery.find({ success: function(store) { console.log(store);}})

	var query = new Parse.Query("Gallery");
	query.matchesQuery("store_id", storequery);
	query.find({
		success: function (gallery) {

			console.log(gallery[0].attributes.image._url);
		},
		error: function (error) {
			console.log(error);
		}
	});

}

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

function editStoreImagesToGallery() {

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

function createStore() {
	var Store = Parse.Object.extend("Stores");
	var store = new Store();
	store.save();
}

function addDetailsToStore() {

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
		});
	} else {
		console.log("No logo uploaded");
	}
}

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

function cloudFunction() {
	Parse.Cloud.run('hello', {}, {
		success: function (result) {
			console.log(result);
		},
		error: function (error) {}
	});
}

function addProduct() {

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
								},
								error: function (error, message) {
									console.log(message);
								}
							});

						},
						error: function (error) {
							console.log(error);
						}
					});
				});
			},
			error: function (error) {
				console.log(error);
			}

		});
	} else {
		console.log("No product picture selected");
	}
}

function editProduct() {
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
						},
						error: function (error, message) {
							console.log(message);
						}
					});
				});
			},
			error: function (error, message) {
				console.log(message);
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
}

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

function deleteProduct(productId) {
	var Product = Parse.Object.extend("Products");
	var query = new Parse.Query(Product);
	query.get(productId, {
		success: function (myObj) {
			// The object was retrieved successfully.
			myObj.destroy({});
		},
		error: function (object, error) {
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and description.
		}
	});
}

function createCollection() {

	var collectionDetails = {
		type: "Product",
		upvote_count: 0,
		created_by: "OHjLjnyS4K",
		no_comments: 0
	};

	var query = new Parse.Query(Parse.User);
	query.get(collectionDetails.created_by, {
		success: function (user) {
			var Collection = Parse.Object.extend("Collections");
			var collection = new Collection();
			collection.set("type", collectionDetails.type);
			collection.set("upvote_count", collectionDetails.upvote_count);
			collection.set("created_by", user);
			collection.set("no_comments", collectionDetails.no_comments);

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


		},
		error: function (error) {
			console.log(error);
		}
	});
}


function addProductToCollection() {

	var productId = 'NxjRdXlSVy';
	var collectionId = 'qVlpiQgFC6';
	var productquery = new Parse.Query("Products");
	productquery.equalTo("objectId", productId);
	productquery.find({
		success: function (product) {
			var Collection = Parse.Object.extend("Collections");
			var query = new Parse.Query(Collection);
			query.get(collectionId, {
				success: function (collection) {
					// The object was retrieved successfully.
					collection.addUnique("product_ids", product[0]);
					collection.save(null, {
						success: function (object) {
							console.log(object);
						},
						error: function (error) {
							console.log(error);
						}
					});
				},
				error: function (object, error) {
					// The object was not retrieved successfully.
					// error is a Parse.Error with an error code and message.
					console.log(error);
				}
			});
		},
		error: function (error) {
			console.log(error);
		}
	});



}

function addStoreToCollection() {
	var storeId = 'Ik3uYT99O4';
	var collectionId = 'jk7briy5lx';
	var storequery = new Parse.Query("Stores");
	storequery.equalTo("objectId", storeId);
	storequery.find({
		success: function (store) {
			var Collection = Parse.Object.extend("Collections");
			var query = new Parse.Query(Collection);
			query.get(collectionId, {
				success: function (collection) {
					// The object was retrieved successfully.
					collection.addUnique("store_ids", store[0]);
					collection.save(null, {
						success: function (object) {
							console.log(object);
						},
						error: function (error) {
							console.log(error);
						}
					});
				},
				error: function (object, error) {
					// The object was not retrieved successfully.
					// error is a Parse.Error with an error code and message.
					console.log(error);
				}
			});
		},
		error: function (error) {
			console.log(error);
		}
	});
}

function getAllProductsOfCollection() {

	var collectionId = "wLE4KuCz1G";

	var query = new Parse.Query("Collections");
	query.equalTo("objectId", collectionId);
	query.include("product_ids");

	query.find({
		success: function (products) {
			console.log(products[0].get("product_ids"));
		},
		error: function (error) {
			console.log(error);
		}
	});
}

function getAllStoresOfCollection() {

	var collectionId = "jk7briy5lx";

	var query = new Parse.Query("Collections");
	query.equalTo("objectId", collectionId);
	query.include("store_ids");

	query.find({
		success: function (store) {
			console.log(store[0].get("store_ids"));
		},
		error: function (error) {
			console.log(error);
		}
	});
}

function getAllStoreCollectionOfUser(userId) {

	var userquery = new Parse.Query(Parse.User);
	userquery.equalTo("objectId", userId);

	var query = new Parse.Query("Collections");
	query.matchesQuery("created_by", userquery);
	query.equalTo("type", "Store");
	query.include("store_ids");

	query.find({
		success: function (store) {
			console.log(store);
		},
		error: function (error) {

		}
	});
}

function getAllProductCollectionOfUser(userId) {

	var userquery = new Parse.Query(Parse.User);
	userquery.equalTo("objectId", userId);

	var query = new Parse.Query("Collections");
	query.matchesQuery("created_by", userquery);
	query.equalTo("type", "Product");
	query.include("product_ids");

	query.find({
		success: function (product) {
			console.log(product);
		},
		error: function (error) {

		}
	});
}