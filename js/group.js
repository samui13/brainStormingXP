Groups = {};
Groups.droggableOpt = {
    zIndex:3,
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
