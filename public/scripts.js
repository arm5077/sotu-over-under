data = [
	{
		year: 2009,
		count: 20
	},
	{
		year: 2010,
		count: 15
	},
	{
		year: 2011,
		count: 1
	},
	{
		year: 2012,
		count: 14
	},
	{
		year: 2013,
		count: 19
	},
	{
		year: 2014,
		count: 6
	}
];

app = angular.module("sotuApp", []);

app.controller("sotuController", ["$scope", function($scope){
	$scope.keywords = keywords;
}]);


$(document).ready(function(){
	var chart = d3.select(".chartContainer");
	
	// Chart section
	var height = d3.select(".chartContainer").node().clientHeight;
	var width = d3.select(".chartContainer").node().clientWidth;
	
	// Set padding ratio
	var padding = .4;
	
	// Set minimum height for a bar;
	var minHeight = 30;
	
	// Set vertical range
	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d){ return d.count })])
		.range([0, height ]);
	
	var barWidth = ( width / data.length ) * (1 - padding);
	
	
	var bar = chart.selectAll(".bar")
		.data(data)
	.enter().append("div")
		.style("left", function(d,i){ return i * barWidth + (i * padding * (width / (data.length - 1) ) ) + "px"; })
		.style("width", barWidth + "px")
		.style("height", function(d){ 
			if( y(d.count) < minHeight )
				return minHeight + "px";
			else
				return y(d.count) + "px"; 
		})
		.style("top", function(d){ 
			if( y(d.count) < minHeight )
				return (height - minHeight) + "px"; 
			else
				return (height - y(d.count)) + "px"; 

		})
		.style("background-color", function(d){
			if( d.count == 0) return "rgba(0,0,0,0)";
		})
		.style("color", function(d){
			if( d.count == 0) return "#FAA61A";
		})
		.attr("yeah", function(d){ return d.count })
		.attr("class", "bar")
		.html(function(d){ return d.count });
		
});