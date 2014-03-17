angular.module('stormFilter',[]).filter('checkBelong',function(){
    return function(input,status){
	var out = [];
	for(var key in input){
	    var postit = input[key];
	    console.log(status == postit.holding_id,status);
	    if((status == postit.holding_id,status)){
		continue;
	    }
	    /*	    
	    if(postit.holding_id == "" && typeof status != 'undefined')
		continue;
	    
	    if(postit.holding_id != "" && (postit.holding_id != status))
		continue
	    */	    
	    out.push(postit);
	}
	return out;
    }
});
