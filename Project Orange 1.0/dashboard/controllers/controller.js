var appControllers = angular.module('dashBoardControllers', []);

appControllers.controller('dashboardCtrl', ['$scope', 'ParseFactory', '$routeParams', '$rootScope',
    function($scope, ParseFactory, $routeParams, $routeScope) {

        ParseFactory.init();

        $scope.storeId = $routeParams.storeId;
        $scope.storeData = null;
        $scope.store = {};
        $scope.storeOwner = {};
        $scope.storeName = '';
        $scope.activities = [];
        $scope.tagNames = [];
        $scope.localities = [];
        $scope.gallery = [];
        $scope.files = [];
        $scope.newCoupon = {};
        $scope.coupons = [];
        /*$scope.newCoupon.startDate = new Date();
        $scope.newCoupon.endDate = new Date();
        $scope.newCoupon.endDate.setDate($scope.newCoupon.startDate.getDate() + 7);
	*/
        $scope.acceptedTypes = {
            'image/png': true,
            'image/jpeg': true,
            'image/gif': true
        };

        $scope.weekDays = [{
            name: "Sunday",
            selected: false
        }, {
            name: "Monday",
            selected: false
        }, {
            name: "Tuesday",
            selected: false
        }, {
            name: "Wednesday",
            selected: false
        }, {
            name: "Thursday",
            selected: false
        }, {
            name: "Friday",
            selected: false
        }, {
            name: "Saturday",
            selected: false
        }];

        $scope.paymentOptions = ["Cash", "Cash and Card"];

        $routeScope.pageTitle = "Store Page";

        $scope.storeHandleAvailable = true;
        $scope.ownerEmailAvailable = true;

        $scope.currentUser = ParseFactory.getCurrentUser();

        if ($scope.currentUser) {
            if ($scope.currentUser.get('is_store') && $scope.currentUser.get('store_id') == $scope.storeId) {

            } else {
                ParseFactory.logOut();
            }
        }

        //Put this part inside the about if statement
        ParseFactory.getStoreById($scope.storeId).then(
            function(storeObject) {
                console.log(storeObject);
                $scope.storeData = storeObject;
                $scope.storeName = $scope.storeData.get('name');
                $routeScope.pageTitle = $scope.storeName;

                $scope.getStoreOwnerDetails();
                $scope.fetchStorePosts();
                $scope.getGalleryImages();
                $scope.getCouponsOfStore();

            }, function(message) {
                console.log(message);
            }
        );

        ParseFactory.getCategories().then(
            function(categories) {
                $scope.categories = categories;
                $scope.store.selectedCategory = categories[0];
            }, function(message) {
                console.log(message);
            }
        );

        ParseFactory.getCouponCategories().then(
            function(couponCats) {
                $scope.couponCategories = couponCats;
                $scope.newCoupon.selectedCategory = couponCats[0];
            }, function(message) {
                console.log(message);
            }
        );

        ParseFactory.getTags().then(
            function(tags) {
                $scope.tags = tags;
                $scope.assignTagsCategories();
            }, function(message) {
                console.log(message);
            }
        );

        $scope.getStoreOwnerDetails = function() {
            ParseFactory.getStoreOwner($scope.storeData).then(
                function(ownerObject) {
                    console.log(ownerObject);
                    if (ownerObject) {
                        $scope.ownerData = ownerObject;
                        $scope.setStoreDetails();
                    } else {
                        console.log("No Store Owner Details! Contact Admin");
                    }

                }, function(message) {
                    console.log(message)
                }
            );
        }

        $scope.setStoreDetails = function() {
            $scope.store.storeHandle = $scope.storeData.get('store_handle');
            $scope.store.storeID = $scope.storeData.id;
            $scope.store.name = $scope.storeData.get('name');
            $scope.store.address = $scope.storeData.get('address');
            $scope.store.description = $scope.storeData.get('description');
            $scope.store.email = $scope.storeData.get('email');

            var phoneNumbers = $scope.storeData.get('phone');
            if (phoneNumbers) {
                if (phoneNumbers.length > 0)
                    $scope.store.primaryPhone = phoneNumbers[0];
                if (phoneNumbers.length == 2)
                    $scope.store.secPhone = phoneNumbers[1];
            }

            $scope.store.website = $scope.storeData.get('website_link');
            $scope.store.twitterLink = $scope.storeData.get('twitter_link');
            $scope.store.facebook_link = $scope.storeData.get('facebook_link');
            $scope.store.majorSale = $scope.storeData.get('major_sale');
            $scope.store.startTime = $scope.storeData.get('start_time');
            $scope.store.endTime = $scope.storeData.get('end_time');
            $scope.store.onlineStore = $scope.storeData.get('online_store_link');

            $scope.store.logoImage = $scope.storeData.get('logo');
            console.log($scope.store.logoImage);
            $scope.store.bannerImage = $scope.storeData.get('banner_image');

            $scope.store.selectedTags = $scope.storeData.get('tags');
            $scope.store.workingDays = $scope.storeData.get('working_days');
            var paymentType = $scope.storeData.get('payment_type');
            if (paymentType && paymentType.length > 0)
                $scope.store.selectedPayment = paymentType[0];
            $scope.store.selectedCategory = $scope.storeData.get('primary_category');

            $scope.store.locality = $scope.storeData.get('locality');

            ParseFactory.getLocality($scope.store.locality.get('city')).then(
                function(localities) {
                    $scope.localities = localities;
                    $scope.setSelectedLocality();
                }, function(error) {
                    console.log(error);
                }
            );

            $scope.storeOwner.name = $scope.ownerData.get('name');
            $scope.storeOwner.email = $scope.ownerData.get('email');
            $scope.storeOwner.phone = $scope.ownerData.get('phone');

            console.log($scope.store);
            console.log($scope.storeOwner);

            $scope.setWorkingDays();
            $scope.setActiveTags();
        }

        $scope.fetchStorePosts = function() {
            ParseFactory.getGeneralActivityByStore($scope.storeData).then(
                function(activities) {
                    $scope.activities = activities;
                    console.log(activities);
                }, function(message) {
                    console.log(message);
                }
            );
        }

        $scope.checkAvailability = function() {
            console.log("Changed");
        }

        $scope.setSelectedLocality = function() {
            for (var i = 0; i < $scope.localities.length; i++) {
                if ($scope.localities[i].id == $scope.store.locality.id) {
                    $scope.localities.splice(i, 1);
                    $scope.localities.unshift($scope.store.locality);
                    break;
                }
            }

            $scope.selectedLocality = 0;
            console.log("Selected Locality", $scope.selectedLocality);
        }

        $scope.setWorkingDays = function() {
            var length = $scope.store.workingDays;
            for (var i = 0; i < $scope.weekDays.length; i++) {

                var index = $scope.store.workingDays.indexOf($scope.weekDays[i].name);

                if (index != -1)
                    $scope.weekDays[i].selected = true;
            }
        }

        $scope.assignTagsCategories = function() {

            for (var i = 0; i < $scope.tags.length; i++) {
                $scope.tags[i].category = $scope.tags[i].get('tag_category').get('categoryName');
                $scope.tags[i].selected = false;
                $scope.tags[i].name = $scope.tags[i].get('tag_description');
                $scope.tagNames.push($scope.tags[i].get('tag_description'));
            }

            console.log($scope.tags);
        }

        $scope.setActiveTags = function() {
            for (var i = 0; i < $scope.store.selectedTags.length; i++) {
                var index = $scope.tagNames.indexOf($scope.store.selectedTags[i].get('tag_description'));
                $scope.tags[index].selected = true;
            }
        }

        $scope.getGalleryImages = function() {
            ParseFactory.fetchGalleryOfStore($scope.storeData).then(
                function(gallery) {
                    console.log(gallery);
                    $scope.gallery = gallery;
                }, function(message) {
                    console.log(message);
                }
            );
        }

        $scope.$watch('newCoupon.startDate', function(newval, oldval) {
            if ($scope.newCoupon.endDate < $scope.newCoupon.startDate) {
                $scope.newCoupon.endDate = "";
            };
        });

        $scope.$watch('newCoupon.endDate', function(newval, oldval) {
            if ($scope.newCoupon.endDate < $scope.newCoupon.startDate) {
                $scope.newCoupon.endDate = "";
            };
        });

        $scope.getCouponsOfStore = function() {
            ParseFactory.getCouponsByStore($scope.storeData).then(
                function(coupons) {
                    $scope.coupons = coupons;
                    console.log($scope.coupons);
                }, function(message) {
                    console.log(message);
                }
            );
        }

        $scope.selectCouponCategory = function(category) {
            $scope.newCoupon.selectedCategory = category;
        }

        $scope.saveCoupon = function() {
            ParseFactory.addCoupons($scope.storeData, $scope.newCoupon).then(
                function(coupon) {
                    $scope.coupons.unshift(coupon);
                    $scope.newCoupon = {};
                    $scope.couponForm.$setPristine();
                    $scope.couponForm.$setUntouched();
                    $scope.newCoupon.selectedCategory = $scope.couponCategories[0];
                }, function(message) {
                    console.log(message)
                }
            );

        }

    }
]);