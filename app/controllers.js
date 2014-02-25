if(typeof stormControllers === 'undefined')
    var storm = angular.module('stormControllers',[]);



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
				$scope.gropus = angdb.$child('groups');
				 // えらーしょりひつよう
				 // User Add してないなら；／／／
				$scope.user =  $cookies[$scope.roomID+'.name'];
				if(typeof $scope.roomID !== 'undefined'){
				    //redirect
				    
				}
				DB.connectRoom($scope.roomID);
				
				//$scope.theme = 'None';
				$scope.addPostIt = function(){
				    userUI.addPostIt($scope.roomID);
				}
				$scope.addGroup = function(){
				    
				    userUI.addGroup(0,0,100,100,'red','None');
				}
				$scope.viewSheet = function(){
				    userUI.viewSheet()
				}

				angular.element(document).ready(function() {
				    //testData();
				});
				$scope.func = function(){
				    $scope.test = DB.test;
				    //DB.data.roomTheme = '';
				}
				/*
				$scope.$watch(function(){
				    return DB.test;
				},function(newVal,oldAval){
				    console.log('Called');
				    console.log(newVal,oldAval);
				});
				*/
				$scope.$watch(function(){
				    return DB.data.roomTheme;
				},function(newVal,oldVal){
				    //$scope.theme = DB.data.roomTheme;
				});

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

 

