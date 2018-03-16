
document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    init();
});

function init(){
    d3.csv("bio.csv", function(error,data){
        if(error){ console.log(error); }
        if(data){
            clickableTree(data);
            loadMenu(data);
        }
    });
}

function loadMenu(data){
    //Toggle the dropdown menu content
    var dropdownBtn = document.getElementById("dropdown-btn");
    var dropdownList = document.getElementById("dropdown-menu");

    dropdownBtn.addEventListener("click", function(){
        console.log("dropdown btn clicked");
        dropdownList.classList.toggle("hidden");
    }, false);

    //link event listeners to each dropdown item
    var dropdownitems = document.querySelectorAll(".dropdown-item");
    console.log(dropdownitems);

    dropdownitems.forEach(function(item, index){
        console.log(index + ": " + item.getAttribute("value"));
        
        item.addEventListener("click", function(){
            var value = item.getAttribute("value");
            if(value === "fullchart"){
                showFullChart(data);
            }else if(value === "treechart"){
                showTreeChart(data);
            }else if(value === "clickabletree"){
                clickableTree(data);
            }
        },false);
    });
}
