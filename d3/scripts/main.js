// Reuse some code from previous D3 assignments
// Generate a svg
var margins = {
  top: 120,
  right: 120,
  bottom:120,
  left: 120
};
var height = 750 - margins.top - margins.bottom;
var width = 750 - margins.left - margins.right;

var svg = d3.select("body")
.append("svg")
.attr("width", width)
.attr("height", height);

// Define the x and y scales.
var x_Scale = d3.scaleLinear()
.domain([0, 1])
.range([margins.left, width - margins.right]);

var y_Scale = d3.scaleLinear()
.domain([0, 1])
.range([height - margins.bottom, margins.top]);

// Set variable to plot the ROC curve line chart.
var plot_roc = d3.line()
.x(function(d) {return x_Scale(d.fpr);})
.y(function(d) {return y_Scale(d.tpr);});

// Add axes for the plot.
var x_Axis = svg.append("g")
.attr("transform", `translate(0, ${height - margins.bottom})`)
.call(d3.axisBottom().scale(x_Scale));

var y_Axis = svg.append("g")
.attr("transform", `translate(${margins.left}, 0)`)
.call(d3.axisLeft().scale(y_Scale));


// Add labels for the line chart.
svg.append("text")
.style("font-size", "18px")
.attr("x", 200)
.attr("y", 430)
.text("False positive rate");

svg.append("text")
.attr("transform", "rotate(-90)")
.style("font-size", "18px")
.attr("x", -320)
.attr("y", 75)
.text("True positive rate");

// Add the diagonal random choice line.
svg.append("g")
.append("path")
.attr("stroke", "blue")
.attr("stroke-width", "1.8px")
.attr("class", "randomline")
.attr("d", plot_roc([{"fpr":+0, "tpr":+0}, {"fpr":+1, "tpr":+1}]))
.style("stroke-dasharray", ("4, 1.8"));

// Present the visualization on the webpage
function presentVis(data) {
  svg.append("path")
  .attr("class", "ROC")
  .attr("stroke", "black")
  .attr("stroke-width", "1.8px")
  .attr("d", plot_roc(data))
  .attr("fill", "none");
}


// Load the data from flask server then plot the ROC curve line chart
// Learn from the source: https://www.w3schools.com/jsref/met_doc_getelementsbyname.asp
function load_draw() {
        // Create a URL to fetch the data
        var URL = "http://localhost:5000/";
	var preMethod = document.getElementsByName("preprocessing_method");
		for(var k = 0; k < preMethod.length; k++){
			if(preMethod[k].checked){
				var preprocessWay = preMethod[k].value;
			}
		}
	var Cvalue = document.getElementById("c").value;
        // Only keep 2 decimals, and the resulting Cvalue is a string
        Cvalue = parseFloat(Cvalue).toFixed(2);

        // Concatenate the strings based on user input to get the complete URL address for loading data
        // Meanwhile update the visualization
        URL = URL.concat(preprocessWay).concat("/").concat(Cvalue);
	d3.json(URL, function(data){
		d3.selectAll(".ROC").remove(); // Remove previous ROC curve
		presentVis(data);
	})
}
