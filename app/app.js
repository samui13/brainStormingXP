var stormApp = angular.module('stormApp',[
    'firebase',
    'ngRoute',
    'ngCookies',
    'stormControllers'
]);
stormApp.config(['$routeProvider',
    function($routeProvider){
	$routeProvider.
	    when('/',{
		templateUrl:'view/makeStorm.html',
		controller: 'StormMakeCtrl'
	    }).
	    when('/brain/:roomID',{
		templateUrl:'view/Storm.html',
		controller: 'StormCtrl',
	    }).
	    when('/brain/:roomID/waiting',{
		templateUrl:'view/StormWaiting.html',
		controller:'StormWaitingCtrl',
		   
	    }).
	    when('/brain/:roomID/storm',{
		templateUrl:'view/StormOne.html',
		controller:'StormOneCtrl',
	    }).
	    when('/login/:roomID',{
		templateUrl:'view/addUser.html',
		controller: 'StormAddUserCtrl',
	    }).
	    otherwise({
		redirectTo:'/'
	    });

}]);
