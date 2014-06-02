angular.module('stormTest',[]).
    service('ColorService',function(){
	var color='#00FF00';
	return {
	    setColor:function(c){
		color = c;
		return true;
	    },
	    getColor : function(){
		return color;
	    }
	}
    });

angular.module('stormFactory',[]).factory('RoomService',['$firebase',function($firebase){
    var ref = new Firebase("https://localbrainst-samui13.firebaseio.com/");
    var DB = $firebase(ref);
    var rooms = DB.$child('rooms');
    var roomID;
    return {
	setPos : function(obj,x,y,objs){
	    var posx =  obj.$child('pos_x');
	    var posy =  obj.$child('pos_y');
	    //objs.$off();
	    posx.$set(x).
		finally(function(){
		    posy.$set(y).finally(function(){
			//objs.$on();
		    });
		    //objs.$on();
		});
	},
	getRef: function(){
	    return rooms;
	},
	setRoom:function(id){
	    roomID = id;
	    room = rooms.$child(id);
	},
	getDB: function(id){
	    this.setRoom(id);
	    return room;//rooms.$child(id);
	},
	getUsers: function(){
	    return rooms.$child(roomID).$child("members");
	},
    };
    
}]);
