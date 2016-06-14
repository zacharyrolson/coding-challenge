/* -----------------------------
 * Author: Zach Olson (OLS9354)
 * -----------------------------
 * 
 */
(function (angular) {
    'use strict';

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    angular.module('myApp', ['ngRoute','ngAnimate'])

    .controller('homeController', ['$scope', '$filter', 'localJSON', function ($scope, $filter, localJSON) {
        var searchResults = angular.element(document.getElementById('searchResults'));

        $scope.ServerResponse = [];
        $scope.ModalTab = 0;

        $scope.articleEntry = [{
            "make": "Subaru",
            "model": "FRS STI",
            "image": "01.jpg"
        },
        {
            "make": "Ford",
            "model": "GT",
            "image": "02.jpg"
        },
        {
            "make": "Audi",
            "model": "RS7",
            "image": "03.jpg"
        }];

        $scope.Email = '';
        $scope.JSONResults = '';
        $scope.SearchInput = '';
        $scope.HideSearch = true;

        $scope.Subscribe = function () {
            var curEmail = $scope.Email;

            if (curEmail === '') {
                $scope.ServerResponse = {
                    Title: 'Error',
                    Message: 'Email cannot be blank.'
                }
                return false;
            }

            if (!validateEmail(curEmail)) {
                $scope.ServerResponse = {
                    Title: 'Error',
                    Message: 'The email you have entered is not valid.'
                }
                return false;
            }

            $scope.ServerResponse = {
                Title: 'Thank You',
                Message: 'You will now get weekly newsletters sent to ' + curEmail
            }

            $scope.Email = '';
        }

        $scope.SearchFor = function ($event) {
            if ($event.which === 13) {
                localJSON.loadCars().then(function (response) {
                    $scope.JSONResults = $filter('filter')(response.data, $scope.SearchInput, false);

                    if ($scope.JSONResults.length === 0) {
                        $scope.JSONResults = [{ "name": "No results have been found" }];
                    }
                    searchResults.removeClass('hide');
                }, function (response) {
                    $scope.ServerResponse = {
                        Title: 'Error',
                        Message: response.number + ' ' + response.description,
                        Query: 'localJSON.loadCars()',
                        Source: '/assets/json/local.json',
                        StackTrace: response.stack
                    }
                });
           } else {
               $scope.JSONResults = '';
               searchResults.addClass('hide');
           }
        }

        $scope.SearchToggle = function ($event) {
            $scope.HideSearch = ($scope.HideSearch) ? false : true;
        }
    }])

    .config(function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/app/views/home.html',
                controller: 'homeController'
            }).
            when('/404', {
                templateUrl: '/app/views/404.html'
            }).
            otherwise({ redirectTo: '/404' });
    })

    .service('localJSON', ['$http', function ($http) {
        this.loadCars = function () {
            return $http.get('/assets/json/local.json');
        }
    }])

    .directive('navigationBar', function () {
        return {
            restrict: 'E',
            templateUrl: '/app/directives/navigation-bar.html',
            controller: ['$scope', function ($scope) {
                var appRef = angular.element(document.getElementById('navBarMenu'));

                $scope.ToggleMenu = function ($event) {
                    appRef.toggleClass('in');
                }
            }]
        }
    })
    .directive("serverResponse", function () {
        return {
            restrict: 'E',
            templateUrl: '/app/directives/server-response.html',
            scope: {
                responseData: '=',
                selectedTab: '='
            }
        }
    });
})(window.angular);
