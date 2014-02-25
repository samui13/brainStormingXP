Groups = {};
Groups.list = [];
Groups.fn = {};
Groups.droggableOpt = {
    zIndex:2,
}
Groups.droppableOpt = {
    drop:function(e,ui){
	$(this).css('z-index',2);
	var obj = ui.draggable;
	if(!$(obj.parent().get(0)).hasClass('group')){
	    var obj = ui.draggable.appendTo($(this));
	    var offset = $(this).offset()
	    obj.offset({
		top:offset.top,
		left:offset.left,
	    })
	    obj.css('position','relative');
	    //obj.css('position','absolute');
	    //obj.offset({top:obj.offset().top+30});
	    return;
	}
	if($(obj.parent().get(0)).hasClass('group')){
	    var offset = $(this).offset()
	    obj.offset({

	    })
	    //obj.offset().top;
	    if(obj.offset().top<0)
		obj.offset.top = 40;
	}
    },
    out:function(e,ui){
	var obj = $("#"+$(ui.helper[0]).get(0).id);
	///ui.draggable.removeClass("group");
	//obj.appendTo($("#brestField"));
	var offset = $(this);
	console.log($(this));
	obj.offset({
	    top:e.clientY,
	    left:e.clientX,
	});
	console.log(obj);
    },
    over:function(e,ui){
	
	/*
	ui.draggable.appendTo($("#brestField"));
	var obj = ui.draggable.appendTo($("#brestField"));
	obj.offset({top:0,left:0});
	console.log(obj);
	*/
	/*
	var obj = ui.draggable;
	obj.offset({
	    top:obj.offset.top+$("#brestField").offset().top,
	    left:obj.offset.left+$("#brestField").offset().left,
	});
	obj.offset({top:0,left:0});
	console.log(obj);
	*/
    }
};
Groups.__template = '\
<div id="group-{{data.id}}" class="group droppableGroup draggableGroup" style="">\n\
<div class="footer" contenteditable="true"><h3>{{data.tag}}</h3></div>\n\
</div>\n\
';
Groups.fn.create = function(params){
    var obj = {
	id:-1,
	x:0,
	y:0,
	tag:'',
	color:'#A0A0A0',
	elem:{},
    };
    for(var key in params){
	obj[key] = params[key];
    }
    obj.id = Groups.list.length;
    obj.view = function(){
	var rawHtml = Mustache.render(Groups.__template,{
	    data:obj,
	});
	return rawHtml;
    };

    obj.render = function(elem){
	var raw = obj.view();
	obj.elem = $(raw);
	obj.elem.appendTo(elem);
	obj.x = obj.elem.offset().left;
	obj.y = obj.elem.offset().right;
    };
    obj.setEnv = function(){
	obj.elem.droppable(Groups.droppableOpt);
	obj.elem.draggable(Groups.draggableOpt);
	obj.elem.on('mouseover',function(e){
	    if($(e.toElement)){
	    }
	    if(!$(e.toElement).hasClass('content')){
		obj.elem.draggable('enable');
	    }
	    if($(e.target).get(0).id==""){
		obj.elem.draggable('disable');
	    }
	});
	obj.elem.on('mouseout',function(e){
	    obj.elem.draggable('disable');
	});
	///obj.elem.draggable('disable');
    }
    Groups.list.push(obj);
    return obj;
    
};

