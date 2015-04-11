var appControllers = angular.module('dashBoardControllers', []);

appControllers.controller('dashboardCtrl', ['$scope', 'ParseFactory', '$routeParams', '$rootScope',
    function($scope, ParseFactory, $routeParams, $routeScope) {

        ParseFactory.init();

        $scope.storeId = $routeParams.storeId;
        $scope.store = null;
        $scope.storeName = '';
        $scope.activities = [];

        $scope.activityDisplayLimit = 6;

        //Set the Page Title + the meta tags
        $routeScope.pageTitle = "Store Page";

        $scope.currentUser = ParseFactory.getCurrentUser();

        //This is going to be used to handle the log in
        if ($scope.currentUser.get('is_store') && $scope.currentUser.get('store_id') == $scope.storeId) {

        } else {

        }


        ParseFactory.getStoreById($scope.storeId).then(
            function(storeData) {
                console.log(storeData);
                $scope.store = storeData;
                $scope.storeName = $scope.store.get('name');
                $routeScope.pageTitle = $scope.storeName;

                $scope.fetchStorePosts();

            }, function(message) {
                console.log(message);
            }
        );


        $scope.fetchStorePosts = function() {
            ParseFactory.getGeneralActivityByStore($scope.store).then(
                function(activities) {
                    $scope.activities = activities;
                    console.log(activities);
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

    }

]);