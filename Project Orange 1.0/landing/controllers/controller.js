var appControllers = angular.module('landingPageControllers', []);

appControllers.controller('homeCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route',
    function($q, $scope, ParseFactory, $routeScope, $route) {

        ParseFactory.init();

        $routeScope.pageTitle = "Klassy - discover and engage with local stores and service providers";

        $scope.currentUser = ParseFactory.getCurrentUser();

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
                        $scope.handleLogOut();
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
                            $scope.handleLogOut();
                            console.log(message);
                        }
                    );
                }, function(message) {
                    console.log(message);
                    $scope.handleLogOut();
                }
            );
        }

        $scope.setUserDetails = function(userDetails) {

            console.log("Setting User Data");
            ParseFactory.setUserData(userDetails).then(
                function(user) {
                    $scope.currentUser = user;

                    ParseFactory.mailChimpListAddUser(user).then(
                        function(result) {
                            console.log("Added to MailChimp");
                            console.log(result);
                            $scope.handleLogOut();
                            alert("You have successfully signed up!!");
                        }, function(error) {
                            console.log(error);
                            $scope.handleLogOut();
                        }
                    );

                }, function(message) {
                    console.log(message);

                    $scope.handleLogOut();
                }
            );
        }

    }
]);

appControllers.controller('aboutCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route',
    function($q, $scope, ParseFactory, $routeScope, $route) {

        ParseFactory.init();

        $routeScope.pageTitle = "Klassy | About";

    }
]);

appControllers.controller('betaCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route',
    function($q, $scope, ParseFactory, $routeScope, $route) {

        ParseFactory.init();

        $routeScope.pageTitle = "Klassy - Beta Joining Page";

    }
]);

appControllers.controller('businessCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route',
    function($q, $scope, ParseFactory, $routeScope, $route) {

        ParseFactory.init();

        $routeScope.pageTitle = "Klassy for Business";

    }
]);

appControllers.controller('contactCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route',
    function($q, $scope, ParseFactory, $routeScope, $route) {

        ParseFactory.init();

        $routeScope.pageTitle = "Klassy | Contact";

    }
]);

appControllers.controller('faqCtrl', ['$q', '$scope', 'ParseFactory', '$rootScope', '$route',
    function($q, $scope, ParseFactory, $routeScope, $route) {

        ParseFactory.init();

        $routeScope.pageTitle = "Klassy | FAQ";

    }
]);