
function _clickableTree(data){

    d3.select("#display-container").selectAll("*").remove();
	var svg = d3.select("#display-container").append("svg");
	var width = 960;
    var	height = 960;
    var margin = 200;
    var color = d3.scaleOrdinal(d3.schemeCategory10);
	svg.attr("width", width)
		.attr("height", height);

    updateTree(data);

    //if children, toggle children upon clicking
    function clicked(d){
        if(d.children){
            d._children = d.children;
            d.children = null;
        }else{
            d.children = d._children;
            d._children = null;
        }
        updateTree(d);
        console.log(d);
    }

    function updateTree(source){
        console.log(data);
        
        var ng = svg.append("g").attr("transform", "translate(100,150)");
        var tree = d3.tree().size([height-margin, width-margin]);
    
        var stratify = d3.stratify()
            .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });
    
        var root = stratify(data)
            .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });
        console.log(root);
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
        console.log(root.descendants());

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
        
        node.on("click", clicked);
    }
}

function clickableTree(data){

    d3.select("#display-container").selectAll("*").remove();

    var margin = {top: 20, right: 120, bottom: 20, left: 20};
    var width = 660 - margin.left - margin.right;
    var	height = 660 - margin.top - margin.bottom;
    
    var svg = d3.select("#display-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var i = 0;
    var duration = 750;

    // var tree = d3.tree().size([height, width]);
    
    // var stratify = d3.stratify()
    //     .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    // var root = stratify(data)
    //     .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });
    // root.x0 = height/2;
    // root.y0 = 0;
    // console.log(root);

    var color = d3.scaleOrdinal(d3.schemeCategory10);
	var tree = d3.tree().size([height, width]);
    
    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    var root = stratify(data)
        .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });
    update(root);
    console.log(root);

    function update(source){
        console.log(source);
        console.log(tree(source).descendants());

        var node_g = svg.append("g");

        var nodes = node_g.selectAll(".node")
            .data(tree(source).descendants());

        console.log(nodes);

        var node = nodes.enter()
            .append("g")
            .merge(nodes)
            .attr("class", "node")
            .attr("transform", function(d){return "translate(" + d.y + "," + d.x + ")"; });
        console.log(node);
        var circles = node.append("circle")
            .attr("r", 20.5)
            .style("fill", "transparent") //if use "none", will not be able to click inside the circle
            .attr("stroke", function(d){ return color(d.depth >=1 && d.id.split(".", 2)); })
            .on("click", click);
        
        nodes.exit().remove();
    }   

    // function update(source){
    //     console.log(source); //calculate depth and height related information
    //     console.log(tree(source)); //calculate (x,y) coordicates for each data point
    //     console.log(tree(source).descendants());//extract children array as input for data() 
    //     var node_g = svg.append("g"); //all nodes container

    //     //data join with node-->g elements
    //     var nodes = node_g.selectAll(".node")
    //         .data(tree(source).descendants())
    //         .enter()
    //         .append("g")
    //         .attr("class", "node")
    //         .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

       

    //     //update node, append circles to gs
    //     var circles = nodes.append("circle")
    //         .attr("r", 4.5)//default radius value
    //         .on("click", click);
        
    //     //update circles
    //     circles.attr("stroke", function(d){return color(d.depth >= 1 && d.id.split(".", 2)); })
    //         .style("fill", "transparent")//use style to overwrite css styles
    //         .attr("r", function(d){return d.data.ave; });
        
    //     // nodes.merge(nodes);

    //     nodes.exit().remove();
    // }

    function click(d){
        // if(d.children){
        //     d._children = d.children;
        //     d.children = null;
        // }else{
        //     d.children = d._children;
        //     d._children = null;
        // }
        update(d);
    }
    
}

