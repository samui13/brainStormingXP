DB = {
    data:{},
    order:{},
    registFN:{},
};
DB.init = function(){
    this.connect = new Firebase('https://mytestapp-samui13.firebaseio.com/');
    this.roomsRef = this.connect.child('rooms');
    /*
    this.data.roomRef = this.roomsRef.child('members');
    */
};
DB.connectRoom = function(roomID){
    if(typeof this.roomsRef == 'undefined')
	DB.init();
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
    DB.registFN.postits();
    DB.registFN.groups();
};
DB.registFN.groups = function(){
    DB.data.groupsRef.on('child_added',function(snapshot){
        var group = snapshot.val();
        if(group.holding_id != "NULL"){
	    
        }else{
	    if( typeof group.name ==='undefined')
		group.name = 'None';
	    var obj = Groups.fn.create({tag:group.name});
	    obj.id = snapshot.name();
	    obj.render($("#brestField"));
	    obj.setEnv();
            //element = document.getElementById(snapshot.name());
            //element.innerHTML = group.name;
            //element style pos_x,pos_y
        }
    });
};
DB.registFN.postits = function(){
    DB.data.postitsRef.on('child_added',function(snapshot){
	var postit_id = snapshot.name();
        var postit = snapshot.val();
//        if(postit.holding_id != $.cookie("member_id")){
            var t = PostIts.fn.create({text:'Hello'});
            t.id = postit_id;
            t.color = postit.color;
            t.render($("#brestField"));
            t.elem.offset({
                top:postit.pos_x,
                left:postit.pos_y,
            })
            t.setEnv();
            t.changeCSS();
            $('.content', $("#" + snapshot.name())).text(postit.content);
//        }

	
    });
}
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
};
DB.order.create_Postit = function(pos_x,pos_y,color,member_id){
    //var postitId = create_postit("20","10","#ff00ff",memberId).postit_id;
    var postitRef = DB.data.postitsRef.push({
	pos_x:pos_x, 
	pos_y:pos_y, 
	color:color, 
	created_id:member_id, 
	holding_id:member_id
    });
    return {
	postit_id:postitRef.name(),
	holding_id: member_id,
    };
}
DB.order.create_group = function(pos_x,pos_y,width,height,color,created_id){
    
    var groupsRef = DB.data.groupsRef;
    var groupRef = groupsRef.push({
	pos_x : pos_x,
	pos_y : pos_y,
	width : width,
	height : height,
	created_id : created_id,
	holding_id : "NULL",
	color:color,
    });
    return {
	group_id : groupRef.name(),
	hodling_id: "NULL",
    }
}

DB.init();
