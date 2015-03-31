var appControllers = angular.module('appControllers', []);

appControllers.controller('storeCtrl', ['$scope', 'ParseFactory', '$routeParams', 'storeLocalStorage',
    function($scope, ParseFactory, $routeParams, storeLocalStorage) {

        ParseFactory.init();

        $scope.storeData = storeLocalStorage.getStoreData();

        //Testing part
        $scope.currentUser = ParseFactory.getCurrentUser();

        $scope.storeHandle = $routeParams.storeHandle;
        //Default Image should be specified Here
        $scope.bannerImg = 'img/back.jpg';
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
        $scope.reviewDisplayLimit = 3;
        $scope.activityDisplayLimit = 4;
        $scope.storeTags = [];
        $scope.galleryImages = [];
        $scope.reviews = [];
        $scope.collections = [];
        $scope.collectionDisplayLimit = 4;
        $scope.activities = [];
        $scope.reviewCount = 0;

        //For Tab Control
        $scope.selectedTab = 1;

        if ($scope.storeData == null) {

            ParseFactory.getStoreByHandle($scope.storeHandle).then(
                function(store) {

                    console.log(store);
                    $scope.storeData = store;
                    //Ideally 
                    $scope.bannerImg = 'img/back2.jpg';
                    $scope.storeTags = store.get('tags');
                    $scope.collections = store.get('collections');
                    console.log($scope.collections);
                    $scope.checkUpvoted(store);
                    $scope.checkFollowing(store);
                    $scope.fetchGallery();
                    $scope.fetchActivity();
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

        $scope.fetchActivity = function() {
            ParseFactory.getActivityByStore($scope.storeData).then(
                function(activities) {
                    $scope.activities = activities;
                    //console.log($scope.activities);
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

            var usersFollowed = $scope.currentUser.get("user_following");

            $scope.reviews = $scope.storeData.get('review_ids');

            if ($scope.reviews != null) {

                $scope.reviewCount = $scope.reviews.length;

                //Iterate through each review
                for (var i = 0; i < $scope.reviewCount; i++) {
                    var userConcerned = $scope.reviews[i].get('user_id');

                    if ($scope.currentUser.id == userConcerned.id) {
                        userConcerned.following = false;
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

        $scope.decideActivityClass = function(activity) {
            var image = activity.get('activity_image');
            var title = activity.get('activity_title');

            if (image == undefined) {
                return "postTypeGeneralTextOnly";
            }
            if (title == undefined) {
                return "postTypeGeneralImageOnly";
            }

            return "postTypeGeneralImageText";
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

        //For Tab Control
        $scope.setSelectedTab = function(x) {
            $scope.selectedTab = x;
        }
        $scope.isSelectedTab = function(x) {
            return $scope.selectedTab == x;
        }

    }
]);