function testData(){
    PostIts.fn.create({text:'Hello'});
    PostIts.fn.create({text:'HelloWorld'});
    for(var key in PostIts.list){
	var obj = PostIts.list[key];
	obj.render($("#brestField"));
	obj.setEnv();
    }
    //t.elem.css('position','absolute');
    for(var key in PostIts.list){
	var obj = PostIts.list[key];
	obj.changeCSS();
    }
    var obj = Groups.fn.create({tag:'ATEAM'});
    obj.render($("#brestField"));
    obj.setEnv();
    $("#brestField").droppable({});
};

