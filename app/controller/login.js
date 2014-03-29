
angular.module('stormControllers',['stormFilter','stormFactory','stormTest']).
controller('StormAddUserCtrl',
		 ['$scope','$location','$routeParams','$cookies','$cookieStore','RoomService','ColorService',
		  function($scope,$location,$routeParams,$cookies,$cookieStore,DB,ColorDB){
		      $scope.roomID = $routeParams.roomID;
		      if($cookies[$scope.roomID+'.name'])
			  $location.path("brain/"+$scope.roomID);
		      $scope.$watch(function(){
			  return ColorDB.getColor()
		      },function(){
			  $scope.ccolor = ColorDB.getColor();
		      });
		      $scope.submit = function(){
			  $cookies[$scope.roomID+'.name'] = this.content;
			  
			  var ref = DB.getRef();
			  var db = ref.$child($scope.roomID);
			  var members = db.$child('members');
			  console.log(ColorDB.getColor);
			  var data = members.$add({
			      name : this.content,
			      color:$scope.ccolor,
			      owner_flag:'false',
			  }).then(function(d){
			      console.log(d.name());
			      $cookies[$scope.roomID+'.member_id'] = d.name();
			  });
			  $cookies[$scope.roomID+'.color'] = $scope.ccolor;
			  $cookies[$scope.roomID+'.flag'] = 'false';
			  $location.path("brain/"+$scope.roomID);
		      }
		  }]);
