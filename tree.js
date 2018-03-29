
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

function clickableTree(data, width, height, margin){
    //console.log(data);

    d3.select("#display-container").selectAll("*").remove();
    
    var svg = d3.select("#display-container")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var node_g = svg.append("g");
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    //instantiate tree
    var tree = d3.tree().size([height, width]);
    //instantiate stratify
    var stratify = d3.stratify()
        .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });
    
    //calcualte root
    var root = stratify(data)
        // .sum(function(d){return d.ave; })// will generate .value property for each node
        .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });
    
    //root node, with the following properties
    //children: array
    //data: object
    //depth: num
    //height: num
    //id: str
    //parent: object or null
    // console.log(root);
    //for example
    // console.log(root.sum(function(d){
    //     console.log(d);
    //     return d.ave; 
    // }));

    update(root);

    function update(source){

        //clean up the existing .node elements
        d3.select("#display-container").selectAll(".node").remove();
        d3.select("#display-container").selectAll(".link").remove();
        
        //generate hierarchy menu based on data depth
        var listWrapper = d3.select("#hierarchy-menu-container ul");

        console.log(source.height);
        var menu_data = [];
        for (var i = 0; i < source.height + 1; i++){
            menu_data.push("level " + i);
        }
        console.log(menu_data);
        
        //this is the only working version
        //.merge(list) will leave an empty <li> every time updated
        var list = d3.select("#hierarchy-menu-container ul").selectAll("li")
            .data(menu_data);

        list.enter()
            .append("li")
            .append("a")
            .text(function(d){return d;});
        list.exit().remove();
        

        //re-do everyting based on the new root data
        var links = node_g.selectAll(".link")
            .data(tree(source).descendants().slice(1));
        
        var link = links.enter()
            .append("path")
            .attr("class", "link")
            // .attr("stroke", "gray")
            .attr("fill", "transparent")
            .attr("opacity", 0.2)
            .attr("d", function(d){
                return "M" + d.y + "," + d.x
                + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                + " " + d.parent.y + "," + d.parent.x;
            });
    
        
        var nodes = node_g.selectAll(".node")
            .data(tree(source).descendants());
    
        var node = nodes.enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", "translate(0, 310)");
    
        var circles = node.append("circle")
            .attr("r", 20.5)
            .style("fill", "transparent") //if use "none", will not be able to click inside the circle
            .attr("stroke", function(d){return "gray"; })
            .on("click", click);
        
        
        var lables = node.append("text")
            .style("text-anchor", "start")
            .style("font-size", 35)
            .style("opacity", 0)
            .style("pointer-events", "none")
            .text(function(d){return d.data.id.substring(d.data.id.lastIndexOf(".")+1); });
        
        // will animate location changes
        node.transition()
            // .delay(function(d){return d.depth*1000; })
            // .duration(750)
            // .attr("transform", function(d){
            //     // console.log(d);
            //     return d.parent ? "translate(" + d.parent.y + "," + d.parent.x + ")" : "translate(" + d.y + "," + d.x + ")"; 
            // })
            .delay(function(d){return d.depth*750; })
            .duration(1000)
            .attr("transform", function(d){return "translate(" + d.y + "," + d.x + ")"; });
    
        link.transition()
            .delay(750)
            .duration(function(d){return d.depth*1200; })
            // .attr()
            .attr("stroke", function(d){return color(d.depth >=1 && d.data.id.split(".", 2))})
            .attr("stroke-width", function(d){
                //console.log(d);
                return (d.data.value)/10; })
            ;
    
        
        circles.transition()
            //animate color changes
            .delay(function(d){return d.depth>0 ? d.depth*1000 : 750; })
            .attr("stroke", function(d){
                return color(d.depth >=1 && d.data.id.split(".", 2));
            })
            //animate sizes
            .delay(function(d){return 750; })
            .duration(function(d){return d.depth>0 ? d.depth*1000 : 750; })
            .attr("r", function(d){return d.data.ave; });
        
        lables.transition()
            .delay(function(d){return d.depth>0 ? d.depth*1000 : 750; })
            .duration(750)
            .style("opacity", 0.9);
    }   
    
    //this generate a new root, a good way to zoom in for large data set
    function click(d){
        //check if the clicked node is the current root node
        if(d.parent){
            //node.copy will retunr a deep copy of a new root
            var _root = d.copy();
            // console.log(_root);
            update(_root);
        }else{
            //reload data and start over
            init();
        }
    }
    
    //to expand and collapse the tree
    function _click(d){
    
    }
    

}

