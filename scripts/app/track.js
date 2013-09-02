
define(['lib/d3'], function () {
	timestamp = new Date().getTime();
	d3.json("/scripts/data/data.json?"+timestamp, function(error, json) {

		//throw console error if there is an ajax load issue
		if (error) return console.warn(error);

		//setup variables
		var d3Circles = [];
		var d3Lines = [];
		var attorneys = json[0]['attorneys'];
		var jobstatus = json[0]['status'];
		var returns = json[0]['returns'];		
		var count = 0;

		//add the attorneys to the map
		attorneys.forEach(function(attorney, key){
			count++;
			//build attorney model
			a = new AttorneyModel(attorney, count);
			
			//add base lines
			d3Lines.push(a.drawBaseLine());
			
			//add base circles
			d3Circles.push.apply(d3Circles, a.drawCircles());

			//draw complete line
			d3Lines.push(a.drawCompleteline());

			if(attorney.returns != null){

				//add returns into the map
				attorney.returns.forEach(function(returnitem, rkey){
					var next;
					count++;
					r = new ReturnModel(returnitem, count, rkey);
					//add in base lines for returns
					d3Lines.push(r.drawBaseLine());
					d3Circles.push.apply(d3Circles, r.drawCircles());

					//need to know the orginal status of the next return if one exists
					if(attorney.returns[rkey+1] != null){
						next = attorney.returns[rkey+1];
					}
					//add in completed lines for each attorney
					d3Lines.push.apply(d3Lines, r.drawCompleteline(attorney.status, next));
				});
			}
		});
		
		//calculate the height of the vertical line to connect attorneys
		lastretcount = attorneys.slice(-1)[0].returns.length;
		connectline = ((count - lastretcount) * 50) + 155;	
		d3Lines.push({"x1": 715, "y1": connectline, "x2": 715, "y2": 200});

		//add job portion to the map
		if(returns.length > 0){
			//get the first return in the array and push the first line
			var original = returns[0].original_status;
			var result = coreCircles.filter(function(v) {
			    return v.id === original; 
			})[0];

			d3Lines.push({"x1" : 50, "y1" : 200, "x2" : result.x_axis, "y2" : 200, "color" : 'red'});
			//add the vertical line to received if its in received status
			if(jobstatus == "received"){
				var yval = (returns.length * 50) + 300;
				d3Lines.push(
					{"x1" : 678, "y1" : yval, "x2" : 678, "y2" : 200, "color" : 'red' }
				);
			}
			var count = 0;
			//loop through the returns and draw lines accordingly
			returns.forEach(function(returnitem, key){
				count++;
				var next = null;
				if(returns[key + 1] != null){
					next = returns[key + 1];
				}
				jobreturn = new jobReturnModel(returnitem, count, jobstatus, key);
				d3Lines.push(jobreturn.drawBaseLine());	
				d3Circles.push.apply(d3Circles, jobreturn.drawCircles());
				d3Lines.push.apply(d3Lines, jobreturn.drawCompleteline(next));	
			});

		} else {
			//add in current lines based on job status
			var result = coreCircles.filter(function(v) {
			    return v.id === jobstatus; 
			})[0];
			d3Lines.push({"x1" : 50, "y1" : 200, "x2" : result.x_axis, "y2" : 200, "color" : 'red'});
		}
		
		//join lines and circle arrays and pass them into the functions below to draw them.
		var jsonLines = coreLines.concat(d3Lines);
		var jsonCircles = coreCircles.concat(d3Circles);
		var subway = d3.select("#subway") 
			.append("svg:svg")
			.attr("width", 1200)   
			.attr("height", 800); 

		var lines = subway.selectAll("line")
		                .data(jsonLines)
		                .enter()
		                .append("line");

		var lineAttributes = lines
		               .attr("x1", function (d) { return d.x1; })
		               .attr("y1", function (d) { return d.y1; })
		               .attr("x2", function (d) { return d.x2; })
		               .attr("y2", function (d) { return d.y2; })
					   .style("stroke", function(d) {
							if(d.color) return d.color;
							return "rgb(6,120,155)";
						})
						.style("stroke-width", 10);

		var tooltip = d3.select("body")
						.append("div")
						.style("position", "absolute")
						.style("z-index", "10")
						.style("visibility", "hidden")
						.attr("class", "tooltip");

		var circles = subway.selectAll("circle")
		                .data(jsonCircles)
		                .enter()
		                .append("circle");

		var circleAttributes = circles
		               .attr("cx", function (d) { return d.x_axis; })
		               .attr("cy", function (d) { return d.y_axis; })
		               .attr("r", function (d) { return d.radius; })
		               .attr("class", function (d) {return d.class; })
		               .style("fill", function(d) { return d.color; })
		               .on("mouseenter", function(d){
		               		if(d.reason) return tooltip
		               							.text(d.reason)
		               							.style("visibility", "visible")
		               							.style("visibility", "visible")
		               							.style("top", (event.pageY-10)+"px")
		               							.style("left",(event.pageX+10)+"px");
		               })
		               .on("mouseout", function(){
		               		return tooltip.style("visibility", "hidden");
		           		});



		var labels = subway.selectAll("text")
		                .data(jsonCircles)
		                .enter()
		                .append("text");

		var labelAttributes = labels
			            .attr("x", function(d) { 
			            	if(d.type == "horz") return d.x_axis;
			            	return d.x_axis + 15; 
			            })
		                .attr("y", function(d) { return d.y_axis - 15; })
		    	        .attr("font-family", "sans-serif")
			            .attr("font-size", function(d){
			            	if(d.type == "horz") return "10px";
			            	return "12px"
			            })
		               	.attr("fill", "black")
		               	.attr("transform", function(d) {
		               		if(d.type == "horz") return "";
		 					return "rotate(-45 "+d.x_axis+","+d.y_axis+")"; 
							})
		               	.style("text-anchor", function(d){
		               		if(d.type == "horz") return "middle";
		               		return "start";

		               	})
						.text( function (d) { 
							if(d.replace) return json[0].attorneys[0].attorney_name;
							return d.label; 
						});

	});

});