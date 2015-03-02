var phonecatServices = angular.module('phonecatServices', ['parse-angular']);

phonecatServices.factory('Phone', [ '$q', function($q){
    
    var factory = {};
    
    factory.init = function(){
		Parse.initialize("VUbQxR3afNJLdLqa8OqwgDq61CCrAeaakJeQv2yZ", "us4rXa1JJEZMWT7hxZICF4sLGZ60ubK9JqCm6pmb");
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

    factory.getShoes = function(){
    
		var query = new Parse.Query("Products");
		query.equalTo("name", "shoe");
		query.find({
		  success: function(results) {
		    console.log("Successfully retrieved " + results.length + " shoes.");
		    // Do something with the returned Parse.Object values
		    for (var i = 0; i < results.length; i++) { 
		      var object = results[i];
		      console.log(object.id + ' - ' + object.get('name'));
		    }
		  },
		  error: function(error) {
		    console.log("Error: " + error.code + " " + error.message);
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

		return factory;
  	}

]);
