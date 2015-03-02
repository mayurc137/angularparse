var app = angular.module('orange', ['ngRoute', 'phonecatServices']);

app.config(['$routeProvider',
  function($routeProvider) {

    $routeProvider.
      when('/stores', {
        templateUrl: 'partials/store-list.html',
        controller: 'storeListCtrl'
      }).
      when('/collections', {
        templateUrl: 'partials/collections.html',
        controller: 'collectionsCtrl'
      }).
      when('/stores/:id', {
        templateUrl: 'partials/store-detail.html',
        controller: 'storeCtrl'
      }).
      otherwise({
        redirectTo: '/stores'
      });
      
}]);
