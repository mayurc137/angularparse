var appFilters = angular.module('appFilters', []);

appFilters.filter('reviewCount', function() {
    return function(input) {
        return input + (input == 1 ? " Review" : "Reviews");
    };
});

appFilters.filter('followerCount', function() {
    return function(input) {
        return input + (input == 1 ? " Follower" : "Followers");
    };
});