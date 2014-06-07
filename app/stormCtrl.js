angular.
    module('stormCtrl',['stormFilter','stormFactory','stormTest','ui.bootstrap']).
    controller('StormCtrl',
	       ['$scope','$location','$http','$routeParams','$cookies','$firebase','RoomService','$timeout',
		function($scope,$location,$http,$routeParams,$cookies,$firebase,DB,$timeout){
		    // brain/:hash
		    $scope.roomID = $routeParams.roomID;
		    if(!$cookies[$scope.roomID+'.name']){
			// Need Login
			$location.path("/login/"+$scope.roomID);
		    }
		    // ユーザーリスト表示用
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
		    angdb.$child('postits').$bind($scope,'postits').then(function(){
		    });
		    angdb.$child('groups').$bind($scope,'groups');
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
			    pos_y : posY-$scope.headerOffsetY,
			    color: $cookies[$scope.roomID+'.color'], //色
			    created_id: parseInt((new Date)/1000), // 作成時間
			    holding_id: $cookies[$scope.roomID+'.member_id'], // UserID
			    group_id:'',// Group IDを保持
			    editor_id:'', // 編集している人のID
			}).finally(function(){
			});
			return newPostit;
		    }
		    $scope.addGroup = function(){
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
			});
			return newGroup;
		    }
		    $scope.viewSheet = function(){
		    }
		    $scope.count = angdb.$child('timerCount');
		    $scope.owner = $cookies[$scope.roomID+'.flag'];

		    $scope.createPostit = function($event){
			// Dblclickで Postit 作成
			var target = $($event.target);
			if(target.hasClass('group') ||
			   target.hasClass('draggablePostIt') ||
			   target.hasClass('content'))
			    return false;
			$scope.addPostIt($event.clientX,$event.clientY);
		    }
		    $scope.movePostit = function($event){
			// Postitの移動処理
			// mouserover(のったら)したら。
			var target = $($event.target);
			if(!target.hasClass('content')){
			    return false;
			}
			target.draggable(PostIts.draggableOpt);
			target.draggable('enable');
			var id = target.get(0).id;
			var offset = target.offset();
			var postit = $scope.postits[id];
			postit.pos_x = offset.left;
			postit.pos_y = offset.top - $scope.headerOffsetY;
			
		    }
		    $scope.moveGroup = function($event){
			//Group の移動処理
			var target = $($event.target);
			if(target.hasClass('group')){
			    return false;
			}
			target.droppable({
			    drop:Groups.droppableOpt.drop,
			    out:function(e,ui){
				var parentID = $(ui.helper[0]).get(0).id;
				var obj = $("#"+parentID);
				var postit = $scope.postits[parentID]
				$scope.postits
				    .$child(parentID)
				    .$child('group_id').
				    $set('');
				postit.group_id = '';
				postit.pos_x = e.clientX;
				postit.pos_y = e.clientY;
				obj.css({
				    "left":e.clientX,
				    "top":e.clientY-$scope.headerOffsetY
				});
			    }
			});
			target.draggable(Groups.droggableOpt);
			target.draggable('enable');
			var id = target.get(0).id;
			var offset = target.offset();
			$scope.groups[id].pos_x = offset.left;
			$scope.groups[id].pos_y = offset.top-$scope.headerOffsetY;
		    }
		    $scope.colorGroup = function($event){
			// Dblclickで、グループの背景色をかえる。
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
			    var hex = function(x) {
				return ("0" + parseInt(x).toString(16)).slice(-2);
			    }
			    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
			}
			var colorIndex = ((colors.indexOf(rgb2hex(now))+1)%colors.length);
			var color = colors[colorIndex];
			c.$set(color).
			    finally(function(){
			    $("#"+id).css('background-color',color);
			});

		    }
		    $scope.removeGroup = function($event){
			var group = $($($event.target.offsetParent).get(0));
			var groupID = group.attr('id');
			group.remove();
			$scope.groups.$remove(groupID);
			$.each(group.children(),function(i,val){
			    var dom = $(val);
			    if(!dom.hasClass('draggablePostIt'))
				return true;
			    var postitID = dom.attr('id');
			    var postit = $scope.postits[postitID];
			    postit.group_id = '';
			});
		    }
		    angular.element(document).ready(function() {
			// Headerの高さぶんElementの座標をかえるためのやつ。
			$scope.headerOffsetY = parseInt($("#header").css('height'));

			$(document).on('mouseout','.draggablePostIt',function(e){
			    $(this).draggable(PostIts.draggableOpt);
			    $(this).draggable('disable');
			    var id = $(this).get(0).id;
			    var offset = $(this).offset();
			    var postit = $scope.postits[id];
			    postit.pos_x = offset.left;
			    postit.pos_y = offset.top-$scope.headerOffsetY;	
			    // Post It がGroupに被っていたときの処理
			});
			
			// Group
			$(document).on('mouseout','.draggableGroup',function(e){
			    $(this).draggable(Groups.draggableOpt);
			    $(this).draggable('disable');
			    var id = $(this).get(0).id;
			    var offset = $(this).offset();
			    var group = $scope.groups[id];
			    group.pos_x = offset.left;
			    group.pos_y = offset.top-$scope.headerOffsetY;			      
			    // 取り敢えず、マウスがグループから離れたときに
			    // グループの中身を調べてポストイットがあればgroup_idを変更する
			    // そとにだした場合にはPostit mouseoutEventで登録
			    var groupElem = $('#'+id);
			    $.each(groupElem.children(),function(t,m){
				var contentID = $(m).get(0).id;
				var elem = $('#'+contentID);
				if(contentID == '')
				    return true;
				$scope.postits[contentID].group_id = id;
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
