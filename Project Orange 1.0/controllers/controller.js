var appControllers = angular.module('Controllers', []);


app.controller('storeCtrl', ['$scope', 'ParseFactory', '$routeParams', 'storeLocalStorage',
    function($scope, ParseFactory, $routeParams, storeLocalStorage) {

        ParseFactory.init();

        $scope.storeData = storeLocalStorage.getStoreData();

        //Testing part
        $scope.currentUser = ParseFactory.getCurrentUser();

        $scope.storeHandle = $routeParams.storeHandle;
        $scope.upvoters = [];
        $scope.followers = [];
        $scope.upvoteCount = 0;
        $scope.followerCount = 0;
        $scope.isUpvoted = false;
        $scope.isFollowing = false;
        $scope.upvoteDisplayLimit = 9;
        $scope.followerDisplayLimit = 9;
        $scope.tagDisplayLimit = 8;
        $scope.galleryDisplayLimit = 8;
        $scope.storeTags = [];
        $scope.galleryImages = [];
        $scope.reviews = [];
        $scope.reviewCount = 0;

        if ($scope.storeData == null) {

            ParseFactory.getStoreByHandle($scope.storeHandle).then(
                function(store) {

                    //console.log(store);
                    $scope.storeData = store;
                    $scope.storeTags = store.get('tags');
                    $scope.checkUpvoted(store);
                    $scope.checkFollowing(store);
                    $scope.fetchGallery();
                    $scope.fetchReviews();

                    //$scope.addReviewToStore("This is a sample review");
                },
                function(message) {
                    console.log(message);
                }
            );
        }

        $scope.fetchGallery = function() {
            ParseFactory.fetchGalleryOfStore($scope.storeData.id).then(
                function(galleryImages) {
                    $scope.galleryImages = galleryImages;
                    //console.log(galleryImages);
                }, function(message) {
                    console.log(message);
                }
            );
        }

        $scope.checkUpvoted = function(store) {
            $scope.upvoters = store.get('upvoted_by');

            if ($scope.upvoters != null) {
                $scope.upvoteCount = $scope.upvoters.length;

                if ($scope.currentUser != null) {
                    for (var i = 0; i < $scope.upvoters.length; i++) {

                        if ($scope.upvoters[i].id == $scope.currentUser.id) {

                            $scope.isUpvoted = true;
                            break;
                        }
                    }
                }
            }

        }

        $scope.checkFollowing = function(store) {
            $scope.followers = store.get('followers');

            if ($scope.followers != null) {
                $scope.followerCount = $scope.followers.length;

                if ($scope.currentUser != null) {

                    for (var i = 0; i < $scope.followers.length; i++) {

                        if ($scope.followers[i].id == $scope.currentUser.id) {

                            $scope.isFollowing = true;
                            break;
                        }
                    }
                }
            }
        }

        $scope.fetchReviews = function() {

            console.log($scope.currentUser);

            var usersFollowed = $scope.currentUser.get("user_following");

            $scope.reviews = $scope.storeData.get('review_ids');

            if ($scope.reviews != null) {

                $scope.reviewCount = $scope.reviews.length;

                //Iterate through each review
                for (var i = 0; i < $scope.reviewCount; i++) {
                    var userConcerned = $scope.reviews[i].get('user_id');

                    if ($scope.currentUser.id == userConcerned.id) {
                        userConcerned.following = true;
                        userConcerned.isCurrentUser = true;
                        continue;
                    }

                    var j;
                    for (j = 0; j < usersFollowed.length; j++) {

                        if (userFollowed[i].id == userConcerned.id) {
                            userConcerned.following = true;
                            break;
                        }
                    }

                    if (j == usersFollowed.length)
                        userConcerned.following = false;
                }

                console.log($scope.reviews);
            }
        }

        $scope.addReviewToStore = function(reviewText) {
            ParseFactory.addReview($scope.currentUser, $scope.storeData, reviewText)
                .then(function(reviewObject) {
                    $scope.reviews.unshift(reviewObject);
                    console.log($scope.reviews);
                }, function(message) {
                    console.log(message);
                });
        }

        $scope.handleLogin = function() {
            ParseFactory.fbLogin().then(
                function(user) {
                    if (!user.infoSet) {
                        $scope.getUserDetails();
                    } else {
                        $scope.currentUser = user;

                        //Needed on store Page
                        if ($scope.storeData != null) {
                            $scope.checkUpvoted($scope.storeData);
                            $scope.checkFollowing($scope.storeData);
                        }

                    }
                }, function(message) {
                    console.log(message);
                }
            );
        }

        $scope.getUserDetails = function() {
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

        $scope.setUserDetails = function(userDetails) {

            ParseFactory.setUserData(userDetails).then(
                function(user) {
                    $scope.currentUser = user;

                    //Needed on store Page
                    if ($scope.storeData != null) {
                        $scope.checkUpvoted($scope.storeData);
                        $scope.checkFollowing($scope.storeData);
                    }

                }, function(message) {
                    console.log(message);
                }
            );
        }

        $scope.followUser = function(user) {
            ParseFactory.followUser($scope.currentUser, user).then(
                function(success) {
                    user.following = true;
                }, function(error) {
                    console.log(error);
                    user.following = false;
                }
            );
        }

    }
]);