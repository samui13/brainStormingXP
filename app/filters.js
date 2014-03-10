angular.module('stormFilter',[]).filter('checkBelong',function(){
    return function(input,status){
	var out = [];
	for(var key in input){
	    var postit = input[key];
	    if(postit.holding_id == "" && typeof status != 'undefined')
		continue;

	    if(postit.holding_id != status && typeof status!='undefined')
		continue
	    out.push(postit);
	}
	return out;
    }
});
