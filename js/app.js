var stormApp = angular.module('stormApp',[
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
	    otherwise({
		redirectTo:'/'
	    });

}]);

