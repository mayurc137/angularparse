// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("followUsers", function (request, response) {

	var user1query = new Parse.Query(Parse.User);

	user1query.get(request.params.user1, {
		success: function (user1) {
			var user2query = new Parse.Query(Parse.User);
			user2query.get(request.params.user2, {
				success: function (user2) {
					user1.addUnique("user_followed", user2);
					user1.save(null, {
						success: function (object) {
							user2.addUnique("followers", user1);
							user2.save(null, {
								useMasterKey: true
							}).then(function (user) {
								response.success(user);
							}, function (error) {
								response.error(error);
							});
						},
						error: function (error, message) {
							response.error(message);
						}
					});
				},
				error: function (error, message) {
					response.error(message);
				}
			});
		},
		error: function (error, message) {
			response.error(message);
		}
	});

});

Parse.Cloud.define("unfollowUsers", function (request, response) {

	var user1query = new Parse.Query(Parse.User);

	user1query.get(request.params.user1, {
		success: function (user1) {
			var user2query = new Parse.Query(Parse.User);
			user2query.get(request.params.user2, {
				success: function (user2) {
					user1.remove("user_followed", user2);
					user1.save(null, {
						success: function (object) {
							user2.remove("followed", user1);
							user2.save(null, {
								useMasterKey: true
							}).then(function (user) {
								response.success(user);
							}, function (error) {
								response.error(error);
							});
						},
						error: function (error, message) {
							response.error(message);
						}
					});
				},
				error: function (error, message) {
					response.error(message);
				}
			});
		},
		error: function (error, message) {
			response.error(message);
		}
	});

});


/*Parse.Cloud.define("lemmatize", function (request, response) {


    var lemma = require('cloud/lemmatizer.js');
    var _ = require('underscore');

    var metadata = request.params.meta;
    var lemmatizer = new lemma.Lemmatizer();

    var words = metadata;

    var toLowerCase = function (w) {
        return w.toLowerCase();
    };

    var words = metadata;
    words = _.map(words, toLowerCase);
    var stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt", "it", "its", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "were", "werent", "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"]
    words = _.filter(words, function (w) {
        return w.match(/^\w+$/) && !_.contains(stopWords, w);
    });

    words = _.uniq(words);

    lemmatizer.initialize().then(
        function (success) {
            for (var i = 0; i < words.length; i++) {
                words[i] = lemmatizer.lemmas(words[i], 'verb')[0][0];
            }
            response.success(words);
        }, function (error) {
            response.error(error);
        }
    );

});*/

Parse.Cloud.define("editStoreAdmin", function (request, response) {

	var query = new Parse.Query(Parse.User);
	var ownerDetails = request.params.ownerDetails;
	query.get(request.params.user, {
		success: function (user) {

			user.set("name", ownerDetails.name);
			user.set("email", ownerDetails.email);
			user.set("phone", ownerDetails.phone);
			var query = new Parse.Query("Stores");
			query.get(ownerDetails.store_id, {
				success: function (store) {
					user.addUnique("store_ids", store);

					user.save(null, {
						useMasterKey: true
					}).then(function (user) {
						response.success(user);
					}, function (error) {
						response.error(error.message);
					});
				},
				error: function (error, message) {
					response.error(message);
				}
			});
		},
		error: function (error, message) {
			response.error(message);
		}
	});
});

Parse.Cloud.define("editStoreManager", function (request, response) {

	var query = new Parse.Query(Parse.User);
	var ownerDetails = request.params.ownerDetails;
	query.get(request.params.user, {
		success: function (user) {
			user.set("username", ownerDetails.username);
			user.set("name", ownerDetails.name);
			user.set("email", ownerDetails.email);
			user.set("phone", ownerDetails.phone);
			user.save(null, {
				useMasterKey: true
			}).then(function (user) {
				response.success(user);
			}, function (error) {
				response.error(error.message);
			});
		},
		error: function (error, message) {
			response.error(message);
		}
	});
});

Parse.Cloud.define("storeSignUpAdmin", function (request, response) {

	var length = 8,
		charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		retVal = "";

	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}

	var email = request.params.email;
	var phone = request.params.phone;
	var username = request.params.username;
	var store_id = request.params.store_id;
	var name = request.params.name;

	var user = new Parse.User();
	user.set("username", username);
	user.set("password", retVal);
	user.set("email", email);

	// other fields can be set just like with Parse.Object
	user.set("is_store", true);
	user.set("is_admin", true);
	user.set("phone", phone);
	user.set("name", name);

	var query = new Parse.Query("Stores");
	query.get(store_id, {
		success: function (store) {

			user.addUnique("store_ids", store);

			user.signUp(null, {
				success: function (user) {
					Parse.User.requestPasswordReset(user.get("email"), {
						success: function () {
							response.success(true);
						},
						error: function (error) {
							console.error("Error: " + error.code + " " + error.message);
							resonse.error(error.message);
						}
					});
				},
				error: function (user, error) {
					console.log(error);
					response.error(error);
				}
			});
		},
		error: function (error, message) {
			console.error(message);
			response.error(message);
		}
	});
});


Parse.Cloud.define("storeSignUpManager", function (request, response) {

	var length = 8,
		charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		retVal = "";

	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}


	var email = request.params.email;
	var phone = request.params.phone;
	var username = request.params.username;
	var store_id = request.params.store_id;
	var name = request.params.name;

	var user = new Parse.User();
	user.set("username", username);
	user.set("password", retVal);
	user.set("email", email);

	// other fields can be set just like with Parse.Object
	user.set("is_store", true);
	user.set("is_admin", false);
	user.set("phone", phone);
	user.set("name", name);

	var query = new Parse.Query("Stores");
	query.get(store_id, {
		success: function (store) {

			user.addUnique("store_ids", store);

			user.signUp(null, {
				success: function (user) {
					Parse.User.requestPasswordReset(user.get("email"), {
						success: function () {
							response.success(true);
						},
						error: function (error) {
							console.error("Error: " + error.code + " " + error.message);
							resonse.error(error.message);
						}
					});
				},
				error: function (user, error) {
					console.log(error);
					response.error(error);
				}
			});
		},
		error: function (error, message) {
			console.error(message);
			response.error(message);
		}
	});
});

/*Parse.Cloud.beforeSave(Parse.User, function (request, response) {

    var query = new Parse.Query(Parse.User);
    query.equalTo("email", request.object.get("email"));
    query.first({
        success: function (object) {
            if (object) {
                response.error("The Email already exists");
            } else {
                response.success();
            }
        },
        error: function (error) {
            response.error(error);
        }
    });

});*/

Parse.Cloud.afterSave("Stores", function (request) {

	if (request.object.get("dirty_bit") == false) {
		var lemma = require('cloud/lemmatizer.js');
		var _ = require('underscore');

		var metadata = [];

		var store = request.object;

		//console.log(store);
		var id = store.id;
		//console.log(id);
		var query = new Parse.Query("Stores");
		query.include("locality");
		query.include("primary_category");
		query.include("tags");
		query.equalTo("objectId", id);
		query.find({
			success: function (store) {
				//console.log(store);
				var store = store[0];
				//console.log(store.get("tags"));
				var address = store.get("address");
				address = address.replace(/[^a-zA-Z0-9 ]/g, "");
				address = address.split(" ");
				metadata.push.apply(metadata, address);

				var locality_name = store.get("locality").get("locality_name");
				locality_name = locality_name.replace(/[^a-zA-Z ]/g, "");
				locality_name = locality_name.split(" ");
				metadata.push.apply(metadata, locality_name);

				var category = store.get("primary_category").get("categoryName");
				category = category.replace(/[^a-zA-Z0-9 ]/g, "");
				category = category.split(" ");
				metadata.push.apply(metadata, category);

				var description = store.get("description");
				description = description.replace(/[^a-zA-Z0-9 ]/g, "");
				description = description.split(" ");
				metadata.push.apply(metadata, description);

				var tags = store.get("tags");
				//console.log(tags);
				for (var i = 0; i < tags.length; i++) {
					var tag = tags[i].get("tag_description").replace(/[^a-zA-Z0-9 ]/g, "");
					tag = tag.split(" ");
					metadata.push.apply(metadata, tag);
				}

				var lemmatizer = new lemma.Lemmatizer();

				var toLowerCase = function (w) {
					return w.toLowerCase();
				};

				console.log(metadata);
				var words = metadata;
				words = _.map(words, toLowerCase);
				var stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt", "it", "its", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "were", "werent", "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"]
				words = _.filter(words, function (w) {
					return w.match(/^\w+$/) && !_.contains(stopWords, w);
				});

				words = _.uniq(words);
				lemmatizer.initialize().then(
					function (success) {
						for (var i = 0; i < words.length; i++) {
							console.log(words[i]);
							words[i] = lemmatizer.lemmas(words[i], 'verb')[0][0];
						}

						var store_name = store.get("name");
						store_name = store_name.replace(/[^a-zA-Z0-9 ]/g, "");
						store_name = store_name.toLowerCase();
						store_name = store_name.split(" ");
						var store_handle = store.get("store_handle");
						store.set("metadata", words);
						store.addUnique("metadata", store_handle);
						for (var i = 0; i < store_name.length; i++) {
							store.addUnique("metadata", store_name[i]);
						}

						//  console.log(words);
						store.set("dirty_bit", true);
						store.save(null, {
							success: function (store) {
								console.log("Saved");
							},
							error: function (error, message) {
								console.error(message);
							}
						});
						//response.success();

					}, function (error) {
						console.error("Got an error " + error.code + " : " + error.message);
					}
				);
			},
			error: function (error, message) {
				console.error(message);
			}

		});
	}
});


Parse.Cloud.beforeSave("Products", function (request, response) {

	var lemma = require('cloud/lemmatizer.js');
	var _ = require('underscore');

	var product = request.object;
	var store = product.get("store_id");
	if (product.isNew() == false) {
		var query = new Parse.Query("Products");
		query.include("store_id");
		query.get(product.id, {
			success: function (product) {
				var prevMetaData = product.get("store_id").get("product_metadata");
				var name = product.get("name");
				if (name != undefined) {
					name = name.split(" ");
					for (var i = 0; i < name.length; i++) {
						var index = prevMetaData.indexOf(name[i]);
						prevMetaData.splice(index, 1);
						//store.remove("product_metadata", name[i]);
					}
				}
				var metadata = [];
				var description = product.get("description");
				if (description != undefined) {
					description = description.replace(/[^a-zA-Z0-9 ]/g, "");
					description = description.split(" ");
					metadata.push.apply(metadata, description);
				}
				var lemmatizer = new lemma.Lemmatizer();

				var toLowerCase = function (w) {
					return w.toLowerCase();
				};

				var words = metadata;
				words = _.map(words, toLowerCase);
				var stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt", "it", "its", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "were", "werent", "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"]
				words = _.filter(words, function (w) {
					return w.match(/^\w+$/) && !_.contains(stopWords, w);
				});

				words = _.uniq(words);
				lemmatizer.initialize().then(
					function (success) {
						for (var i = 0; i < words.length; i++) {
							words[i] = lemmatizer.lemmas(words[i], 'verb')[0][0];
						}


						if (store != undefined) {
							for (var i = 0; i < words.length; i++) {
								var index = prevMetaData.indexOf(words[i]);
								prevMetaData.splice(index, 1);
								//store.remove("product_metadata", words[i]);
							}

							store.set("product_metadata", prevMetaData);
							store.save(null, {
								success: function (store) {
									console.log("Saved");
								},
								error: function (error, message) {
									console.error(message);
								}
							});
						}
						response.success();

					}, function (error) {
						console.error("Got an error " + error.code + " : " + error.message);
						response.error(error);
					}
				);
			},
			error: function (error) {
				response.error(error);
			}
		});
	} else {
		response.success();
	}
});

Parse.Cloud.beforeSave("Services", function (request, response) {

	var lemma = require('cloud/lemmatizer.js');
	var _ = require('underscore');

	var service = request.object;
	var store = service.get("store_id");
	if (service.isNew() == false) {
		var query = new Parse.Query("Services");
		query.include("store_id");
		query.get(service.id, {
			success: function (service) {
				var prevMetaData = service.get("store_id").get("service_metadata");
				var name = service.get("name");
				if (name != undefined) {
					name = name.split(" ");
					for (var i = 0; i < name.length; i++) {
						var index = prevMetaData.indexOf(name[i]);
						prevMetaData.splice(index, 1);
						//store.remove("product_metadata", name[i]);
					}
				}
				var metadata = [];
				var description = service.get("description");
				if (description != undefined) {
					description = description.replace(/[^a-zA-Z0-9 ]/g, "");
					description = description.split(" ");
					metadata.push.apply(metadata, description);
				}
				var lemmatizer = new lemma.Lemmatizer();

				var toLowerCase = function (w) {
					return w.toLowerCase();
				};

				var words = metadata;
				words = _.map(words, toLowerCase);
				var stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt", "it", "its", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "were", "werent", "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"]
				words = _.filter(words, function (w) {
					return w.match(/^\w+$/) && !_.contains(stopWords, w);
				});

				words = _.uniq(words);
				lemmatizer.initialize().then(
					function (success) {
						for (var i = 0; i < words.length; i++) {
							words[i] = lemmatizer.lemmas(words[i], 'verb')[0][0];
						}


						if (store != undefined) {
							for (var i = 0; i < words.length; i++) {
								var index = prevMetaData.indexOf(words[i]);
								prevMetaData.splice(index, 1);
								//store.remove("product_metadata", words[i]);
							}

							store.set("service_metadata", prevMetaData);
							store.save(null, {
								success: function (store) {
									console.log("Saved");
								},
								error: function (error, message) {
									console.error(message);
								}
							});
						}
						response.success();

					}, function (error) {
						console.error("Got an error " + error.code + " : " + error.message);
						response.error(error);
					}
				);
			},
			error: function (error) {
				response.error(error);
			}
		});
	} else {
		response.success();
	}
});

Parse.Cloud.afterSave("Products", function (request) {

	var lemma = require('cloud/lemmatizer.js');
	var _ = require('underscore');

	var metadata = [];

	var product = request.object;

	console.log(product);
	var store = product.get("store_id");

	var description = product.get("description");
	description = description.replace(/[^a-zA-Z0-9 ]/g, "");
	description = description.split(" ");
	metadata.push.apply(metadata, description);

	var lemmatizer = new lemma.Lemmatizer();

	var toLowerCase = function (w) {
		return w.toLowerCase();
	};

	var words = metadata;
	words = _.map(words, toLowerCase);
	var stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt", "it", "its", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "were", "werent", "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"]
	words = _.filter(words, function (w) {
		return w.match(/^\w+$/) && !_.contains(stopWords, w);
	});

	words = _.uniq(words);
	lemmatizer.initialize().then(
		function (success) {
			for (var i = 0; i < words.length; i++) {
				words[i] = lemmatizer.lemmas(words[i], 'verb')[0][0];
			}

			for (var i = 0; i < words.length; i++) {
				store.add("product_metadata", words[i]);
			}
			var name = product.get("name");
			name = name.split(" ");
			for (var i = 0; i < name.length; i++) {
				store.add("product_metadata", name[i]);
			}

			store.save(null, {
				success: function (store) {
					console.log("Saved");
				},
				error: function (error, message) {
					console.error(message);
				}
			});
			//response.success();

		}, function (error) {
			console.error("Got an error " + error.code + " : " + error.message);
		}
	);
});

Parse.Cloud.afterSave("Services", function (request) {

	var lemma = require('cloud/lemmatizer.js');
	var _ = require('underscore');

	var metadata = [];

	var service = request.object;

	console.log(service);
	var store = service.get("store_id");

	var description = service.get("description");
	description = description.replace(/[^a-zA-Z0-9 ]/g, "");
	description = description.split(" ");
	metadata.push.apply(metadata, description);

	var lemmatizer = new lemma.Lemmatizer();

	var toLowerCase = function (w) {
		return w.toLowerCase();
	};

	var words = metadata;
	words = _.map(words, toLowerCase);
	var stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt", "it", "its", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "were", "werent", "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"]
	words = _.filter(words, function (w) {
		return w.match(/^\w+$/) && !_.contains(stopWords, w);
	});

	words = _.uniq(words);
	lemmatizer.initialize().then(
		function (success) {
			for (var i = 0; i < words.length; i++) {
				words[i] = lemmatizer.lemmas(words[i], 'verb')[0][0];
			}

			for (var i = 0; i < words.length; i++) {
				store.add("service_metadata", words[i]);
			}
			var name = service.get("name");
			name = name.split(" ");
			for (var i = 0; i < name.length; i++) {
				store.add("service_metadata", name[i]);
			}

			store.save(null, {
				success: function (store) {
					console.log("Saved");
				},
				error: function (error, message) {
					console.error(message);
				}
			});
			//response.success();

		}, function (error) {
			console.error("Got an error " + error.code + " : " + error.message);
		}
	);
});

Parse.Cloud.beforeDelete("Products", function (request, response) {

	var lemma = require('cloud/lemmatizer.js');
	var _ = require('underscore');

	var product = request.object;
	var store = product.get("store_id");
	var query = new Parse.Query("Stores");
	query.get(store.id, {
		success: function (store) {
			var name = product.get("name");
			name = name.split(" ");

			var prevMetaData = store.get("product_metadata");
			console.log(prevMetaData);
			for (var i = 0; i < name.length; i++) {
				var index = prevMetaData.indexOf(name[i]);
				prevMetaData.splice(index, 1);
				//store.remove("service_metadata", name[i]);
			}

			var metadata = [];
			var description = product.get("description");
			description = description.replace(/[^a-zA-Z0-9 ]/g, "");
			description = description.split(" ");
			metadata.push.apply(metadata, description);

			var lemmatizer = new lemma.Lemmatizer();

			var toLowerCase = function (w) {
				return w.toLowerCase();
			};

			var words = metadata;
			words = _.map(words, toLowerCase);
			var stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt", "it", "its", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "were", "werent", "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"]
			words = _.filter(words, function (w) {
				return w.match(/^\w+$/) && !_.contains(stopWords, w);
			});

			words = _.uniq(words);
			lemmatizer.initialize().then(
				function (success) {
					for (var i = 0; i < words.length; i++) {
						words[i] = lemmatizer.lemmas(words[i], 'verb')[0][0];
					}

					for (var i = 0; i < words.length; i++) {
						var index = prevMetaData.indexOf(words[i]);
						prevMetaData.splice(index, 1);
						//store.remove("service_metadata", words[i]);
					}

					store.set("product_metadata", prevMetaData);
					store.save(null, {
						success: function (store) {
							console.log("Saved");
						},
						error: function (error, message) {
							console.error(message);
						}
					});

					response.success();

				}, function (error) {
					console.error("Got an error " + error.code + " : " + error.message);
					response.error(error);
				}
			);
		},
		error: function (error, message) {
			console.log(message);
			response.success();
		}
	});
});

Parse.Cloud.beforeDelete("Services", function (request, response) {

	var lemma = require('cloud/lemmatizer.js');
	var _ = require('underscore');

	var service = request.object;
	var store = service.get("store_id");
	var query = new Parse.Query("Stores");
	query.get(store.id, {
		success: function (store) {
			var name = service.get("name");
			name = name.split(" ");

			var prevMetaData = store.get("service_metadata");
			console.log(prevMetaData);
			for (var i = 0; i < name.length; i++) {
				var index = prevMetaData.indexOf(name[i]);
				prevMetaData.splice(index, 1);
				//store.remove("service_metadata", name[i]);
			}

			var metadata = [];
			var description = service.get("description");
			description = description.replace(/[^a-zA-Z0-9 ]/g, "");
			description = description.split(" ");
			metadata.push.apply(metadata, description);

			var lemmatizer = new lemma.Lemmatizer();

			var toLowerCase = function (w) {
				return w.toLowerCase();
			};

			var words = metadata;
			words = _.map(words, toLowerCase);
			var stopWords = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could", "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from", "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here", "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in", "into", "is", "isnt", "it", "its", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that", "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd", "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasnt", "we", "wed", "well", "were", "weve", "were", "werent", "what", "whats", "when", "whens", "where", "wheres", "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd", "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"]
			words = _.filter(words, function (w) {
				return w.match(/^\w+$/) && !_.contains(stopWords, w);
			});

			words = _.uniq(words);
			lemmatizer.initialize().then(
				function (success) {
					for (var i = 0; i < words.length; i++) {
						words[i] = lemmatizer.lemmas(words[i], 'verb')[0][0];
					}

					for (var i = 0; i < words.length; i++) {
						var index = prevMetaData.indexOf(words[i]);
						prevMetaData.splice(index, 1);
						//store.remove("service_metadata", words[i]);
					}

					store.set("service_metadata", prevMetaData);
					store.save(null, {
						success: function (store) {
							console.log("Saved");
						},
						error: function (error, message) {
							console.error(message);
						}
					});

					response.success();

				}, function (error) {
					console.error("Got an error " + error.code + " : " + error.message);
					response.error(error);
				}
			);
		},
		error: function (error, message) {
			console.log(message);
			response.success();
		}
	});


});



Parse.Cloud.afterSave("Messages", function (request) {

	var messageId = request.object;
	var prevMessage = messageId.get("prevMessage");


	var user = messageId.get("userId");
	var store = messageId.get("storeId");


	if (prevMessage != null) {
		user.remove("messages", prevMessage);
		user.save(null, {
			useMasterKey: true
		}).then(function (user) {
			console.log("Not Null Prev Message");
		}, function (error) {
			console.error(error);
		});
	}

	user.addUnique("messages", messageId);
	user.save(null, {
		useMasterKey: true
	}).then(function (user) {
		console.log(user);
	}, function (error) {
		console.error(error);
	});


	if (prevMessage != null) {
		store.remove("messages", prevMessage);
		store.save(null, {
			success: function (store) {
				console.log("Success");
			},
			error: function (error, message) {
				console.error(message);
			}
		});
	}

	store.addUnique("messages", messageId);
	store.save(null, {
		success: function (store) {
			console.log("Success");
		},
		error: function (error, message) {
			console.error(message);
		}
	});

});

var mailchimpApiKey = "5d3ea0f5a5eda21f9fce2a97127b9c0e-us10";

Parse.Cloud.define("mailchimp", function (request, response) {

	var userId = request.params.userId;

	var query = new Parse.Query(Parse.User);

	query.get(userId, {
		success: function (user) {
			var email = user.get("email");
			var name = user.get("name").split(' ');
			var firstName = name[0];
			var lastName = name[name.length - 1];
			var mergevars = {
				FNAME: firstName,
				LNAME: lastName
			}

			var mailchimpData = {
				apikey: mailchimpApiKey,
				id: "4e7eeef587",
				email: {
					email: email
				},
				merge_vars: mergevars,
				double_optin: false
			}

			var url = "https://us10.api.mailchimp.com/2.0/lists/subscribe.json";

			Parse.Cloud.httpRequest({
				method: 'POST',
				url: url,
				body: JSON.stringify(mailchimpData),
				success: function (httpResponse) {
					console.log(httpResponse.text);
					response.success(true);
				},
				error: function (httpResponse) {
					console.error('Request failed with response code ' + httpResponse.status);
					console.error(httpResponse.text);
					response.error(httpResponse.text);
				}
			});
		},
		error: function (error, message) {
			console.error(message);
			response.error(message);
		}
	});
});

//This function is when we are giving the email and not retreiving from user object
Parse.Cloud.define("mailchimpAdd", function (request, response) {

	var userId = request.params.userId;
	var emailId = request.params.email;

	var query = new Parse.Query(Parse.User);

	query.get(userId, {
		success: function (user, email) {
			var name = user.get("name").split(' ');
			var firstName = name[0];
			var lastName = name[name.length - 1];
			var mergevars = {
				FNAME: firstName,
				LNAME: lastName
			}

			var mailchimpData = {
				apikey: mailchimpApiKey,
				id: "4e7eeef587",
				email: {
					email: emailId
				},
				merge_vars: mergevars,
				double_optin: false
			}

			var url = "https://us10.api.mailchimp.com/2.0/lists/subscribe.json";

			Parse.Cloud.httpRequest({
				method: 'POST',
				url: url,
				body: JSON.stringify(mailchimpData),
				success: function (httpResponse) {
					console.log(httpResponse.text);
					response.success(true);
				},
				error: function (httpResponse) {
					console.error('Request failed with response code ' + httpResponse.status);
					console.error(httpResponse.text);
					response.error(httpResponse.text);
				}
			});
		},
		error: function (error, message) {
			console.error(message);
			response.error(message);
		}
	});
});