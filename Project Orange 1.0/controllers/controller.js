var appControllers = angular.module('appControllers', []);

appControllers.controller('storeCtrl', ['$scope', 'ParseFactory', '$routeParams', 'storeLocalStorage',
    function($scope, ParseFactory, $routeParams, storeLocalStorage) {

        ParseFactory.init();

        $scope.storeData = storeLocalStorage.getStoreData();

        $scope.currentUser = ParseFactory.getCurrentUser();
        console.log($scope.currentUser);

        $scope.storeHandle = $routeParams.storeHandle;
        $scope.bannerImgStyle = '';
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
        $scope.activityDisplayLimit = 3;
        $scope.storeTags = [];
        $scope.galleryImages = [];
        $scope.reviews = [];
        $scope.collections = [];
        $scope.collectionDisplayLimit = 5;
        $scope.activities = [];
        $scope.reviewCount = 0;
        $scope.hasReviewed = false;
        $scope.userCollections = null;

        $scope.newReview = '';

        //For Tab Control
        $scope.selectedTab = 1;

        if ($scope.storeData == null) {

            ParseFactory.getStoreByHandle($scope.storeHandle).then(
                function(store) {

                    console.log(store);
                    $scope.storeData = store;
                    //Ideally 
                    $scope.bannerImgStyle = 'url(' + $scope.storeData.get('banner_image')._url + ')';
                    $scope.storeTags = $scope.storeData.get('tags');
                    $scope.collections = $scope.storeData.get('collections');
                    $scope.checkUpvoted($scope.storeData);
                    $scope.checkFollowing($scope.storeData);
                    $scope.fetchGallery();
                    $scope.fetchActivity();
                    $scope.fetchReviews();
                    $scope.checkIfReviewed();

                },
                function(message) {
                    console.log(message);
                }
            );
        } else {
            $scope.bannerImgStyle = 'url(' + $scope.storeData.get('banner_image')._url + ')';
            $scope.storeTags = $scope.storeData.get('tags');
            $scope.collections = $scope.storeData.get('collections');
            $scope.checkUpvoted($scope.storeData);
            $scope.checkFollowing($scope.storeData);
            $scope.fetchGallery();
            $scope.fetchActivity();
            $scope.fetchReviews();
        }

        $scope.fetchGallery = function() {
            ParseFactory.fetchGalleryOfStore($scope.storeData).then(
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

        $scope.checkIfReviewed = function() {
            var storeId = $scope.storeData.id;
            var storesReviewed = $scope.currentUser.get('stores_reviewed');
            var index = storesReviewed.indexOf(storeId);
            if (index != -1)
                $scope.hasReviewed = true;
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

            if ($scope.currentUser) {
                var usersFollowed = $scope.currentUser.get("users_followed");

                $scope.reviews = $scope.storeData.get('review_ids');

                if ($scope.reviews != null) {

                    $scope.reviewCount = $scope.reviews.length;

                    console.log(usersFollowed);
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

                            if (usersFollowed[j].id == userConcerned.id) {
                                userConcerned.following = true;
                                userConcerned.isCurrentUser = false;
                                break;
                            }
                        }

                        if (j == usersFollowed.length) {
                            userConcerned.following = false;
                        }

                    }
                }
            } else {
                $scope.reviews = $scope.storeData.get('review_ids');

                if ($scope.reviews != null) {

                    $scope.reviewCount = $scope.reviews.length;

                    //Iterate through each review
                    for (var i = 0; i < $scope.reviewCount; i++) {
                        var userConcerned = $scope.reviews[i].get('user_id');

                        userConcerned.following = false;
                        userConcerned.isCurrentUser = false;

                    }
                }
            }

        }

        $scope.addReviewToStore = function() {

            if ($scope.hasReviewed == false) {
                ParseFactory.addReview($scope.currentUser, $scope.storeData, $scope.newReview).then(
                    function(reviewObject) {
                        $scope.newReview = '';
                        $scope.reviews.unshift(reviewObject);
                        console.log($scope.reviews);
                    }, function(message) {
                        console.log(message);
                    }
                );
            } else {
                $scope.newReview = "";
                console.log("Already reviewed this store");
            }

        }


        $scope.toggleUpvote = function() {
            if ($scope.isUpvoted) {
                $scope.isUpvoted = false;

                ParseFactory.downvoteStore($scope.storeData, $scope.currentUser).then(
                    function(newStoreData) {
                        $scope.storeData = newStoreData;
                        $scope.isUpvoted = false;
                        $scope.upvoters = $scope.storeData.get('upvoted_by');
                        $scope.upvoteCount = $scope.upvoters.length;
                        $scope.currentUser = ParseFactory.getCurrentUser();

                    }, function(message) {
                        $scope.isUpvoted = true;
                        console.log(message);
                    }
                );
            } else {
                $scope.isUpvoted = true;

                ParseFactory.upvoteStore($scope.storeData, $scope.currentUser).then(
                    function(newStoreData) {
                        $scope.storeData = newStoreData;
                        $scope.isUpvoted = true;
                        $scope.upvoters = $scope.storeData.get('upvoted_by');
                        $scope.upvoteCount = $scope.upvoters.length;
                        $scope.currentUser = ParseFactory.getCurrentUser();

                    }, function(message) {
                        $scope.isUpvoted = false;
                        console.log(message);
                    }
                );
            }
        }

        $scope.toggleFollow = function() {
            if ($scope.isFollowing) {
                $scope.isFollowing = false;

                ParseFactory.unfollowStore($scope.storeData, $scope.currentUser).then(
                    function(newStoreData) {
                        $scope.storeData = newStoreData;
                        $scope.isFollowing = false;
                        $scope.followers = $scope.storeData.get('followers');
                        $scope.followerCount = $scope.followers.length;
                        $scope.currentUser = ParseFactory.getCurrentUser();

                    }, function(message) {
                        $scope.isFollowing = true;
                        console.log(message);
                    }
                );
            } else {
                $scope.isFollowing = true;

                ParseFactory.followStore($scope.storeData, $scope.currentUser).then(
                    function(newStoreData) {
                        $scope.storeData = newStoreData;
                        $scope.isFollowing = true;
                        $scope.followers = $scope.storeData.get('followers');
                        $scope.followerCount = $scope.followers.length;
                        $scope.currentUser = ParseFactory.getCurrentUser();

                    }, function(message) {
                        $scope.isFollowing = false;
                        console.log(message);
                    }
                );
            }
        }


        /* Functions for user Login and Sign Up End Here */
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

        $scope.handleLogOut = function() {
            ParseFactory.logOut();
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
        /* Functions for user Login and Sign Up End Here */

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

        $scope.followUser = function(user2) {

            user2.following = true;

            ParseFactory.followUser($scope.currentUser, user2).then(
                function(userFollowed) {
                    //Update user2
                    console.log(user2);
                    user2 = userFollowed;
                    user2.following = true;
                    //Update user1
                    $scope.currentUser = ParseFactory.getCurrentUser();
                }, function(error) {
                    console.log(error);
                    user2.following = false;
                }
            );
        }

        $scope.unfollowUser = function(user2) {

            user2.following = false;

            ParseFactory.unfollowUser($scope.currentUser, user2).then(
                function(unfollowedUser) {
                    //Update User2
                    user2 = unfollowedUser;
                    user2.following = false;
                    //Update User1
                    $scope.currentUser = ParseFactory.getCurrentUser();
                }, function(mesage) {
                    user2.following = true;
                    console.log(message);
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

        $scope.showUserCollections = function() {
            if ($scope.userCollections == null) {
                ParseFactory.getCurrentUserCollections($scope.currentUser).then(
                    function(collections) {
                        $scope.userCollections = collections;
                        console.log($scope.userCollections);
                    }, function(message) {
                        console.log(message);
                    }
                )
            }

        }

        $scope.addStoreToCollection = function(collection) {
            ParseFactory.addStoreToCollection($scope.storeData, collection).then(
                function(storeObject) {
                    $scope.storeData = storeObject;
                    $scope.storeTags = $scope.storeData.get('tags');
                    $scope.collections = $scope.storeData.get('collections');
                    $scope.upvoters = $scope.storeData.get('upvoted_by');
                    $scope.upvoteCount = $scope.upvoters.length;
                    $scope.followers = $scope.storeData.get('followers');
                    $scope.followerCount = $scope.followers.length;
                    $scope.fetchActivity();
                    $scope.fetchReviews();
                    console.log(storeObject);
                }, function(message) {
                    console.log(message);
                }
            );
        }

    }
]);