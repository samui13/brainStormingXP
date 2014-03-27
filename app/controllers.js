if(typeof stormControllers === 'undefined'){
    var storm = angular.module('stormControllers',['stormFilter','stormFactory','stormTest']);
}
storm.controller('StormAddUserCtrl',
		 ['$scope','$location','$routeParams','$cookies','$cookieStore','RoomService','ColorService',
		  function($scope,$location,$routeParams,$cookies,$cookieStore,DB,ColorDB){
		      $scope.roomID = $routeParams.roomID;
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
		      $scope.ShowSlide = function(){
			  if($("#UserList").is(":hidden"))
			      $('#UserList').slideDown('slow');
			  else
			      $('#UserList').hide('slow');
		      };
		      // Serviceにかくべき。
		      var room = DB.getRef();
		      var angdb = room.$child($scope.roomID);
		      $scope.users = angdb.$child("members");
		      $scope.theme = angdb.$child('theme');
		      $scope.postits = angdb.$child('postits');
		      $scope.groups = angdb.$child('groups');
		      // えらーしょりひつよう
		      // User Add してないなら；
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
			      color: $cookies[$scope.roomID+'.color'],
			      created_id: parseInt((new Date)/1000), // 作成時間
			      holding_id: $cookies[$scope.roomID+'.member_id'], // UserID
			      group_id:'',// Group IDを保持
			      editor_id:'', // 編集している人のID
			  });
			  return newPostit;
		      }
		      $scope.addGroup = function(){
			  $scope.groups = angdb.$child('groups');
			  
			  var newGroup = $scope.groups.$add({
			      pos_x : 0,
			      pos_y : 0,
			      width : 200,
			      height: 200,
			      created_id: parseInt((new Date)/1000),
			      holding_id: $cookies[$scope.roomID+'.member_id'],
			      color:'#FFFFFF',
			      text:'New Group',
			  });
			  return newGroup;
		      }
		      $scope.viewSheet = function(){
			  //userUI.viewSheet()
		      }
		      $scope.round = Math.floor;
		      $scope.count = 5*60;

		      $scope.onTimeout = function(){
			  // 2度おし防止
			  if(typeof mytimeout !== 'undefined')
			      $timeout.cancel(mytimeout);
			  $scope.count--;
			  if ($scope.count >= 0)
			      mytimeout = $timeout($scope.onTimeout,1000);
			  else
			      $timeout.cancel(mytimeout);
		      }

		      $scope.timerStart = function(){
			  var mytimeout = $timeout($scope.onTimeout,1000);
		      }
		      $scope.timerDecrease = function(){
			  if(typeof mytimeout !== 'undefined' && $timeout.cancel(mytimeout) == true){
			      $scope.timerStart();
			      return;
			  }
			  $scope.count-=60;
		      }
		      $scope.timerIncrease = function(){
			  if(typeof mytimeout !== 'undefined' && $timeout.cancel(mytimeout) == true){
			      $scope.timerStart();
			      return;
			  }
			  $scope.count+=60;
		      }
		      $scope.timerStop = function(){
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
			      // Post It がGroupに被っていたときの処理。
			  });
			  
			  // Group
			  $(document).on('mouseover','.draggableGroup',function(e){
			      if($(e.target).hasClass('group')){
				  //
				  $(this).droppable(Groups.droppableOpt);
				  $(this).draggable(Groups.draggableOpt);
				  $(this).draggable('enable');
				  console.log($(e.target).hasClass('group'));
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
			      // 取り敢えず、マウスがグループから離れたときに
			      // グループの中身を調べてポストイットがあればgroup_idを変更する
			      // そとにだした場合にはPostit mouseoutEventで登録
			      var groupElem = $('#'+id);
			      $.each(groupElem.children(),function(t,m){
				  var contentID = $(m).get(0).id;
				  var elem = $('#'+contentID);
				  if(contentID == '')
				      return true;
				  var postit = $scope.postits.$child(contentID).$child('group_id');
				  if(!(postit.$value == contentID))
				      postit.$set(id);
			      });
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
storm.controller('StormMakeCtrl',
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
			  data.member_id = memberData.name();
			  //this.text
			  $cookies[data.ID+'.name'] = this.name;
			  $cookies[data.ID+'.member_id'] = data.member_id;
			  $cookies[data.ID+'.title'] = 'test';
			  $cookies[data.ID+'.color'] = '#FF0000';
			  $cookies[data.ID+'.flag'] = 'true';
			  $location.path("/brain/"+data.ID);

		      };
		  }]);

