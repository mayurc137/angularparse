var app = angular.module('dataEntry', ['ngRoute', 'dataEntryControllers', 'parseServices', 'appFilters']);

app.config(['$routeProvider', '$locationProvider',

    function($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $routeProvider.
        when('/:action/formFill', {
            templateUrl: 'partials/form.html',
            controller: 'formCtrl'
        }).
        when('/galleryUpload', {
            templateUrl: 'partials/galleryUpload.html',
            controller: 'galleryCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });

    }
]);