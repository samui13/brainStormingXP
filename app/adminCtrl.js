angular.
    module('adminControllers',['stormFactory','stormFilter']).
    controller('StormMakeCtrl',
		 ['$scope','$http','$cookies','$location','$firebase','ColorService',
		  function($scope,$http,$cookies,$location,$firebase,ColorDB){
		      $scope.$watch(function(){
			  return ColorDB.getColor()
		      },function(){
			  $scope.ccolor = ColorDB.getColor();
		      });

		      $scope.submit = function(){
			  var ref = new Firebase("https://localbrainst-samui13.firebaseio.com/rooms/");				     
			  var rooms = $firebase(ref);
			  var room = ref.push({
			      openPostit:false,
			      timerDate:'NULL',
			      timerCount:'NULL',
			      ideaCount:'NULL',
			      theme:this.theme,
			      groups:"",
			      postits:"",
			  });
			  var memberData = room.child('members').push({
			      name:this.name,
			      color:'#FF0000',
			      owner_flag:'true',
			  });
			  
			  var data = {};
			  data.ID = room.name();
			  data.member_id = memberData.name();
			  //this.text
			  $cookies[data.ID+'.name'] = this.name;
			  $cookies[data.ID+'.member_id'] = data.member_id;
			  $cookies[data.ID+'.title'] = 'test';
			  $cookies[data.ID+'.color'] = '#FF0000';
			  $cookies[data.ID+'.flag'] = 'true';
			  console.log($cookies[data.ID+'.name']);
			  $location.path("/brain/"+data.ID+"/waiting");

		      };
		  }]);
