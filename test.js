var a = [1,2,3,4,5];
var b = ['a', 'b', 'c', 'd', 'e'];
var c = ['A', 'B', 'C', 'D', 'E', "F", "G"];
//append containers in
var svg = d3.select("#test-container")
    .append("svg")
        .attr("width", 160).attr("height", 160); //returns svg

var mydom = d3.select("#test-container")
    .append("div") //returns div element
        .attr("class", "box")
        .style("width", "600px")
        .style("height", "600px")
        .style("border", "1px solid green")
    .append("ul") //returns ul element
        .attr("class", "list-box")
        .style("border", "1px solid orange");

//console.log(mydom.selectAll("div")); //SELECTION _groups(), empty NodeList[]
var ele = d3.select(".list-box").selectAll("li").data(a);  //DATA JOIN _groups() -> _enter()

var new_ele = ele.enter()
    .append("li"); //ENTER new ele in _groups()

var apple = new_ele.append("p") 
        .text(function(d){return d; }); // UPDATE new ele

var foo = new_ele.selectAll("li").data(b).enter()
    .append("span")
        .text(function(d){return d; });

//one way of doing this
// new_ele.each(function(d, i){
//     // console.log(i);
//     d3.select(this)
//         .append("span")
//             .text(c[i]);
// });

//another way of doing the same
// new_ele.append("span").text(function(d, i){ return c[i]; });

//this will append new data correctly
var orange = new_ele.data(c).enter()
    .merge(new_ele)
    .append("p")
        .attr("class", "letters")
        .text(function(d){return d; });

var old_ele = new_ele.exit().append("p")
    .text("old");

//we can use selection and css to identify unmatched elements
var extras = d3.select(".list-box").selectAll('.letters');
extras.each(function(){
    // console.log(this.parentNode);
    if(this.parentNode.nodeName === 'UL'){
        d3.select(this)
            .attr("class", "outlier")
            .style("color", "red");
    }
});
// console.log(svg);
// console.log(mydom);
console.log(ele);
console.log(new_ele);
console.log(old_ele);
console.log(foo);
console.log(extras);
// console.log(mydom.node()); //retrieve the node element from current selection


