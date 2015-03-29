var app = angular.module('orange', ['ngRoute', 'appControllers', 'parseServices', 'appFilters']);

app.config(['$routeProvider',
    function($routeProvider) {

        $routeProvider.
        when('/@:storeHandle', {
            templateUrl: 'partials/store.html',
            controller: 'storeCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });

    }
]);