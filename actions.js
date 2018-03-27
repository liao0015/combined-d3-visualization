
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    init();
});

function init(){
    d3.csv("bio.csv", function(error,data){
        if(error){ console.log(error); }
        if(data){
            initDisplayContainer(data);
        }
    });
}

function initDisplayContainer(data){
    // var displayContainer = document.getElementById("display-container");
    // console.log(document.querySelector("#display-container").clientWidth);

    var _width = 660;//give a default value
    var _height = 660;
    //update width to current window size
    _width = document.querySelector("#display-container").clientWidth;
    var margin = {top: 20, right: 120, bottom: 20, left: 20};
    var width = _width - margin.left - margin.right;
    var	height = _height - margin.top - margin.bottom;
    
    var heightScalingFactor = 1; //default

    

    //default display after container initiation
    clickableTree(data, width, height, margin);
    //intiate menu section
    //width, height, margin are passed as arguments
    loadMenu(data, width, height, margin);

    //change the graph rendering based on the window size
    window.addEventListener("resize", function(){
        // console.log(document.querySelector("#display-container").clientWidth);

        //update width value upon resizing event
        _width = document.querySelector("#display-container").clientWidth;
        width = _width - margin.left - margin.right;

        //redraw graph
        clickableTree(data, width, height, margin);
        //update menu paramenter accordingly, i think it's optional at this point
        // loadMenu(data, width, height, margin);
    },false);
    
}

function loadMenu(data, width, height, margin){
    //reload height to default
    var height = height;

    ///////////////////////////////////////////////////////////////
    // initialize menu section and register event listeners
    ///////////////////////////////////////////////////////////////

    //Toggle the dropdown menu content
    var dropdownBtn = document.getElementById("dropdown-btn");
    var dropdownList = document.getElementById("dropdown-menu");

    dropdownBtn.addEventListener("click", function(){
        //console.log("dropdown btn clicked");
        dropdownList.classList.toggle("hidden");
    }, false);

    //link event listeners to each dropdown item
    var dropdownitems = document.querySelectorAll(".dropdown-item");
    //console.log(dropdownitems);

    dropdownitems.forEach(function(item, index){
        //console.log(index + ": " + item.getAttribute("value"));
        
        item.addEventListener("click", function(){
            var value = item.getAttribute("value");
            if(value === "fullchart"){
                showFullChart(data, width, height, margin);
            }else if(value === "treechart"){
                showTreeChart(data, width, height, margin);
            }else if(value === "clickabletree"){
                clickableTree(data, width, height, margin);
            }
        },false);
    });

    //toggle display elements
    //text/lables
    //links
    //coming

    //////////////////////////////////////////////////////////////////////////
    //slider height
    //////////////////////////////////////////////////////////////////////////
    var heightSlider = document.getElementById("heightRange");
    var output = document.getElementById("height-slider-output");
    console.log(heightSlider.value);
    // heightSlider.setAttribute("value", 680);
    output.innerHTML = heightSlider.value;

    // heightSlider.oninput = function(){
    //     output.innerHTML = this.value;
    //     height = this.value - margin.top - margin.bottom;
    //     clickableTree(data, width, height, margin);
    // }

    heightSlider.addEventListener("input", function(){
        output.innerHTML = this.value;
        height = this.value - margin.top - margin.bottom;
        clickableTree(data, width, height, margin);
    },false);
    
    //////////////////////////////////////////////////////////////////////////
    //reset button
    //////////////////////////////////////////////////////////////////////////
    
    var resetBtn = document.getElementById("reset-btn");
    resetBtn.addEventListener("click", function(){
        //reset tree graph with the default height
        height = 660 - margin.top - margin.bottom;
        clickableTree(data, width, height, margin);

        //reset height slider with default value
        heightSlider.value=680;
        output.innerHTML = heightSlider.value;
    }, false);

    //select hierarchy items
    var hierarchyArray=[];//store all the checked items

    //////////////////////////////////////////////////////////////////////////
    //on array slice and splice
    //////////////////////////////////////////////////////////////////////////

    //var hierarchyArray=[1,2,3];
    //var _arr = hierarchyArray.slice(hierarchyArray.indexOf(2),hierarchyArray.indexOf(2)+1);
    //var _arr = hierarchyArray.splice(hierarchyArray.indexOf(2), 1);
    //console.log(_arr);
    //console.log(hierarchyArray);

    //////////////////////////////////////////////////////////////////////////
    //sync checkbox UI with array
    //////////////////////////////////////////////////////////////////////////

    var hierarchyListCheck = document.querySelectorAll("#hierarchy-checkbox input");
    //console.log(hierarchyListCheck);
    hierarchyListCheck.forEach(function(item){
        //remove all selection
        item.checked=false;
        //register "change" listener
        item.addEventListener("change", function(e){
            var itemValue = e.target.parentNode.getAttribute("value");
            if(this.checked){
                if(!hierarchyArray.includes(itemValue)){
                    hierarchyArray.push(itemValue);
                }
            }else{
                if(hierarchyArray.includes(itemValue)){
                    hierarchyArray.splice(hierarchyArray.indexOf(itemValue), 1);
                }
            }
            // console.log(hierarchyArray);
            // console.log(hierarchyArray.length);
            // console.log(hierarchyListCheck);
        },false);
    });
}
