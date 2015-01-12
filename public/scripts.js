app = angular.module("sotuApp", []);

app.controller("sotuController", ["$scope", function($scope){
	$scope.keywords = keywords;
	$scope.chartHeight = 200;
	$scope.padding = .1;
	$scope.minHeight = 30;
	
	$scope.insertBar = function(keyword){
	//	keyword.years.push({year:2015, count:20});
		
	};
	
	$scope.applyGuess = function(value, data){
		if( data.years.map(function(data){ return data.year }).indexOf(2015) == "-1" ) {
			console.log("yo");
			data.years.push({year: 2015, count: value});
		}
		else {
			console.log(data.years);
			data.years[data.years.length - 1].count = value;
		}
	};
	
	$scope.barHeight = function(value, data){
		height = value / d3.max(data, function(d){ return d.count }) * $scope.chartHeight;
		
		if( height < $scope.minHeight )
			return $scope.minHeight;
		else 
			return height;

	};
	
	$scope.barWidth = function(value, data) {
		return (100 / data.length) * (1 - $scope.padding);
		//return (100 / data.length) - ($scope.padding / (data.length - 1));
	};
	
	$scope.barTop = function(value, data){
		if( $scope.barHeight(value, data) < $scope.minHeight )
			return $scope.chartHeight - $scope.minHeight;
		else 
			return $scope.chartHeight - $scope.barHeight(value, data);
	};	
	
	$scope.barLeft = function(value, data) {
		index = data.map(function(data){ return data.year}).indexOf(value);
		return index * $scope.barWidth(value, data) + (index * $scope.padding * (100 / (data.length -1) ) );
	};
	
	$scope.barColor = function(value, data) {
		if( value == 0 )
			return "rgba(250,166,26,1)";
		else
			return "rgba(255,255,255,1)";
	}
	
	$scope.barBackgroundColor = function(value, data) {
		if( value == 0)
			return "rgba(250,166,26,0)";
		else
			return "rgba(250,166,26,1)";
	}
	
}]);

app.directive("bar", function() {
	return {
		restrict: 'E',
		link: function(scope, element, attr) {
			element.css({
				width: scope.barWidth(scope.year.count, scope.keyword.years) + "%",
				height: scope.barHeight(scope.year.count, scope.keyword.years) + "px",
				top: scope.barTop(scope.year.count, scope.keyword.years) + "px",
				left: scope.barLeft(scope.year.year, scope.keyword.years) + "%",
				color: scope.barColor(scope.year.count, scope.keyword.years),
				backgroundColor: scope.barBackgroundColor(scope.year.count, scope.keyword.years)
			});
		}
	};	
	 
});

