userUI = {};
userUI.createRoom = function(theme,name){
    var data = DB.createRoom(theme,name);
    return data;
};
