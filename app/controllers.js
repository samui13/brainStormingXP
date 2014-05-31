if(typeof stormControllers === 'undefined'){
    var storm = angular.module('stormControllers',['stormFilter','stormFactory','stormTest','ui.bootstrap','contenteditable']);
}

storm.controller('StormAddUserCtrl',
		 ['$scope','$location','$routeParams','$cookies','$cookieStore','RoomService','ColorService',
		  function($scope,$location,$routeParams,$cookies,$cookieStore,DB,ColorDB){
		      console.log($timeout);
		      $scope.roomID = $routeParams.roomID;
		      if($cookies[$scope.roomID+'.name'])
			  $location.path("brain/"+$scope.roomID+"/waiting");
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
			  var data = db.$child('members').$add({
			      name : this.content,
			      color:$scope.ccolor,
			      owner_flag:'false',
			  }).then(function(d){
			      console.log(d.name());
			      $cookies[$scope.roomID+'.member_id'] = d.name();
			  });
			  $cookies[$scope.roomID+'.color'] = $scope.ccolor;
			  $cookies[$scope.roomID+'.flag'] = 'false';
			  $location.path("brain/"+$scope.roomID+"/waiting");
		      }
		  }]);

storm.controller('ColorModalCtrl',
		 ['$scope','ColorService',
		  function($scope,ColorDB){
		      
		      //$scope.ccolor = '#00FF00';
		      $scope.ccolor = ColorDB.getColor();
		      $scope.colors = [['#00FF00','#008080','#0068b7','#00a7db','#432f2f'],
				      ['#999999','#fef4f4','#c85179','#dccb18','#82ae46']];
		      $scope.makecolor='#FF0000';
		      $scope.choiceColor = function(color){
			  $scope.ccolor = color;
			  ColorDB.setColor(color);
		      };
		      var changeColor = function(){
			  // 今後修正するべき
			  $scope.makecolor = 'rgb('+$scope.colorR+','+$scope.colorG+','+$scope.colorB+')';
		      };
		      $scope.$watch('colorR',function(){
			  changeColor();
		      });
		      $scope.$watch('colorG',function(){
			  changeColor();
		      });
		      $scope.$watch('colorB',function(){
			  changeColor();
		      });

		  }]);



storm.controller('StormWaitingCtrl',
		 ['$scope','$routeParams','$location','$cookies','RoomService',
		  function($scope,$routeParams,$location,$cookies,DB){
		      $scope.roomID = $routeParams.roomID;
		      if(!$cookies[$scope.roomID+'.name']){
			  // Cookieに、一度ログインした記録があれば、移動
			  $location.path("/login/"+$scope.roomID);
		      }
		      $scope.owner = $cookies[$scope.roomID+'.flag'];
		      if($scope.owner != 'true'){
			  $('.waitingForm').css('display','none');
		      }
		      $scope.time = 1;
		      $scope.ideacount = 5;
		      $scope.timer = DB.getDB($scope.roomID).$child('timerDate');
		      $scope.timer.$on("change",function(){
			  if($scope.flag != true){
			      $scope.flag = true;
			      return;
			  }
			  $location.path("/brain/"+$scope.roomID+"/storm");
		      });
		      
		      
		      var room = DB.getDB($scope.roomID);
		      $scope.users = DB.getUsers();
		      $scope.title = room.$child('theme');
		      $scope.stormBegin = function(){
			  console.log($scope.time);
			  console.log($scope.ideacount);
			  DB.getDB($scope.roomID).
			      $child('ideaCount').
			      $set($scope.ideacount);
			  DB.getDB($scope.roomID).
			      $child('timerDate').
			      $set(parseInt((new Date)/1000)+
				   parseInt($scope.time)*60);
			  DB.getDB($scope.roomID).
			      $child('timerCount').
			      $set(parseInt($scope.time)*60);
			  $location.path("/brain/"+$scope.roomID+"/storm");
		      }
		  }]);
// ひとりでやるやーつ
storm.controller('StormOneCtrl',
		 ['$scope','$routeParams','$location','$cookies','RoomService','$timeout',
		  function($scope,$routeParams,$location,$cookies,DB,$timeout){
		      $scope.roomID = $routeParams.roomID;
		      var room = DB.getDB($scope.roomID);
		      $scope.title = room.$child('theme');
		      $scope.timerDate = room.$child('timerDate')
		      $scope.time = 0;
		      $scope.timerDate.$on("loaded",function(){
			  $scope.time = $scope.timerDate.$value-$scope.unixDate();	  
			  if($scope.timer<0)
			      $location.path("/brain/"+$scope.roomID);
			  $scope.timer();	  
		      });
		      
		      $scope.unixDate = function(){
			  return parseInt(new Date/1000);
		      }
		      $scope.floor = Math.floor;
		      $scope.timer = function(){
			  $scope.mytimeout = $timeout($scope.timer,1000);
			  $scope.time = $scope.timerDate.$value-$scope.unixDate();	  
			  if($scope.time < 10){
			      $('.countDown').
				  text($scope.time).
				  css('display','inline');
			      
			  }
			  if($scope.time < 0){
			      $timeout.cancel($scope.mytimeout);
			      $scope.goStorm();
			  }
		      }
		      
		      
		      $scope.postits = [];
		      $scope.ideaCount = room.$child('ideaCount');
		      $scope.ideaCount.$on("loaded",function(){
			  for(var i = 0; i < $scope.ideaCount.$value; i++){
			      $scope.addPostit();
			  }
		      });
		      $scope.addPostit = function(){
			  $scope.postits.push({
			      color:$cookies[$scope.roomID+'.color'],
			      created_id: parseInt((new Date)/1000), // 作成時間				
			      editor_id:"",
			      holding_id: $cookies[$scope.roomID+'.member_id'], // UserID
			      text:'IDEA',
			      group_id:"",
			      pos_x:0,
			      pos_y:0,
			  });
		      }
		      $scope.goStorm = function(){
			  var postits = room.$child('postits');
			  var count = postits.$getIndex().length;
			  for(var key in $scope.postits){
			      if($scope.postits[key].text == 'IDEA'){
				  //デフォルトのままだと、そのままにする。
				  continue;
			      }
			      $scope.postits[key].pos_x = 30+(count%4)*260;
			      $scope.postits[key].pos_y = 100+Math.floor(count/4)*50;
			      postits.$add($scope.postits[key]);
			      count+=1;
			  }
			  $location.path("/brain/"+$scope.roomID);
		      };

		      
		  }]);
