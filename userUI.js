userUI = {};
userUI.fn = {};
userUI.fn.orderField = function(){
    
}

userUI.addPostIt = function(){
//    userUI.fn.orderField();
    var t = PostIts.fn.create({text:'Hello'});
    t.render($("#brestField"));
    t.setEnv();
    t.changeCSS();
};

userUI.addGroup = function(){
    var obj = Groups.fn.create({tag:'Group'});
    obj.render($("#brestField"));
    obj.setEnv();
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
