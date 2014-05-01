
angular.
    module('stormCtrl',['stormFilter','stormFactory','stormTest','ui.bootstrap']).
    controller('StormCtrl',
	       ['$scope','$location','$http','$routeParams','$cookies','$firebase','RoomService','$timeout',
		function($scope,$location,$http,$routeParams,$cookies,$firebase,DB,$timeout){
		    // brain/:hash
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
		      $scope.open = angdb.$child('openPostit');
		      //$scope.postits = angdb.$child('postits');
		      angdb.$child('postits').$bind($scope,'postits').then(function(){
			  /*
			  var count = 0;
			  for(var key in $scope.postits){
			      var postit = $scope.postits[key];
			      if(typeof postit !== "object")
				  continue
			      postit.pos_x = 30+(count%4)*260;
			      postit.pos_y = 100+Math.floor(count/4)*50;
			      count+=1;
			  }
			  */
		      });
		      //$scope.groups = angdb.$child('groups');
		      angdb.$child('groups').$bind($scope,'groups');
		      // えらーしょりひつよう
		      // User Add してないなら；
		      $scope.user =  $cookies[$scope.roomID+'.name'];
		      

		      if(typeof $scope.roomID !== 'undefined'){
			  //redirect
		      }
		      //$scope.theme = 'None';
		      $scope.addPostIt = function(posX,posY){
			  if(typeof $scope.postits == 'undefined')
			      return;
			  if(typeof posX === 'undefined')
			      posX = 0;
			  if(typeof posY === 'undefined')
			      posY = 0;
			  var newPostit = angdb.$child('postits').$add({
			      text:'New Postit',
			      pos_x : posX,
			      pos_y : posY,
			      color: $cookies[$scope.roomID+'.color'],
			      created_id: parseInt((new Date)/1000), // 作成時間
			      holding_id: $cookies[$scope.roomID+'.member_id'], // UserID
			      group_id:'',// Group IDを保持
			      editor_id:'', // 編集している人のID
			  }).finally(function(){
			      //angdb.$child('postits').$bind($scope,'postits');
			  });
			  return newPostit;
		      }
		      $scope.addGroup = function(){
			  //$scope.groups = angdb.$child('groups');
			  var newGroup = angdb.$child('groups').$add({
			      pos_x : 0,
			      pos_y : 0,
			      width : 200,
			      height: 200,
			      created_id: parseInt((new Date)/1000),
			      holding_id: $cookies[$scope.roomID+'.member_id'],
			      color:'#FFFFFF',
			      text:'New Group',
			  }).finally(function(){
			      if(typeof $scope.groups == 'undefined')
				  angdb.$child('groups').$bind($scope,'groups');
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
		      $scope.freshPostitTEXT = function($event){
			  var id = ($($event.currentTarget).offsetParent()).get(0).id;
			  var text = $($event.target).get(0).textContent;
			  $scope.postits[id].text = text;
		      }
		      $scope.freshGroupTEXT = function($event){
			  var id = ($($event.currentTarget).offsetParent()).get(0).id;
			  var text = $($event.target).get(0).textContent;
			  $scope.groups[id].text = text;
		      }
		      $scope.createPostit = function($event){
			  // Dblclickで Postit 作成
			  var target = $($event.target);
			  if(target.hasClass('group') || target.hasClass('draggablePostIt') ||
				target.hasClass('content'))
				 return false;

			      $scope.addPostIt($event.clientX,$event.clientY);
		      }
		      $scope.movePostit = function($event){
			  // Postitの移動処理
			  var target = $($event.target);
			  if(!target.hasClass('content')){
			      target.draggable(PostIts.draggableOpt);
			      target.draggable('enable');
			      var id = target.get(0).id;
			      var offset = target.offset();
			      if(target.parent().hasClass('group')){
				  $scope.postits[id].group_id = "";
			      }

			      $scope.postits[id].pos_x = offset.left;
			      $scope.postits[id].pos_y = offset.top;
			  }
		      }
		      $scope.moveGroup = function($event){
			  //Group の移動処理
			  var target = $($event.target);
			  if(target.hasClass('group')){
			      target.droppable(Groups.droppableOpt);
			      target.draggable(Groups.draggableOpt);
			      target.draggable('enable');
			      var id = target.get(0).id;
			      var offset = target.offset();
			      $scope.groups[id].pos_x = offset.left;
			      $scope.groups[id].pos_y = offset.top;
			  }
		      }
		      $scope.colorGroup = function($event){
			  var target = $($event.target);
			  var id = target.get(0).id;
			  if($(target).hasClass('draggablePostIt')){
			      return false;
			  }
			  var c = $scope.groups.$child(id).$child('color');
			  var colors = ['#fef4f4','#c4a3bf','#ebf6f7',
					'#f8e58c','#ffffff','#f8b862'];
			  var now = $('#'+id).css('background-color');
			  var rgb2hex = function (rgb) {
			      rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			      function hex(x) {
				  return ("0" + parseInt(x).toString(16)).slice(-2);
			      }
			      return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
			  }
			  var colorIndex = ((colors.indexOf(rgb2hex(now))+1)%colors.length);
			  var color = colors[colorIndex];
			  c.$set(color).finally(function(){
			      $("#"+id).css('background-color',color);
			  });

		      }
		      angular.element(document).ready(function() {
			  
			  $(document).on('mouseout','.draggablePostIt',function(e){
			      $(this).draggable(PostIts.draggableOpt);
			      $(this).draggable('disable');
			      var id = $(this).get(0).id;
			      var offset = $(this).offset();
			      $scope.postits[id].pos_x = offset.left;
			      $scope.postits[id].pos_y = offset.top;						      
			      // Post It がGroupに被っていたときの処理。
			  });
			  
			  // Group
			  $(document).on('mouseout','.draggableGroup',function(e){
			      $(this).draggable(Groups.draggableOpt);
			      $(this).draggable('disable');
			      var id = $(this).get(0).id;
			      var offset = $(this).offset();
			      $scope.groups[id].pos_x = offset.left;
			      $scope.groups[id].pos_y = offset.top;			      
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

			  $(".trash").droppable({
			      drop:function(e,ui){
				  var id = $(ui.draggable[0]).attr('id');
				  var postit = $scope.postits.$child(id);
				  var hold = postit.$child('holding_id');
				  $("#"+id).remove();
				  $scope.postits.$remove(id);				  
				  postit.$remove();
				  $(".trashIcon").css('font-size','5em');
			      },
			      over:function(e,ui){
				  $(".trashIcon").css('font-size','10em');
			      },
			      out:function(e,ui){
				  $(".trashIcon").css('font-size','5em');
			      },
			  });
		      });
		  }]);
