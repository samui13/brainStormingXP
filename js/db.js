DB = {
    data:{},
};
DB.init = function(){
    this.connect = new Firebase('https://mytestapp-samui13.firebaseio.com/');
    this.roomsRef = this.connect.child('rooms');
    /*
    this.data.roomRef = this.roomsRef.child('members');
    */
};
DB.connectRoom = function(roomID){
    this.data.roomRef = this.roomsRef.child(roomID);
    var room = this.data.roomRef;
    this.data.membersRef = room.child('members');
    this.data.postitsRef = room.child('postits');
    this.data.groupsRef = room.child('groups');
    this.data.roomRef.child('theme').once('value',function(snapshot){
	var title = snapshot.val();
	DB.data.roomTheme = title;
    });
    
};
DB.createRoom = function(theme,name){
    var roomRef = this.roomsRef.push({theme:'TESTCode'});
    var data = {
	ID:roomRef.name(),
    };
    
    return data;
}

DB.init();
