function clickableTree(data){

    d3.select("#display-container").selectAll("*").remove();
	var svg = d3.select("#display-container").append("svg");
	var width = 960;
    var	height = 960;
    var margin = 200;

	var color = d3.scaleOrdinal(d3.schemeCategory10);
	var ng = svg.append("g").attr("transform", "translate(100,150)");

	svg.attr("width", width)
		.attr("height", height);

    var tree = d3.tree().size([height-margin, width-margin]);

    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    var root = stratify(data)
        .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });

    console.log((root));
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
    // svg.call(d3.zoom()
    //     .scaleExtent([0, 10])
    //     .on("zoom", function(){
    //         //link.attr();//gonna figure it out tmr
    //         ng.attr("transform", d3.event.transform);

    //     }));
}