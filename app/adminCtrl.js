angular.
    module('adminControllers',['stormFactory','stormFilter']).
    controller('StormMakeCtrl',
		 ['$scope','$http','$cookies','$location','ColorService','RoomService',
		  function($scope,$http,$cookies,$location,ColorDB,DB){
		      $scope.$watch(function(){
			  return ColorDB.getColor()
		      },function(){
			  $scope.ccolor = ColorDB.getColor();
		      });

		      $scope.submit = function(){
			  var rooms = DB.getRef();
			  rooms.$add({
			      openPostit:false,
			      timerDate:'NULL',
			      timerCount:'NULL',
			      ideaCount:'NULL',
			      theme:$scope.theme,
			      groups:"",
			      postits:"",
			  }).then(function(ref){
			      var roomID = ref.name();
			      var room = DB.getDB(roomID);
			      room.$child('members').$add({
				  name:$scope.name,
				  color:$scope.ccolor,
				  owner_flag:'true',
			      });
			      $cookies[roomID+'.name'] = $scope.name;
			      //$cookies[roomID+'.member_id'] = data.member_id; // 使ってない
			      $cookies[roomID+'.title'] = $scope.theme;
			      $cookies[roomID+'.color'] = $scope.ccolor;
			      $cookies[roomID+'.flag'] = 'true';
			      $location.path("/brain/"+roomID+"/waiting");
			  });
		      };
		  }]);
