angular.module('stormFilter',[]).
    filter('checkBelong',function(){
	return function(input,status){
	    var out = [];
	    for(var key in input){
		var postit = input[key];
		
		if(postit.group_id !== '')
		    continue
		out.push(postit);
	    }
	    return out;
	}
    }).
    filter('check',function(){
	return function(input,status){
	    var out = [];
	    for(var key in input){
		var postit = input[key];
		if(postit.group_id === '')
		    continue
		if(postit.group_id !== status)
		    continue
		out.push(postit);
	    }
	    return out;
	}
    });
