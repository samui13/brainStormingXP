var stormControllers = angular.module('stormControllers',[]);
stormControllers.controller('StormAddUserCtrl',
			    ['$scope','$location','$routeParams','$cookies','$cookieStore',
			     function($scope,$location,$routeParams,$cookies,$cookieStore){
				 $scope.title = 'TEST'
				 $scope.roomID = $routeParams.roomID;
				
				$scope.submit = function(){
				    $cookies[$scope.roomID+'.name'] = this.content;
				    $location.path("brain/"+$scope.roomID);
				    
				}
			    }]);
stormControllers.controller('StormCtrl',
			    ['$scope','$http','$routeParams','$cookies',
			    function($scope,$http,$routeParams,$cookies){
				console.log($cookies);
				$scope.roomID = $routeParams.roomID;
//				// えらーしょりひつよう
				// User Add してないなら；／／／
				$scope.user =  $cookies[$scope.roomID+'.name'];
				if(typeof $scope.roomID !== 'undefined'){
				    //redirect
				    
				}
				DB.connectRoom($scope.roomID);
				$scope.theme = 'None';

				$scope.$watch(function(){console.log('watching');return DB.data.roomTheme;},function(newVal,oldVal){
				    // 監視してくれない
				    //console.log(DB.data.roomTheme);
				    //console.log(DB.data.roomTheme);
				    //console.log(newVal,oldVal);
				    $scope.theme = DB.data.roomTheme;
				});

			    }]);
stormControllers.controller('StormMakeCtrl',
			    ['$scope','$http','$cookies','$location',
			     function($scope,$http,$cookies,$location){
				 $scope.text = 'TEXT';
				 $scope.abs = 'ASDFASF';
				 $cookies.abs = 'gs';
				 $scope.submit = function(){

				     
				     //this.text
				     var data = userUI.createRoom(this.theme,this.name);
				     //$cookies[data.ID] = this.name;
				     $cookies[data.ID+'.name'] = this.name;
				     $cookies[data.ID+'.member_id'] = data.member_id;
				     $cookies[data.ID+'.title'] = 'test';
				     $cookies[data.ID+'.color'] = 'test';
				     $cookies[data.ID+'.flag'] = 'true';
				     $location.path("/brain/"+data.ID);
				 };
			     }]);

 

