var app = angular.module('dashboard', ['ngRoute', 'dashBoardControllers', 'parseServices', 'appFilters']);

app.config(['$routeProvider',

    function($routeProvider) {

        $routeProvider.
        when('/@:storeId', {
            templateUrl: 'partials/store.html',
            controller: 'dashboardCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });

    }
]);