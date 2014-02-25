var stormControllers = angular.module('stormControllers',[]);
stormControllers.controller('StormCtrl',
			    ['$scope','$http','$routeParams',
			    function($scope,$http,$routeParams){
				console.log($routeParams);
				$scope.roomID = $routeParams.roomID;
				if(typeof $scope.roomID !== 'undefined'){
				    //redirect
}
				(function(ID){
				    DB.connectRoom(ID);
				})($scope.roomID);
				    
			    }]);
stormControllers.controller('StormMakeCtrl',
			    ['$scope','$http','$cookies','$location',
			     function($scope,$http,$cookies,$location){
				 $scope.text = 'TEXT';
				 $scope.abs = 'ASDFASF';
				 $cookies.abs = 'gs';
				 $scope.submit = function(){
				     console.log("AS");
				     
				     //this.text
				     var data = userUI.createRoom(this.theme,this.name);
				     $location.path("/brain/"+data.ID);
				 };
			     }]);

 