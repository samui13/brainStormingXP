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
    console.log(this.data.roomRef);
    this.data.roomRef.child('theme').once('value',function(snapshot){
	var title = snapshot.val();
	DB.data.roomTheme = title;
    });
    this.data.membersRef.on('child_added',function(snapshot){
	var member = snapshot.val();
	
    });
};
DB.createRoom = function(theme,name){
    var roomRef = this.roomsRef.push({theme:theme});
    var membersRef = roomRef.child('members');
    var memberData = membersRef.push({
	name:name,
	color:'test',
	owner_flag:'true',
    });
    var groupsRef = roomRef.child('groups');
    var data = {
	ID:roomRef.name(),
	member_id:memberData.name(),
	color:'color',
	flag:'true',
    };
    return data;
}

DB.init();
