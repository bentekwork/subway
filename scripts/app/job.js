function jobReturnModel(returnitem, count, status, key) {
	this.count = count;
	this.y_axis = (this.count * 50) + 300;

	this.drawBaseLine = function(){
		
		return {"x1": 50, "y1": this.y_axis, "x2": 678, "y2": this.y_axis};
		
	},

	this.drawCircles = function() {
		circles = [
			{ "x_axis": 50, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big", "id" : "auth", "label" : "Return " + (key+1), "type" : "horz", "reason" : returnitem.reason},
			{ "x_axis": 128.5, "y_axis": this.y_axis, "radius": 6, "color" : "white", "class" : "small", "id" : "authgen"},
			{ "x_axis": 207, "y_axis": this.y_axis, "radius": 6, "color" : "white", "class" : "small", "id" : "authqa"},
			{ "x_axis": 285.5, "y_axis": this.y_axis, "radius": 6, "color" : "white", "class" : "small", "id" : "authfollowup"},
			{ "x_axis": 364, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big", "id" : "sub"},
			{ "x_axis": 442.5, "y_axis": this.y_axis, "radius": 6, "color" : "white", "class" : "small", "id" : "subgen"},
			{ "x_axis": 521, "y_axis": this.y_axis, "radius": 6, "color" : "white", "class" : "small", "id" : "subqa"},
			{ "x_axis": 599.5, "y_axis": this.y_axis, "radius": 6, "color" : "white", "class" : "small", "id" : "subfollowup"},
			{ "x_axis": 678, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big", "id" : "received"}
		];
		return circles;		
	},

	this.drawCompleteline = function(next){
		var original_status = this.getPosition(returnitem.original_status);
		var return_status = this.getPosition(returnitem.return_status);
		var current_status = this.getPosition(status);

		middleline = [
			{"x1" : return_status.x_axis, "y1" : this.y_axis - 25, "x2" : original_status.x_axis, "y2" : this.y_axis - 25, "color" : 'red'}
		];
		leftline = [
			{"x1" : return_status.x_axis, "y1" : this.y_axis - 30, "x2" : return_status.x_axis, "y2" : this.y_axis , "color" : 'red' }
		];
		if(key == 0){
			rightline = [
				{"x1" : original_status.x_axis, "y1" : this.y_axis - 20, "x2" : original_status.x_axis, "y2" : this.y_axis - 155 , "color" : 'red' }

			];
		} else {
			rightline = [
				{"x1" : original_status.x_axis, "y1" : this.y_axis - 20, "x2" : original_status.x_axis, "y2" : this.y_axis - 55 , "color" : 'red' }

			];
		}
		//add current lines
		if(next != null){
			var next_original_status = this.getPosition(next.original_status);
			mainline = [
				{"x1" : return_status.x_axis, "y1" : this.y_axis, "x2" : next_original_status.x_axis, "y2" : this.y_axis, "color" : 'red'}
			];
		} else {
			mainline = [
				{"x1" : return_status.x_axis, "y1" : this.y_axis, "x2" : current_status.x_axis, "y2" : this.y_axis, "color" : 'red'}
			];
		}
		lines = mainline.concat(middleline, leftline, rightline);
		return lines;
	},

	this.getPosition = function(status){

		return coreCircles.filter(function(v) {
		    return v.id === status; 
		})[0];
	}

}
