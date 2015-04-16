var app = angular.module('dataEntry', ['ngRoute', 'dataEntryControllers', 'parseServices', 'appFilters']);

app.config(['$routeProvider',

    function($routeProvider) {

        $routeProvider.
        when('/:action/formFill', {
            templateUrl: 'partials/form.html',
            controller: 'formCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });

    }
]);