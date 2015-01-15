
app = angular.module("sotuApp", ['ngAnimate']);


app.controller("sotuController", ["$scope", "$sce", "$http", "$compile", function($scope, $sce, $http, $compile){
	
	
	
	// This is called with the results from from FB.getLoginStatus().
	function statusChangeCallback(response) {
		console.log('statusChangeCallback');
		if (response.status === 'connected') {
		// Logged into your app and Facebook.
			$scope.getEmail();
		} 
	}
	
	// This function is called when someone finishes with the Login
	// Button.  See the onlogin handler attached to it in the sample
	// code below.
	function checkLoginState() {
		FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
		});
	}
	
	window.fbAsyncInit = function() {
		FB.init({
			appId      : '337779369755179',
			cookie     : true,  // enable cookies to allow the server to access 
								// the session
			xfbml      : true,  // parse social plugins on this page
			version    : 'v2.1' // use version 2.1
		});
		
		FB.getLoginStatus(function(response) {
			statusChangeCallback(response);
		});
	
	};
	
	// Load the SDK asynchronously
	(function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));


	$scope.userid = uuid.v4();
	console.log($scope.userid);
	$scope.email = "";
	$scope.facebookid = "";
	$scope.gender = "";
	$scope.link = "";
	$scope.name = "";
	$scope.timezone = "";
	$scope.locale = "";
	$scope.submitted_yet = false;
	$scope.registered_yet = false;
	$scope.keywords = keywords;
	$scope.chartHeight = 200;
	$scope.padding = .1;
	$scope.minHeight = 30;
	$scope.currentQuote = 0;
	
	$scope.FBlogin = function(){
		FB.login(function(response){
			$scope.getEmail();
		});
	};
	$scope.getEmail = function(){
		FB.api('/me', function(response) {
			$scope.email=response.email;
			$scope.gender=response.gender;
			$scope.link = response.link;
			$scope.timezone = response.timezone;
			$scope.name = response.name;
			$scope.locale = response.locale;
			
			$scope.submitUser();
			$scope.registered_yet = true;
		},{scope: "public_profile, email"});
	};
	
	
	// Start rotating quotes
	window.setInterval( function(){
		$scope.$apply(function(){
			if( $scope.currentQuote == 4) 
				$scope.currentQuote = 0;
			else
				$scope.currentQuote++;
		});
	},7000);
	
	$scope.renderHTML = function(html){
		return $sce.trustAsHtml(html);
	};
		
	$scope.insertLogin = function($event){
		
		angular.element($event.target).parent().parent().append($compile("<login></login")($scope));
		
	};
	
	$scope.insertBar = function(keyword){
	//	keyword.years.push({year:2015, count:20});
		
	};
	
	$scope.applyGuess = function(value, data){
		// Make sure submitted number is actually a number and not "F U NJ!!"
		if( isNaN(value) ) value = 0;
		var index = data.years.map(function(data){ return data.year }).indexOf(2015);
		if( index == "-1" ) {
			console.log("yo");
			data.years.push({year: 2015, count: value});
		}
		else {
			data.years[index].count = value;
		}
	};

	$scope.submitUser = function(callback){
		$http({
			url: "/users",
			method: "POST",
			data: {
				"userid": $scope.userid,
				"email": $scope.email,
				"facebookid": $scope.facebookid,
				"gender": $scope.gender,
				"link": $scope.link,
				"name": $scope.name,
				"timezone": $scope.timezone,
				"locale": $scope.locale
			}
		}).success(function(data, status, headers, config){
			console.log("User data submitted and accepted with gusto!");
			$scope.submitted_yet = true;
			if(callback) callback();
		}).error(function(data, status, headers, config){
			console.log("Looks like there's already a record in the system! Updating " + $scope.userid + " to equal " + data[0].userid + ".");
			$scope.userid = data[0].userid;
			$scope.submitted_yet = true;
		});
	};
	
	$scope.submitGuess = function(guess, keyword){
		// See if they haven't actually selected anything;
		// if they haven't (sillies!) then default to 0
		if(keyword.years.map(function(keyword){ return keyword.year }).indexOf(2015) == "-1") {
			console.log("This daft fellow didn't make a guess. Zero points for Griffyndor!");
			guess = 0;
			keyword.years.push({year: 2015, count: guess});
		}
		
		// If they haven't submitted/registered before, register them as a user first
		if( $scope.submitted_yet || $scope.registered_yet) {
			submitGuessToServer();	
			
		}
		// This is for if their userid already exists on the database
		else {
			$scope.submitUser(function(){ 
				submitGuessToServer();
			});
		}
		
		function submitGuessToServer(){
			console.log(keyword.phrase);
			$http({
				url: "/guesses",
				method: "POST",
				data: {
					"userid": $scope.userid,
					"phrase": keyword.phrase,
					"guess": guess
				}
			}).success(function(data, status, headers, config){
				console.log("Submitted that guess successfully!");
				
				// Now it's time to show what OTHER people have guessed.
				$http({
					url: "guesses/average?phrase=" + keyword.phrase,
					method: "GET",
					data: {
						"phrase": keyword.phrase
					}
				}).success(function(data, status, headers, config){
					console.log("Getting the average guess went swimmingly!");
					var index = keyword.years.map(function(data){ return data.year }).indexOf("Avg.")
					if( index == "-1" ) {
						keyword.years.push({year: "Avg.", count: Math.round(data[0].average) });
					}	
				}).error(function(data, status, headers, config){
					console.log("Getting the average guess for " + keyword.phrase + " bit the dust. Here's why: " + data);			
				});
				
			}).error(function(data, status, headers, config){
				console.log("Guess submission failed hard. Here's why: " + data);			
			});
	
		};
		
		
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
	
	$scope.barColor = function(count, year, keyword) {
		if( count == 0 ){
			switch(year){
				case 2015: 
					return "rgba(118,182,227,1)"
				break;
				case "Avg.": 
					return "rgba(38,126,193, 1)";
				break;
				default:
					return "rgba(250,166,26,1)";
				break;
			}
			
		}
		else
			return "rgba(255,255,255,1)";
	}
	
	$scope.barBackgroundColor = function(count, year, keyword) {
		if( count == 0){
			switch(year){
				case 2015:
					return "rgba(118,182,227, 0)";
				case "Avg.": 
					return "rgba(38,126,193, 0)";
				default: 
					return "rgba(250,166,26,0)";
			}
		}
		else
			switch(year){
				case 2015:
					return "rgba(118,182,227,1)";
				case "Avg.": 
					return "rgba(38,126,193,1)";
				default: 
					return "rgba(250,166,26,1)";
			}
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
				backgroundColor: scope.barBackgroundColor(scope.year.count, scope.year.year, scope.keyword.years)
			});
		}
	};	
	 
});

app.directive("login", function(){
	return {
		restrict: 'E', 
		templateUrl: 'login.html'
	}
});



  
