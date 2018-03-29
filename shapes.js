var selection = d3.select("#shape-container")
    .append("svg")
        .attr("width", 600)
        .attr("height", 600)
        .attr("transform", "translate(200, 200)");

var data = [1, 1, 2, 3, 5, 8, 13, 21];
var arcs = d3.pie()(data);
var  tau = 2 * Math.PI;

var arc = d3.arc()
    .innerRadius(20)
    .outerRadius(60)
    .startAngle(0)
    .endAngle(0.127 * tau);

selection.append("path")
    .style("fill", "green")
    .attr("stroke", "orange")
    .attr("d", arc)
    .attr("transform", "translate(300, 300)");
console.log(arcs);