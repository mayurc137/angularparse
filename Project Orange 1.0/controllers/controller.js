var appControllers = angular.module('Controllers', []);


app.controller('storeCtrl', ['$scope', 'ParseFactory', '$routeParams', 'storeLocalStorage',
    function($scope, ParseFactory, $routeParams, storeLocalStorage) {

        ParseFactory.init();

        $scope.storeData = storeLocalStorage.getStoreData();

        //Testing part
        $scope.currentUser = null;
        //$scope.currentUser = ParseFactory.getCurrentUser();
        ParseFactory.getUser("dnDSWXk9AWV0t5VVctGO7NDKn").then(
            function(user) {
                $scope.currentUser = user;

            }, function(message) {
                $scope.currentUser = null;
            }
        );

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

        if ($scope.storeData == null) {

            ParseFactory.getStoreByHandle($scope.storeHandle).then(
                function(store) {

                    console.log(store);
                    $scope.storeData = store;
                    $scope.storeTags = store.get('tags');
                    $scope.checkUpvoted(store);
                    $scope.fetchGallery();

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

        $scope.checkFollowing = function(store) {
            $scope.followers = store.get('followers');

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

        $scope.addReviewToStore = function(reviewText) {
            ParseFactory.addReview($scope.currentUser, $scope.storeData, reviewText)
                .then(function(reviewObject) {
                    $scope.reviews.unshift(reviewObject);
                    console.log($scope.reviews);
                }, function(message) {
                    console.log(message);
                });
        }

    }
]);