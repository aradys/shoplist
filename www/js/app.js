// Ionic template App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'shoplist' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('shoplist', ['ionic', 'backand', 'shoplist.controllers', 'shoplist.services'])

    /*   .run(function (, Backand) {

     })
     */
  .config(function (BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
      BackandProvider.setAppName('shoplist');
      BackandProvider.setSignUpToken('6ecbc769-d8c3-47a8-9ecb-7892cd4ab6d3');
      BackandProvider.setAnonymousToken('ccaf46d0-8b53-4031-a9ad-3f2217459934');

        $stateProvider
            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tabs',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })
            .state('tab.dashboard', {
                url: '/dashboard',
                views: {
                    'tab-dashboard': {
                        templateUrl: 'templates/tab-dashboard.html',
                        controller: 'DashboardCtrl as vm'
                    }
                }
            })
            .state('tab.login', {
                url: '/login',
                views: {
                    'tab-login': {
                        templateUrl: 'templates/tab-login.html',
                        controller: 'LoginCtrl as login'
                    }
                }
            })
            .state('tab.signup', {
                url: '/signup',
                views: {
                    'tab-signup': {
                        templateUrl: 'templates/tab-signup.html',
                        controller: 'SignUpCtrl as vm'
                    }
                }
            }
        );

        $urlRouterProvider.otherwise('/tabs/dashboard');
        $httpProvider.interceptors.push('APIInterceptor');
    })

    .run(function ($ionicPlatform, $rootScope, $state, LoginService, Backand) {

        $ionicPlatform.ready(function () {

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }


            var isMobile = !(ionic.Platform.platforms[0] == "browser");
            Backand.setIsMobile(isMobile);
            Backand.setRunSignupAfterErrorInSigninSocial(true);
        });

        function unauthorized() {
            console.log("user is unauthorized, sending to login");
            $state.go('tab.login');
        }

        function signout() {
            LoginService.signout();
        }

        $rootScope.$on('unauthorized', function () {
            unauthorized();
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name == 'tab.login') {
                signout();
            }
            else if (toState.name != 'tab.login' && Backand.getToken() === undefined) {
                unauthorized();
            }
        });

    })
