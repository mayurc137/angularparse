var appControllers = angular.module('landingPageControllers', []);

appControllers.controller('homeCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route',
    function($q, $scope, ParseFactory, $rootScope, $route) {

        ParseFactory.init();

        $rootScope.seo = {};
        $rootScope.seo.pageTitle = "Klassy - Discover and engage with local stores and service providers";
        $rootScope.seo.description = "Gallery of the page";
        $rootScope.seo.keywords = "keyword1,keyword2";

        $scope.currentUser = ParseFactory.getCurrentUser();

        $scope.userSignedUp = false;
        $scope.storeSignedUp = false;

        $scope.store = {};
        $scope.store.city = "Pune";

        $scope.signUpSuccess = "Thanks for Signing Up for Beta! We will get back to you soon!";

        $scope.cities = ["Pune", "Mumbai", "Delhi", "Bangalore", "Chennai"];

        if ($scope.currentUser) {
            ParseFactory.logOut();
        }

        $scope.noFbEmail = false;
        $scope.emailTaken = false;
        $scope.invalidEmail = "";

        /* Functions to Handle User Login*/
        $scope.handleLogin = function() {
            ParseFactory.fbLogin().then(
                function(user) {
                    if (!user.infoSet) {
                        $scope.getUserDetails();
                        console.log("new user");
                    } else {
                        /* Previous User has returned, logOut ad display already signed up message*/
                        $scope.signUpSuccess = "You are already signed up for Beta! We will get back to you soon!";
                        $scope.userSignedUp = true;
                        console.log("Previous User");
                    }
                }, function(message) {
                    console.log(message);
                }
            );
        }

        $scope.handleLogOut = function() {
            ParseFactory.logOut();
        }

        $scope.getUserDetails = function() {
            console.log("Getting User Data");
            ParseFactory.getUserData().then(
                function(userData) {
                    ParseFactory.getUserPicture().then(
                        function(picture) {
                            userData.picture = picture;
                            $scope.setUserDetails(userData);
                        }, function(message) {
                            console.log(message);
                        }
                    );
                }, function(message) {
                    console.log(message);
                }
            );
        }

        $scope.setUserEmail = function(email) {

            ParseFactory.setUserEmail(email).then(
                function(user) {

                    $scope.userSignedUp = true;
                    $scope.noFbEmail = false;
                    $scope.emailTaken = false;

                    ParseFactory.mailChimpListAddUser(user).then(
                        function(result) {
                            console.log("Added to MailChimp");
                            $scope.userEmail = "";
                            $scope.ownerEmail = "";
                        }, function(error) {
                            console.log(error);
                        }
                    );

                }, function(message) {
                    console.log(message);

                    $scope.userSignedUp = true;
                    $scope.noFbEmail = false;
                    $scope.emailTaken = false;

                    if (message.code == 203) {
                        $scope.invalidEmail = email;
                        $scope.emailTaken = true;
                    }
                }
            );
        }

        $scope.declineEmail = function() {
            $scope.noFbEmail = false;
            $scope.userEmail = "";
        }

        $scope.ownerDecline = function() {
            //In this case we must just add the storeOwner Email to mailChimp
            //Need to write a mailChimp function which receives user data in the form of a json
            //and adds it to the list
            ParseFactory.mailChimpListAddUserEmail($scope.currentUser, $scope.invalidEmail).then(
                function(success) {
                    console.log(success);
                    $scope.emailTaken = false;
                    $scope.invalidEmail = "";
                }, function(error) {
                    console.log(error);
                    $scope.emailTaken = false;
                    $scope.invalidEmail = "";
                }
            );
        }

        $scope.setUserDetails = function(userDetails) {

            console.log("Setting User Data");
            ParseFactory.setUserData(userDetails).then(
                function(user) {
                    $scope.currentUser = user;
                    console.log(userDetails.email);
                    if (userDetails.email == undefined) {
                        console.log("Show Pop Up!");
                        $scope.noFbEmail = true;
                    } else {
                        ParseFactory.mailChimpListAddUser(user).then(
                            function(result) {
                                console.log("Added to MailChimp");
                                console.log(result);
                                $scope.userSignedUp = true;
                            }, function(error) {
                                console.log(error);
                            }
                        );
                    }

                }, function(message) {
                    console.log(message);

                    //Handle the error where the email is already with another user
                    if (message.code == 203) {
                        $scope.invalidEmail = userDetails.email;
                        $scope.emailTaken = true;
                        userDetails.email = undefined;
                        ParseFactory.setUserData(userDetails).then(
                            function(user) {
                                console.log("User added without email");
                                $scope.currentUser = user;
                            }, function(message) {
                                console.log(message)
                            }
                        );

                    }

                }
            );
        }

        $scope.shareToFb = function() {
            ParseFactory.shareToFb("www.klassy.in");
        }


        $scope.storeRequest = function() {

            console.log($scope.store);

            ParseFactory.createStoreRequest($scope.store).then(
                function(success) {
                    //This is to refresh the form
                    $scope.store = {};
                    $scope.store.city = "Pune";
                    $scope.storeForm.$setPristine();
                    $scope.storeForm.$setUntouched();
                    $scope.storeSignedUp = true;
                    console.log(success);

                }, function(message) {
                    console.log(message);
                }
            );
        }

    }
]);


appControllers.controller('businessCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route',
    function($q, $scope, ParseFactory, $rootScope, $route) {

        ParseFactory.init();

        $rootScope.seo = {};
        $rootScope.seo.pageTitle = "Klassy for Businesses";
        $rootScope.seo.description = "Gallery of the page";
        $rootScope.seo.keywords = "keyword1,keyword2";

        $scope.storeSignedUp = false;

        $scope.store = {};
        $scope.store.city = "Pune";

        $scope.cities = ["Pune", "Mumbai", "Delhi", "Bangalore", "Chennai"];

        $scope.storeRequest = function() {

            console.log($scope.store);

            ParseFactory.createStoreRequest($scope.store).then(
                function(success) {
                    //This is to refresh the form
                    $scope.store = {};
                    $scope.store.city = "Pune";
                    $scope.storeForm.$setPristine();
                    $scope.storeForm.$setUntouched();
                    $scope.storeSignedUp = true;
                    console.log(success);

                }, function(message) {
                    console.log(message);
                }
            );
        }

    }
]);

appControllers.controller('betaCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route',
    function($q, $scope, ParseFactory, $rootScope, $route) {

        ParseFactory.init();

        $rootScope.seo = {};
        $rootScope.seo.pageTitle = "Klassy - Join the Beta";
        $rootScope.seo.description = "Gallery of the page";
        $rootScope.seo.keywords = "keyword1,keyword2";

        $scope.currentUser = ParseFactory.getCurrentUser();

        $scope.userSignedUp = false;

        $scope.signUpSuccess = "Thanks for Signing Up for Beta! We will get back to you soon!";

        $scope.noFbEmail = false;
        $scope.emailTaken = false;
        $scope.invalidEmail = "";

        if ($scope.currentUser) {
            ParseFactory.logOut();
        }

        /* Functions to Handle User Login*/
        $scope.handleLogin = function() {
            ParseFactory.fbLogin().then(
                function(user) {
                    if (!user.infoSet) {
                        $scope.getUserDetails();
                        console.log("new user");
                    } else {
                        /* Previous User has returned, logOut ad display already signed up message*/
                        $scope.signUpSuccess = "You are already signed up for Beta! We will get back to you soon!";
                        $scope.userSignedUp = true;
                        console.log("Previous User");
                    }
                }, function(message) {
                    console.log(message);
                }
            );
        }

        $scope.handleLogOut = function() {
            ParseFactory.logOut();
        }

        $scope.getUserDetails = function() {
            console.log("Getting User Data");
            ParseFactory.getUserData().then(
                function(userData) {
                    ParseFactory.getUserPicture().then(
                        function(picture) {
                            userData.picture = picture;
                            $scope.setUserDetails(userData);
                        }, function(message) {
                            console.log(message);
                        }
                    );
                }, function(message) {
                    console.log(message);
                }
            );
        }

        $scope.setUserEmail = function(email) {

            ParseFactory.setUserEmail(email).then(
                function(user) {

                    $scope.userSignedUp = true;
                    $scope.noFbEmail = false;
                    $scope.emailTaken = false;

                    ParseFactory.mailChimpListAddUser(user).then(
                        function(result) {
                            console.log("Added to MailChimp");
                            $scope.userEmail = "";
                            $scope.ownerEmail = "";
                        }, function(error) {
                            console.log(error);
                        }
                    );

                }, function(message) {
                    console.log(message);

                    $scope.userSignedUp = true;
                    $scope.noFbEmail = false;
                    $scope.emailTaken = false;

                    if (message.code == 203) {
                        $scope.invalidEmail = email;
                        $scope.emailTaken = true;
                    }
                }
            );
        }

        $scope.declineEmail = function() {
            $scope.noFbEmail = false;
            $scope.userEmail = "";
        }

        $scope.ownerDecline = function() {
            //In this case we must just add the storeOwner Email to mailChimp
            //Need to write a mailChimp function which receives user data in the form of a json
            //and adds it to the list
            ParseFactory.mailChimpListAddUserEmail($scope.currentUser, $scope.invalidEmail).then(
                function(success) {
                    console.log(success);
                    $scope.emailTaken = false;
                    $scope.invalidEmail = "";
                }, function(error) {
                    console.log(error);
                    $scope.emailTaken = false;
                    $scope.invalidEmail = "";
                }
            );
        }

        $scope.setUserDetails = function(userDetails) {

            console.log("Setting User Data");
            ParseFactory.setUserData(userDetails).then(
                function(user) {
                    $scope.currentUser = user;
                    console.log(userDetails.email);
                    if (userDetails.email == undefined) {
                        console.log("Show Pop Up!");
                        $scope.noFbEmail = true;
                    } else {
                        ParseFactory.mailChimpListAddUser(user).then(
                            function(result) {
                                console.log("Added to MailChimp");
                                console.log(result);
                                $scope.userSignedUp = true;
                            }, function(error) {
                                console.log(error);
                            }
                        );
                    }

                }, function(message) {
                    console.log(message);

                    //Handle the error where the email is already with another user
                    if (message.code == 203) {
                        $scope.invalidEmail = userDetails.email;
                        $scope.emailTaken = true;
                        userDetails.email = undefined;
                        ParseFactory.setUserData(userDetails).then(
                            function(user) {
                                console.log("User added without email");
                                $scope.currentUser = user;
                            }, function(message) {
                                console.log(message)
                            }
                        );

                    }

                }
            );
        }

        $scope.shareToFb = function() {
            ParseFactory.shareToFb("www.klassy.in");
        }

    }
]);

appControllers.controller('aboutCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route',
    function($q, $scope, ParseFactory, $rootScope, $route) {

        ParseFactory.init();

        $rootScope.seo = {};
        $rootScope.seo.pageTitle = "Klassy | About";
        $rootScope.seo.description = "Gallery of the page";
        $rootScope.seo.keywords = "keyword1,keyword2";

    }
]);




appControllers.controller('contactCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route',
    function($q, $scope, ParseFactory, $rootScope, $route) {

        ParseFactory.init();

        $rootScope.seo = {};
        $rootScope.seo.pageTitle = "Klassy | Contact";
        $rootScope.seo.description = "Gallery of the page";
        $rootScope.seo.keywords = "keyword1,keyword2";

    }
]);

appControllers.controller('faqCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route',
    function($q, $scope, ParseFactory, $rootScope, $route) {

        ParseFactory.init();

        $rootScope.seo = {};
        $rootScope.seo.pageTitle = "Klassy | FAQ";
        $rootScope.seo.description = "Gallery of the page";
        $rootScope.seo.keywords = "keyword1,keyword2";

    }
]);