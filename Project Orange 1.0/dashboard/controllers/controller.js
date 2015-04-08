var appControllers = angular.module('dashBoardControllers', []);

appControllers.controller('dashboardCtrl', ['$scope', 'ParseFactory', '$routeParams', '$rootScope',
    function($scope, ParseFactory, $routeParams, $routeScope) {

        $scope.storeId = $routeParams.storeId;

        //Set the Page Title + the meta tags
        $routeScope.pageTitle = "Store Page";
        $routeScope.metaKeyWords = "Sample, Keywords";
        $routeScope.metaDescription = "Sample Description";

        $scope.currentUser = ParseFactory.getCurrentUser();

        if ($scope.currentUser.get('is_store') && $scope.currentUser.get('store_id') == $scope.storeId) {

        } else {

        }

        ParseFactory.getStoreById()

    }

]);