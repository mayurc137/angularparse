var app = angular.module('landing', ['ngRoute', 'angulartics', 'angulartics.google.analytics', 'landingPageControllers', 'parseServices']);

app.config(['$routeProvider', '$locationProvider',

    function($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.
        when('/about', {
            templateUrl: 'partials/about.html',
            controller: 'aboutCtrl'
        }).
        when('/beta', {
            templateUrl: 'partials/beta.html',
            controller: 'betaCtrl'
        }).
        when('/business', {
            templateUrl: 'partials/business.html',
            controller: 'businessCtrl'
        }).
        when('/contact', {
            templateUrl: 'partials/contact.html',
            controller: 'contactCtrl'
        }).
        when('/faq', {
            templateUrl: 'partials/faq.html',
            controller: 'faqCtrl'
        }).
        when('/', {
            templateUrl: 'partials/home.html',
            controller: 'homeCtrl'
        }).
        when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'homeCtrl'
        })

    }
]);