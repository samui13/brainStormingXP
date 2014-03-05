if(typeof stormControllers === 'undefined')
    var storm = angular.module('stormControllers',[]);

storm.factory("RoomService",function(){
    var ref = new Firebase("https://localbrainst-samui13.firebaseio.com/rooms/"+$scope.roomID);
    
});

storm.controller('StormAddUserCtrl',
		 ['$scope','$location','$routeParams','$cookies','$cookieStore',
		  function($scope,$location,$routeParams,$cookies,$cookieStore){
		      $scope.title = 'TEST'
		      $scope.roomID = $routeParams.roomID;
		      
		      $scope.submit = function(){
			  $cookies[$scope.roomID+'.name'] = this.content;
			  $location.path("brain/"+$scope.roomID);
			  
		      }
		  }]);
// brain/:hash
storm.controller('StormCtrl',
		 ['$scope','$http','$routeParams','$cookies','$firebase',
		  function($scope,$http,$routeParams,$cookies,$firebase){
		      console.log($cookies);
		      // ここはえらーしょりなくてもいいかも
		      $scope.roomID = $routeParams.roomID;
		      // Serviceにかくべき。
		      var ref = new Firebase("https://localbrainst-samui13.firebaseio.com/rooms/"+$scope.roomID);
		      var angdb = $firebase(ref);
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
			  var newPostit = $scope.postits.$add({
			      text:'New Postit',
			      pos_x : 0,
			      pos_y : 0,
			      color:'#FFFFFF',
			      created_id:'',
			      holding_id:'',
			  });
			  console.log(newPostit);
			  return newPostit;
			  //userUI.addPostIt($scope.roomID);
		      }
		      $scope.addGroup = function(){
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
		      
		      angular.element(document).ready(function() {
			  console.log(PostIts.draggableOpt);
			  // Postitの処理
			  $(document).on('mouseover','.draggablePostIt',function(e){
			      if(!$(e.target).hasClass('content')){
				  $(this).draggable(PostIts.draggableOpt);
				  $(this).draggable('enable');
			      }
			  });
			  $(document).on('mouseout','.draggablePostIt',function(e){
			      $(this).draggable('disable');
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
		      $cookies.abs = 'gs';
		      $scope.submit = function(){

			  var ref = new Firebase("https://localbrainst-samui13.firebaseio.com/rooms/");				     
			  var rooms = $firebase(ref);
			  var room = ref.push({
			      theme:this.theme
			  });
			  //rooms.child(room.name);
			  var memberData = room.child('members').push({
			      name:this.name,
			      color:'test',
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
			  $cookies[data.ID+'.color'] = 'test';
			  $cookies[data.ID+'.flag'] = 'true';
			  $location.path("/brain/"+data.ID);

		      };
		  }]);



