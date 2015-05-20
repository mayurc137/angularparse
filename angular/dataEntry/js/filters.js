var appFilters = angular.module('appFilters', []);

appFilters.filter('reviewCount', function() {
    return function(input) {
        return input + (input == 1 ? " Review" : " Reviews");
    };
});

appFilters.filter('followerCount', function() {
    return function(input) {
        return input + (input == 1 ? " Follower" : " Followers");
    };
});

appFilters.filter('likeCount', function() {
    return function(input) {
        return input + (input == 1 ? " Like" : " Likes");
    };
});

appFilters.filter('commentCount', function() {
    return function(input) {
        return input + (input == 1 ? " Comment" : " Comments");
    };
});

appFilters.filter('imageCount', function() {
    return function(input) {
        return input + (input == 1 ? " image" : " images");
    };
});

appFilters.filter('postDate', ['$filter',
    function($filter) {
        var dateFilter = $filter('date');
        return function(input) {

            var date = new Date(input);
            var currentDate = new Date();
            if (date.getFullYear() == currentDate.getFullYear() &&
                date.getMonth() == currentDate.getMonth() &&
                date.getDate() == currentDate.getDate()) {
                return "Today at " + dateFilter(input, 'h:mma');
            } else {
                return dateFilter(input, 'dd/MM/yyyy') + ' at ' + dateFilter(input, 'h:mma');
            }

        }
    }
]);