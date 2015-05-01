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

appFilters.filter('daysLeftCount', function() {
    return function(input) {

        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        var currentDate = new Date();

        // Convert both dates to milliseconds
        var date1_ms = currentDate.getTime();
        var date2_ms = input.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        var daysLeft = Math.round(difference_ms / one_day);
        // Convert back to days and return
        return (daysLeft < 0 ? 0 : daysLeft);
    };
});

appFilters.filter('daysLeft', function() {
    return function(input) {

        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        var currentDate = new Date();

        // Convert both dates to milliseconds
        var date1_ms = currentDate.getTime();
        var date2_ms = input.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        var daysLeft = Math.round(difference_ms / one_day);
        // Convert back to days and return
        return (daysLeft == 1 ? "Day Left" : "Days Left");
    };
});

appFilters.filter('claimsLeft', function() {
    return function(input) {
        return (input == 1 ? " Claim Left" : " Claims Left");
    };
});