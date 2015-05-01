var app = angular.module('dashboard', ['ngRoute', 'dashBoardControllers', 'parseServices', 'appFilters']);

app.config(['$routeProvider', '$locationProvider',

    function($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.
        when('/id/:storeId', {
            templateUrl: 'partials/store.html',
            controller: 'dashboardCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });

    }
]);