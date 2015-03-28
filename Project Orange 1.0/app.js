var app = angular.module('orange', ['ngRoute', 'parseServices']);

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