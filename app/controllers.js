if(typeof stormControllers === 'undefined')
    var storm = angular.module('stormControllers',[]);

storm.factory("RoomService",['$firebase',function($firebase){
    var ref = new Firebase("https://localbrainst-samui13.firebaseio.com/");
    var DB = $firebase(ref);
    var room = DB.$child('rooms');
    return {
	setPos : function(obj,x,y,objs){
	    var posx =  obj.$child('pos_x');
	    var posy =  obj.$child('pos_y');
	    objs.$off();
	    posx.$set(x).
		finally(function(){
		    posy.$set(y).finally(function(){
			objs.$on();
		    });
		    objs.$on();
		});
	},
	getRef: function(){
	    return room;
	}
    };
}]);

storm.controller('StormAddUserCtrl',
		 ['$scope','$location','$routeParams','$cookies','$cookieStore','RoomService',
		  function($scope,$location,$routeParams,$cookies,$cookieStore,DB){
		      $scope.roomID = $routeParams.roomID;
		      
		      $scope.submit = function(){
			  $cookies[$scope.roomID+'.name'] = this.content;
			  var ref = DB.getRef();
			  var db = ref.$child($scope.roomID);
			  var members = db.$child('members');
			  var data = members.$add({
			      name : this.content,
			      color:'#00FF00',
			      owner_flag:'false',
			  }).then(function(d){
			      console.log(d);
			  });
			  $location.path("brain/"+$scope.roomID);
		      }
		  }]);
// brain/:hash
storm.controller('StormCtrl',
		 ['$scope','$location','$http','$routeParams','$cookies','$firebase','RoomService','$timeout',
		  function($scope,$location,$http,$routeParams,$cookies,$firebase,DB,$timeout){
		      console.log($cookies);
		      // ここはえらーしょりなくてもいいかも
		      $scope.roomID = $routeParams.roomID;
		      if(!$cookies[$scope.roomID+'.name']){
			  console.log("Need Login");
			  $location.path("/login/"+$scope.roomID);
		      }
		      // Serviceにかくべき。
		      var room = DB.getRef();
		      var angdb = room.$child($scope.roomID);
		      $scope.users = angdb.$child("members");
		      $scope.theme = angdb.$child('theme');
		      $scope.postits = angdb.$child('postits');
		      $scope.groups = angdb.$child('groups');
		      // えらーしょりひつよう
		      // User Add してないなら；／／／
		      $scope.user =  $cookies[$scope.roomID+'.name'];
		      if(typeof $scope.roomID !== 'undefined'){
			  //redirect
		      }
		      //$scope.theme = 'None';
		      $scope.addPostIt = function(){
			  $scope.postits = angdb.$child('postits');
			  var newPostit = $scope.postits.$add({
			      text:'New Postit',
			      pos_x : 0,
			      pos_y : 0,
			      color:'#FFFFFF',
			      created_id:'',
			      holding_id:'',
			  });
			  return newPostit;
			  //userUI.addPostIt($scope.roomID);
		      }
		      $scope.addGroup = function(){
			  $scope.groups = angdb.$child('groups');
			  var newGroup = $scope.groups.$add({
			      pos_x : 0,
			      pos_y : 0,
			      width : 200,
			      height: 200,
			      created_id: 0,
			      holding_id: 'NULL',
			      color:'#FFFFFF',
			      text:'New Group',
			  });
			  return newGroup;
			  //userUI.addGroup(0,0,100,100,'red','None');
		      }
		      $scope.viewSheet = function(){
			  //userUI.viewSheet()
		      }
		      $scope.round = Math.floor;
		      $scope.count = 5*60;

		      $scope.onTimeout = function(){
			  $scope.count--;
			  console.log($scope.count)
			  if ($scope.count >= 0)
			      mytimeout = $timeout($scope.onTimeout,1000);
			  else
			      $timeout.cancel(mytimeout);
		      }

		      $scope.timerStart = function(){
			  var mytimeout = $timeout($scope.onTimeout,1000);
		      }
		      $scope.timerDecrease = function(){
			  $scope.count-=60;
		      }
		      $scope.timerIncrease = function(){
			  $scope.count+=60;
		      }
		      $scope.stop = function(){
			  $timeout.cancel(mytimeout);
		      }
		      
		      $scope.owner = $cookies[$scope.roomID+'.flag'];
		      ///$scope.owner = 'false';
		      angular.element(document).ready(function() {
			  // Postitの処理
			  $(document).on('mouseover','.draggablePostIt',function(e){
			      if(!$(e.target).hasClass('content')){
				  $(this).draggable(PostIts.draggableOpt);
				  $(this).draggable('enable');
				  var id = $(this).get(0).id;
				  var postit = $scope.postits.$child(id);
				  var offset = $(this).offset();
				  DB.setPos(postit,offset.left,offset.top,$scope.postits);
			      }
			  });
			  
			  $(document).on('mouseout','.draggablePostIt',function(e){
			      $(this).draggable(PostIts.draggableOpt);
			      $(this).draggable('disable');
			      var id = $(this).get(0).id;
			      var postit = $scope.postits.$child(id);
			      var offset = $(this).offset();
			      DB.setPos(postit,offset.left,offset.top,$scope.postits);
			  });
			  
			  // Group
			  $(document).on('mouseover','.draggableGroup',function(e){
			      $(this).droppable(Groups.droppableOpt);
			      if(!$(e.target).hasClass('content')){
				  $(this).draggable(Groups.draggableOpt);
				  $(this).draggable('enable');
				  
				  var id = $(this).get(0).id;
				  var group = $scope.groups.$child(id);
				  var offset = $(this).offset();
				  DB.setPos(group,offset.left,offset.top,$scope.groups);
			      }
			  });
			  $(document).on('mouseout','.draggableGroup',function(e){
			      $(this).draggable(Groups.draggableOpt);
			      $(this).draggable('disable');
			      var id = $(this).get(0).id;
			      var group = $scope.groups.$child(id);
			      var offset = $(this).offset();
			      DB.setPos(group,offset.left,offset.top,$scope.groups);

			  });


			  $(document).on('keyup','.draggablePostIt',function(e){
			      var id = $(this).get(0).id;
			      var postit = $scope.postits.$child(id);
			      var t = postit.$child('text');
			      $scope.postits.$off();
			      t.$set($(this).text()).
				  finally(function(){
				      $scope.postits.$on();
				  });
			  });
			  $(document).on('keyup','.draggableGroup',function(e){
			      var id = $(this).get(0).id;
			      var group = $scope.groups.$child(id);
			      var t = group.$child('text');
			      $scope.groups.$off();
			      t.$set($(this).text()).
				  finally(function(){
				      $scope.groups.$on();
				  });
			  });
			  
		      });
		      
		      $scope.func = function(){
			  $scope.test = DB.test;
			  //DB.data.roomTheme = '';
		      }
		  }]);
storm.controller('StormMakeCtrl',
		 ['$scope','$http','$cookies','$location','$firebase',
		  function($scope,$http,$cookies,$location,$firebase){
		      $scope.text = 'TEXT';
		      $scope.abs = 'ASDFASF';
		      //		      $cookies.abs = 'gs';
		      $scope.submit = function(){

			  var ref = new Firebase("https://localbrainst-samui13.firebaseio.com/rooms/");				     
			  var rooms = $firebase(ref);
			  var room = ref.push({
			      theme:this.theme
			  });
			  //rooms.child(room.name);
			  var memberData = room.child('members').push({
			      name:this.name,
			      color:'#FF0000',
			      owner_flag:'true'
			  });
			  var groupsRef = room.child('groups');
			  var postits = room.child('postits');
			  
			  var data = {};
			  data.ID = room.name();
			  data.membder_id = memberData.name();
			  
			  //this.text
			  //var data = userUI.createRoom(this.theme,this.name);
			  $cookies[data.ID+'.name'] = this.name;
			  $cookies[data.ID+'.member_id'] = data.member_id;
			  $cookies[data.ID+'.title'] = 'test';
			  $cookies[data.ID+'.color'] = '#FF0000';
			  $cookies[data.ID+'.flag'] = 'true';
			  $location.path("/brain/"+data.ID);

		      };
		  }]);



