
function AttorneyModel(attorney, count) {

	this.attr = attorney;
	this.count = count;
	this.y_axis = (this.count * 50) + 150;

	this.drawBaseLine = function (){
		if(this.count > 0){
			return {"x1": 715, "y1": this.y_axis, "x2": 1150, "y2": this.y_axis};
		}
	},

	this.drawCircles = function (){
		if(this.count > 0){
			circles = [
				{"x_axis" : 756.5, "y_axis" : this.y_axis,"radius" : 6,"color" : "white","class" : "small", 
				  "label" : this.attr.attorney_name, 
				  "type" : "horz"
				},
				{ "x_axis": 835, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big"},
				{ "x_axis": 913.5, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big"},
				{ "x_axis": 992, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big"},
				{ "x_axis": 1070.5, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big"},
				{ "x_axis": 1150, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big"}
			];
			return circles;
		}
	},

	this.drawCompleteline = function(){

		if(attorney.returns == null || attorney.returns.length == 0){
			this.end = this.getPosition(attorney.status); 
		} else {
			this.end = this.getPosition(attorney.returns[0].original_status); 
		}
		line = {"x1": 756.5, "y1": this.y_axis, "x2": this.end.x_axis, "y2": this.y_axis, "color" : "red"};
		return line;
	},

	this.getPosition = function(status){

		return coreCircles.filter(function(v) {
		    return v.id === status; 
		})[0];
	}
};

function ReturnModel(returnitem, count, key) {

	this.attr = returnitem;
	this.count = count;
	this.y_axis = (this.count * 50) + 150;
	
	this.drawBaseLine = function (){
		if(this.count > 0){
			return {"x1": 756.5, "y1": this.y_axis, "x2": 1150, "y2": this.y_axis};
		}
	},
	this.drawCircles = function (){
		if(this.count > 0){
			circles = [
					{ 
					  "x_axis": 756.5, 
					  "y_axis": this.y_axis, 
					  "radius": 6, 
					  "color" : "white", 
					  "class" : "small", 
					  "label" : "return " + (key + 1) , 
					  "type" : "horz",
					  "reason" : this.attr.reason
					},
					{ "x_axis": 835, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big"},
					{ "x_axis": 913.5, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big"},
					{ "x_axis": 992, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big"},
					{ "x_axis": 1070.5, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big"},
					{ "x_axis": 1150, "y_axis": this.y_axis, "radius": 10, "color" : "white", "class" : "big"}
				];
			return circles;
		}
	}

	this.drawCompleteline = function (status, next){

		var return_status = this.getPosition(returnitem.return_status);
		var original_status = this.getPosition(returnitem.original_status);

		leftline = [
			{"x1" : original_status.x_axis, "y1" : this.y_axis - 20, "x2" : original_status.x_axis, "y2" : this.y_axis - 50, "color" : 'red' }
		];
		rightline = [
			{"x1" : return_status.x_axis, "y1" : this.y_axis, "x2" : return_status.x_axis, "y2" : this.y_axis - 30, "color" : 'red' }
		];
		middleline = [
			{"x1" : return_status.x_axis, "y1" : this.y_axis - 25, "x2" : original_status.x_axis, "y2" : this.y_axis - 25, "color" : 'red'}
		];
		if(next != null){
			var next_original_status = this.getPosition(next.original_status);
			mainline = [
				{"x1" : return_status.x_axis, "y1" : this.y_axis, "x2" : next_original_status.x_axis, "y2" : this.y_axis, "color" : 'red'}
			];
		} else {
			var current_status = this.getPosition(status);
			mainline = [
				{"x1" : return_status.x_axis, "y1" : this.y_axis, "x2" : current_status.x_axis, "y2" : this.y_axis, "color" : 'red'}
			];
		}
		lines = leftline.concat(rightline, middleline, mainline);
		return lines;
		
	},

	this.getPosition = function(status){

		return coreCircles.filter(function(v) {
		    return v.id === status; 
		})[0];
	}

}