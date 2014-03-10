angular.module('stormFactory',[]).factory('RoomService',['$firebase',function($firebase){
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
