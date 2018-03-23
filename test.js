var a = [1,2,3,4,5];

//append containers in
var svg = d3.select("#test-container").append("svg");
svg.attr("width", 960).attr("height", 960);
console.log(svg);
var ng = svg.append("g");
console.log(ng);

//specify circle attr here
// var mycircle = {

// }

//Data join
//group.selection.data() will bind data to non-exiting elements
//_enter and _exit arrays are available at this step
//everything is still abstract with no solid elements being appended to the container yet
//when you do selectAll("circle"), these are circle concepts which do not exist
var circleList = ng.selectAll("circle").data(a);
console.log(circleList);

//add new "circle" elements based on joined data using enter()
// var circles = circleList.enter().append("circle");
var circles = ng.append("circle");
circles.attr("cx", function(d){return d*40;});
circles.attr("cy", function(d, i){return i*40;});
circles.attr("r", 20);
console.log(circles);

var b = [1,2,3,4,5,6,7,8];

var c = [4,5,6];
var d = ['a', 'b', 'c', 'd'];

//perform data join with new data on the same "circle" elements
//However, using either c or d array will only change the elements, NOT the data already bound
var newList = ng.selectAll("circle").data(c);
//remove surplus elements
// newList.exit().remove();
// console.log(newList);

//to update the binding data, update the attr values with the new data
newList.attr("cx", function(d){return d*40; });

//update graph function that takes data as argument in d3 v4
function update(selection){
    //remove surplus elements
    selection.exit().remove();

    //Add new elements and update existing and new elements
    selection.enter()
        .append("circle")
        .merge(selection)
        .attr("r", function(d){return d*10; })
        .attr("fill", "none")
        .attr("stroke", "orange");
}

update(newList);
update(circleList);
update(circles);
