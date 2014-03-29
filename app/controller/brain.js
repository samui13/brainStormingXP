angular.module('stormControllers',['stormFilter','stormFactory','stormTest']).
    controller('StormCtrl',
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
		      $scope.addPostIt = function(posX,posY){
			  if(typeof posX === 'undefined')
			      posX = 0;
			  if(typeof posY === 'undefined')
			      posY = 0;
			  $scope.postits = angdb.$child('postits');
			  var newPostit = $scope.postits.$add({
			      text:'New Postit',
			      pos_x : posX,
			      pos_y : posY,
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
		      $scope.count = angdb.$child('timerCount');
		      $scope.UnixEndTime = angdb.$child('timerDate');
		      
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
		      
		      $scope.UnixTime = function(){
			  return parseInt((new Date)/1000);
		      }
		      $scope.timer = function(){
			  $scope.mytimeout = $timeout($scope.timer,1000);
			  if (parseInt($scope.UnixEndTime.$value) < $scope.UnixTime()){
			      $scope.time = 0;
			      //$timeout.cancel($scope.mytimeout);
			      return;
			  }
			  $scope.time = parseInt($scope.UnixEndTime.$value)-$scope.UnixTime();
		      };
		      $scope.mytimeout = $timeout($scope.timer,1000);

		      $scope.timerStart = function(){
			  /*
			  var mytimeout = $timeout($scope.onTimeout,1000);
			  */
			  angdb.$child('timerDate').$set(parseInt((new Date)/1000)+parseInt($scope.count.$value));
		      }
		      $scope.timerDecrease = function(){
			  if(typeof mytimeout !== 'undefined' && $timeout.cancel(mytimeout) == true){
			      $scope.timerStart();
			      return;
			  }
			  $scope.count.$value-=60;
		      }
		      $scope.timerIncrease = function(){
			  if(typeof mytimeout !== 'undefined' && $timeout.cancel(mytimeout) == true){
			      $scope.timerStart();
			      return;
			  }
			  $scope.count.$value+=60;
		      }
		      $scope.timerStop = function(){
			  $timeout.cancel(mytimeout);

		      }
		      
		      $scope.owner = $cookies[$scope.roomID+'.flag'];
		      ///$scope.owner = 'false';
		      angular.element(document).ready(function() {
			  // Postit 作成
			  $(document).on('dblclick','#brestField',function(e){
			      
			      $scope.addPostIt(e.clientX,e.clientY);
			  });
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


			  $(document).on('keypress','.draggablePostIt',function(e){
			      var id = $(this).get(0).id;
			      //console.log("Postit",$(this).children(0));
			      var postit = $scope.postits.$child(id);
			      var t = postit.$child('text');
			      var text = $(this).children(0).text();
			      //console.log(text.replace(/[\n\r]/g,""));
			      t.$set(text).
				  finally(function(){
				      $(this).focus();
				      // $scope.postits.$on();
				  });

			  });
			  $(document).on('keyup','.draggableGroup',function(e){
			      var id = $(this).get(0).id;
			      //console.log("Group",$(':focus')[0]);
			      //console.log("Group",$($(this).children(0)[0]).text());
			      var group = $scope.groups.$child(id);
			      var t = group.$child('text');
			      var text = $($(this).children(0)[0]).text();
			      //console.log(text.replace(/[\n\r\t]/g,""));

			      t.$set(text).
				  finally(function(){
				      //$(this).focus();
				  });

			  });
			  
			  $(".trash").droppable({
			      drop:function(e,ui){
				  var id = $(ui.draggable[0]).attr('id');
				  var postit = $scope.postits.$child(id);
				  //console.log(id,postit);
				  //postit.$remove();
				  var hold = postit.$child('holding_id');
				  //postit.$update({holding_id:-1});
				  ///postit.$off('loaded');
				  $scope.postits.$remove(id);				  
				  postit.$remove();
				  
			      },
			  });
			  /*
			  $(document).on('mouseover','.trash',function(e){
			      var id = $(this).get(0).id;
			      var postit = $scope.postits.$child(id);
			      console.log(id,$(e.target),$(this),e);
			  });
			  */
			  
		      });
		      
		      $scope.func = function(){
			  $scope.test = DB.test;
			  //DB.data.roomTheme = '';
		      }
		  }]);
