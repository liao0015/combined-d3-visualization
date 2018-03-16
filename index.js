

//////////////////////////////////////////////////////////////////////////////////
// show Tree chart only
//////////////////////////////////////////////////////////////////////////////////

function showTreeChart(data){
    d3.select("#display-container").selectAll("*").remove();
	var svg = d3.select("#display-container").append("svg");
	var width = 960,
		height = 960;

	var color = d3.scaleOrdinal(d3.schemeCategory10);
	var ng = svg.append("g").attr("transform", "translate(100,150)");

	svg.attr("width", width)
		.attr("height", height);

    var tree = d3.tree()
    .size([height -200, width - 240]);

    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    var root = stratify(data)
        .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });
    //console.log(tree(root).descendants().slice(1));
    var link = ng.selectAll(".link")
        .data(tree(root).descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .style("stroke", function(d){
            return color(d.depth >= 1 && d.id.split(".", 2));
        })
        .style("stroke-width", function(d){
            //console.log(d);
            return (d.data.value)/10; })
        .attr("onmouseover", "MakeTransparent(evt)")
        .attr("onmouseout", "MakeOpaque(evt)")
        .attr("d", function(d) {
            return "M" + d.y + "," + d.x
            + "C" + (d.y + d.parent.y) / 2 + "," + d.x
            + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
            + " " + d.parent.y + "," + d.parent.x;
        });

    var node = ng.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    var circle = node.append("circle")
        .attr("r", function(d){
            return (d.data.value)/10;})
        .style("stroke", function(d){
            return color(d.depth >= 1 && d.id.split(".", 2));
        })
        .style("stroke-width", function(d){
            return (d.data.value)/50 >= 3 ? 3 : 2;
        })
        .style("fill", "transparent")
        .on("mouseover", function(d){
            nodeValue.style("opacity", 0.9)
                .attr("dy", "0.75em")
                .attr("transform", "translate("+d.y+","+d.x+")")
                .text(d.data.value);
    
        })
        .on("mouseout", function(d){
            nodeValue.style("opacity", 0);
        });

    var nodeLabel = node.append("text")
        .attr("dy", 5)
        .attr("x", function(d) { return d.parent ? (d.data.value)/10+4 : -(d.data.value)/10+4; })
        .style("text-anchor", function(d) { return d.parent ? "start" : "end"; })
        .attr("transform", function(d){return d.parent ? "rotate(-30)" : "rotate(0)"; })
        .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });

    //show node value upon hover
    var nodeValue = ng.append("text")
        .style("text-anchor", "middle")
        .style("font-size", 35)
        .style("opacity", 0)
        .style("pointer-events", "none");

    //to zoom in
    svg.call(d3.zoom()
        .scaleExtent([0, 10])
        .on("zoom", function(){
            //link.attr();//gonna figure it out tmr
            ng.attr("transform", d3.event.transform);

        }));
}

//////////////////////////////////////////////////////////////////////////////////
// show full chart (tree and bar charts on each node)
//////////////////////////////////////////////////////////////////////////////////

function showFullChart(data){
    d3.select("#display-container").selectAll("*").remove();
	var svg = d3.select("#display-container").append("svg");
	var width = 960,
		height = 960;

	var color = d3.scaleOrdinal(d3.schemeCategory10);
	var ng = svg.append("g").attr("transform", "translate(100,150)");

	svg.attr("width", width)
		.attr("height", height);

    var tree = d3.tree()
    .size([height -200, width - 240]);

    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    var root = stratify(data)
        .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });
    //console.log(tree(root).descendants().slice(1));
    var link = ng.selectAll(".link")
        .data(tree(root).descendants().slice(1))
        .enter().append("path")
        .attr("class", "link")
        .style("stroke", function(d){
            return color(d.depth >= 1 && d.id.split(".", 2));
        })
        .style("stroke-width", function(d){
            //console.log(d);
            return (d.data.value)/10; })
        .attr("onmouseover", "MakeTransparent(evt)")
        .attr("onmouseout", "MakeOpaque(evt)")
        .attr("d", function(d) {
            return "M" + d.y + "," + d.x
            + "C" + (d.y + d.parent.y) / 2 + "," + d.x
            + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
            + " " + d.parent.y + "," + d.parent.x;
        });

    //console.log(root.descendants());
    //var lash = root.descendants();//array
    var node = ng.selectAll(".node")
        .data(root.descendants())
        .enter().append("g")
        .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    var circle = node.append("circle")
        .attr("r", function(d){
            return (d.data.value)/10;})
        .style("stroke", function(d){
            return color(d.depth >= 1 && d.id.split(".", 2));
        })
        .style("stroke-width", function(d){
            return (d.data.value)/50 >= 3 ? 3 : 2;
        })
        .style("fill", "transparent")
        .on("mouseover", function(d){
            nodeValue.style("opacity", 0.9)
                .attr("dy", "0.75em")
                .attr("transform", "translate("+d.y+","+d.x+")")
                .text(d.data.value);
    
        })
        .on("mouseout", function(d){
            nodeValue.style("opacity", 0);
        });

    var nodeLabel = node.append("text")
        .attr("dy", 5)
        .attr("x", function(d) { return d.parent ? (d.data.value)/10+4 : -(d.data.value)/10+4; })
        .style("text-anchor", function(d) { return d.parent ? "start" : "end"; })
        .attr("transform", function(d){return d.parent ? "rotate(-30)" : "rotate(0)"; })
        .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });

    //draw bar chart for each node
    node.each(showLotsJoy);

    //show node value upon hover
    var nodeValue = ng.append("text")
        .style("text-anchor", "middle")
        .style("font-size", 35)
        .style("opacity", 0)
        .style("pointer-events", "none");

    //to zoom in
    svg.call(d3.zoom()
        .scaleExtent([0, 10])
        .on("zoom", function(){
            //link.attr();//gonna figure it out tmr
            ng.attr("transform", d3.event.transform);

        }));
}

function processData(data){
	var result = [];
	var newData = [];
	//console.log(data);
	result = Object.keys(data.data);
	var data1, data2 = [];
	//console.log(result);
	for(var i = 0; i < result.length; i++ ){
		if(result[i].includes(";")){
			// console.log(result[i]);
			dataSetKeys = result[i];
			//console.log(data.data[result[i]]);
			data1 = result[i].split(";");
			data2 = data.data[result[i]].split(";");
		}
		//or we can simply set the last element as dataSetKeys
		//dataSetKeys = result[result.length-1];
	}

	for(var i = 0; i<data1.length; i++){
		data2[i] = +data2[i];
		newData[i] = {"name":data1[i], "value": data2[i], "id": data.id.split(".").pop()};
	}
	return newData;
}



function MakeTransparent(evt) {
  // evt.target.setAttributeNS(null,"opacity","0.5");
  evt.target.setAttribute("opacity","0.5");
}

function MakeOpaque(evt) {
  // evt.target.setAttributeNS(null,"opacity","1");
  evt.target.setAttribute("opacity","1");
}

function showNodeValue(evt, value){
	//console.log(evt);
	evt.target.setAttribute("opacity","0.5");
}	

function hideNodeValue(evt){
	// evt.target.setAttribute("visibility", "hidden");
	evt.target.setAttribute("opacity","1");
}



function showJoy(){

	var data = {"E1;E2;E3": "8;15;50"};
	var width = 200,
		height = 200;

	//processing data into usable format
	var data1 = Object.keys(data)[0].split(";");
	var data2 = Object.values(data)[0].split(";");
	//console.log(data1);
	//console.log(data2);
	var data = [];
	for(var i = 0; i<data1.length; i++){
		data2[i] = +data2[i];
		data[i] = {"name":data1[i], "value": data2[i]};
	}
	//console.log(data);
	
	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
	var y = d3.scaleLinear().range([height, 0]);

	x.domain(data.map(function(d){return d.name;}));
	y.domain([0, d3.max(data, function(d){return d.value;})]);

	var xAxis = d3.axisBottom(x);
	var yAxis = d3.axisLeft(y);

	var svg = d3.select("#joy")
		.append("svg")
		.attr("width", width+40)
		.attr("height", height+40);
	//adjust the position of axis
	var g = svg.append("g").attr("transform", "translate(30, 20)") ;

	g.append("g")
		.attr("transform", "translate(0,"+height+")")
		.call(xAxis);

	g.append("g")
		.call(yAxis);

	var barChart = g.selectAll(".joy--bar")
		.data(data)
		.enter()
		.append("g")
		.attr("class", ".joy--bar");

	barChart.append("rect")
		.attr("x", function(d){
			return x(d.name);})
		.attr("y", function(d){
			return y(d.value);})
		.attr("width", x.bandwidth())
		.attr("height", function(d){return height-y(d.value); })
		.attr("fill", "green");

	g.append("text")
		.attr("x", 40)
		.attr("y", 30)
		.text("sample chart");

	barChart.append("text")
		.attr("x", function(d){return x(d.name)+x.bandwidth()/2; })
		.attr("y", function(d){return y(d.value)-4; })
		.style("text-anchor", "middle")
		.attr("font-size", "12px")
		.attr("font-weight", "bold")
		.text(function(d){return d.value; });
}

/**********************************************************************/
/****************show bar charts inside each tree node*****************/
/**********************************************************************/
function showLotsJoy(data){
    // console.log(data);
	var width = 50,
		height = 50;
	var color = d3.scaleOrdinal(d3.schemeCategory10);
	data = processData(data);
	
	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
	var y = d3.scaleLinear().range([height, 0]);

	x.domain(data.map(function(d){return d.name;}));
	y.domain([0, d3.max(data, function(d){return d.value;})]);

	var xAxis = d3.axisBottom(x).tickSize(2);
	var yAxis = d3.axisLeft(y).ticks(5).tickSize(2);

	var svg = d3.select(this)
		.attr("width", width+4)
		.attr("height", height+4);
	//adjust the position of axis
	var g = svg.append("g").attr("transform", "translate(3, 2)")
		.on("mousedown", function(d, i){
			//console.log(d);
			d3.select("#peace").select("*").remove();
			showPeace(d);
		});

	g.append("g")
		.attr("transform", "translate(0,"+height+")")
		.call(xAxis);

	g.append("g")
		.call(yAxis);

	var barChart = g.selectAll(".bar")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "bar");

	var bars = barChart.append("rect")
			.attr("x", function(d){
				return x(d.name);})
			.attr("y", function(d){
				return y(d.value);})
			.attr("width", x.bandwidth())
			.attr("height", function(d){return height-y(d.value); })
			.attr("fill", function(d){return color(d.depth >= 1 && d.id.split(".", 2));})
			.style("opacity", 0.3)
			.on("mouseover", function(d){
				bars.style("opacity", 0.9);
				//show values upon hovering over
				barChart.append("text")
					.attr("dx", 5)
					.attr("x", width)
					.attr("y", 10)
					.style("text-anchor", "middle")
					.text(d.value);
			})
			.on("mouseout", function(d){
				bars.style("opacity", 0.3);
				//remove values upon hovering out
				barChart.selectAll("text").remove();
			});
}

/**********************************************************************/
/**************show a enlarged bar chart upon user clicking************/
/**********************************************************************/

function showPeace(data){
	//console.log(data);
	var width = 200,
		height = 200;

	data = processData(data);
	
	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
	var y = d3.scaleLinear().range([height, 0]);

	x.domain(data.map(function(d){return d.name;}));
	y.domain([0, d3.max(data, function(d){return d.value;})]);

	var xAxis = d3.axisBottom(x);
	var yAxis = d3.axisLeft(y);

	var svg = d3.select("#peace")
		.append("svg")
		.attr("width", width+40)
		.attr("height", height+40);
	//adjust the position of axis
	var g = svg.append("g").attr("transform", "translate(30, 20)") ;

	g.append("g")
		.attr("transform", "translate(0,"+height+")")
		.call(xAxis);

	g.append("g")
		.call(yAxis);

	var barChart = g.selectAll(".peace--bar")
		.data(data)
		.enter()
		.append("g")
		.attr("class", ".peace--bar");

	barChart.append("rect")
		.attr("x", function(d){
			return x(d.name);})
		.attr("y", function(d){
			return y(d.value);})
		.attr("width", x.bandwidth())
		.attr("height", function(d){return height-y(d.value); })
		.attr("fill", "green");

	barChart.append("text")
		.attr("x", 40)
		.attr("y", 30)
		.text(function(d){return d.id; });

	barChart.append("text")
		.attr("x", function(d){return x(d.name)+x.bandwidth()/2; })
		.attr("y", function(d){return y(d.value)-4; })
		.style("text-anchor", "middle")
		.attr("font-size", "12px")
		.attr("font-weight", "bold")
		.text(function(d){return d.value; });
}
