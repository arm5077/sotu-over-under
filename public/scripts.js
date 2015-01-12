app = angular.module("sotuApp", []);

app.controller("sotuController", ["$scope", function($scope){
	$scope.keywords = keywords;
	$scope.chartHeight = 200;
	$scope.chartWidth = $(".chart").width();
	$scope.padding = .4;
	console.log($(".chart").width());
	
	$scope.barHeight = function(value, data){
		return value / d3.max(data, function(d){ return d.count }) * $scope.chartHeight;
	};
	
	$scope.barWidth = function(value, data){	
		return ( $scope.chartWidth / data.length ) * (1 - $scope.padding);
	};

	app.directive("dataBarWidth", function(){
		return function(scope, element, attr){
			element.css({
				width: ( width / data.length ) * (1 - padding);
			});
		};
	});

	
}]);

