userUI = {};
userUI.createRoom = function(theme,name){
    var data = DB.createRoom(theme,name);
    return data;
};
userUI.fn = {};
userUI.fn.orderField = function(){
    
};

userUI.addPostIt = function(roomID){
    var postit = DB.order.create_Postit(0,0,'color',roomID);
    /*
    var t = PostIts.fn.create({text:'Hello'});
    t.id = postit.postit_id;
    t.render($("#brestField"));
    t.setEnv();
    t.changeCSS();
    */
};

userUI.addGroup = function(member_id){
    //var obj = Groups.fn.create({tag:'Group'});
    var group = DB.order.create_group(0,0,300,300,'color',member_id);
    console.log(group);
};

userUI.viewSheet = function(){
    $("#brestField").css('display','none');
    var html = $("#sheet");
    $("#sheet").html("");
    for(var key in PostIts.list){
	var postit =  PostIts.list[key];
	$("<p>"+postit.text+"</p>").appendTo($("#sheet"));
	
    }
    $("#sheet").css('display','inline');
};
