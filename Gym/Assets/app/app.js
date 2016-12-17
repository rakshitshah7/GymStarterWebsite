var app = angular.module('app', ['ui.router', 'ngAnimate', 'ui.bootstrap',
    'ngRoute',
    'ngCookies',
    'home',
    'signIn',
    'club',
    'activity',
    'trainer',
    'member',
    'join',
    'todoManager',
'main'
]);




app.config(['$provide', '$routeProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', function ($provide, $routeProvider, $httpProvider, $stateProvider, $urlRouterProvider) {
    
    //================================================
    // Ignore Template Request errors if a page that was requested was not found or unauthorized.  The GET operation could still show up in the browser debugger, but it shouldn't show a $compile:tpload error.
    //================================================
    $provide.decorator('$templateRequest', ['$delegate', function ($delegate) {
        var mySilentProvider = function (tpl, ignoreRequestError) {
            return $delegate(tpl, true);
        }
        return mySilentProvider;
    }]);

    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
        return {            
            'responseError': function (response) {
                if (response.status === 401)
                    $location.url('/signin');
                return $q.reject(response);
            }
        };
    }]);

        
    //================================================
    // Routes
    //================================================
    $urlRouterProvider.otherwise('/home');
    

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: '../../Assets/app/views/Home.html',
            controller:'homeCtrl'
        })

       
        // nested list with just some random string data
        .state('club', {
            url: '/club',
            templateUrl: '../../Assets/app/views/Club.html',
            controller: 'clubCtrl'
        })

        // ABOUT PAGE AND MULTIPLE NAMED VIEWS =================================
        .state('join', {
            url: '/join',
            templateUrl: '../../Assets/app/views/Join.html',
            controller: 'joinCtrl'
        })
    .state('member', {
        url: '/member',
        templateUrl: '../../Assets/app/views/Member.html',
        controller: 'memberCtrl'
    })
        .state('activity', {
        url: '/activity',
        templateUrl: '../../Assets/app/views/Activity.html',
        controller: 'activityCtrl'
        })
       .state('trainer', {
           url: '/trainer',
           templateUrl: '../../Assets/app/views/Trainer.html',
           controller: 'trainerCtrl'
       })
        ;


    //$routeProvider.when('/home', {
    //    templateUrl: 'App/Home',
    //    controller: 'homeCtrl'
    //});
    //$routeProvider.when('/club', {
    //    templateUrl: 'App/Club',
    //    controller: 'clubCtrl'
    //});
    //$routeProvider.when('/signin/:message?', {
    //    templateUrl: 'App/SignIn',
    //    controller: 'signInCtrl'
    //});
    //$routeProvider.when('/todomanager', {
    //    templateUrl: 'App/TodoManager',
    //    controller: 'todoManagerCtrl'
    //});
    
    //$routeProvider.otherwise({
    //    redirectTo: '/home'
    //});    
}]);

app.run(['$http', '$cookies', '$cookieStore', function ($http, $cookies, $cookieStore) {
    //If a token exists in the cookie, load it after the app is loaded, so that the application can maintain the authenticated state.
    $http.defaults.headers.common.Authorization = 'Bearer ' + $cookieStore.get('_Token');
    $http.defaults.headers.common.RefreshToken = $cookieStore.get('_RefreshToken');
}]);






//GLOBAL FUNCTIONS - pretty much a root/global controller.
//Get username on each page
//Get updated token on page change.
//Logout available on each page.
app.run(['$rootScope', '$http', '$cookies', '$cookieStore', function ($rootScope, $http, $cookies, $cookieStore) {

    $rootScope.logout = function () {
        
        $http.post('/api/Account/Logout')
            .success(function (data, status, headers, config) {
                $http.defaults.headers.common.Authorization = null;
                $http.defaults.headers.common.RefreshToken = null;
                $cookieStore.remove('_Token');
                $cookieStore.remove('_RefreshToken');
                $rootScope.username = '';
                $rootScope.loggedIn = false;
                window.location = '#/signin';
            });

    }

    $rootScope.$on('$locationChangeSuccess', function (event) {
        if ($http.defaults.headers.common.RefreshToken != null) {
            var params = "grant_type=refresh_token&refresh_token=" + $http.defaults.headers.common.RefreshToken;
            $http({
                url: '/Token',
                method: "POST",
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: params
            })
            .success(function (data, status, headers, config) {
                $http.defaults.headers.common.Authorization = "Bearer " + data.access_token;
                $http.defaults.headers.common.RefreshToken = data.refresh_token;

                $cookieStore.put('_Token', data.access_token);
                $cookieStore.put('_RefreshToken', data.refresh_token);

                $http.get('/api/WS_Account/GetCurrentUserName')
                    .success(function (data, status, headers, config) {
                        if (data != "null") {
                            $rootScope.username = data.replace(/["']{1}/gi, "");//Remove any quotes from the username before pushing it out.
                            $rootScope.loggedIn = true;
                        }
                        else
                            $rootScope.loggedIn = false;
                    });


            })
            .error(function (data, status, headers, config) {
                $rootScope.loggedIn = false;
            });
        }
    });
}]);

