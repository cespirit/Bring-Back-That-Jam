$(document).ready(function(){
	var jamsPerPage = 60;	
	var jamsToDisplay = 3;	
	var totalJams = -1;
	var totalJamPages = -1;	
	var jamPage = -1;
	var jamIndices = [];
	var username = "";
	var key = "1155729500c504209f43e65fd110766512213181";
		
	var isValidInput = function() {
		return (username) ? true:false;
	};
	
	var resetResultFields = function() {		
		totalJams = -1;
		totalJamPages = -1;
		jamIndices = [];
		jamPage = -1;
		$("#userInput").val("");
		$("#jamResults").html("");
	};
	
	/* Value of max is inclusive */
	var getRandomInt = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	
	var formatJamHTML = function(jam) {
		var html = "";
		
		/* Format jam date */
		jamDate = jam.creationDate.slice(5,16);
		
		/* Construct jam info */
		html += "<li><img src='" + jam.jamvatarMedium + "' class='jam-avatar' alt='" + jam.title + " jam avatar'>" + 
			"<div class='jam-details'><p class='jam-title'>" + jam.title + "</p>" +
			"<p class='jam-artist'>By " + jam.artist + "</p>" + 
			"<p class='jam-date'><strong>Jammed on:</strong> " + jamDate + "</p>";
			
			if(jam.caption) {
				html += "<p class='jam-caption'>" + jam.caption + "</p>";
			}
			
			html += "<p class='jam-link'><a class='button' target='_blank' href='" + jam.url + "'>"  +
			"<i class='fa fa-play-circle-o fa-lg'></i> Listen on This Is My Jam</a></p>" +
			"</div></li>";
			
		return html;
	};
	
	var displayJams = function() {
		var jams;
		var html = "";
		html += "<h2><a href='http://www.thisismyjam.com/" + username + "'>" + username + "</a> jams</h2>";	
		html += "<ul id='pastJams'>";
		
		var request = { 
			page: jamPage,
			key: key
		};
		
		$.ajax({
			url: "http://api.thisismyjam.com/1/" + username + "/jams.json",
			data: request,
			dataType: "json",
			type: "GET",
		})
		.done(function(results){
			jams = results.jams;
			
			console.log("totalJams: " + totalJams + ", totalJamPages: " + totalJamPages + ", jamPage: " + jamPage + ", jams.length: " + jams.length);
			if(jams.length === 0 && jamPage === 1) {
				$("#jamResults").html("<p class='info'>" + username + " has no jams.</p>");
				return;
			}
			else if(jams.length === 0) {
				/* Try the page before for jams */
				jamPage--;
				displayJams();
			}
			else if(jams.length < jamsToDisplay) {
				/* Display them all */
				jams.forEach(function(jam) {
					if(jam === undefined) {
						return;
					}
					html += formatJamHTML(jam);
				});				
			}
			else {
				/* Choose random jam indices */
				var j = 0;
				var randomIndex;
				var jam;
				var maxIndex = jams.length - 1;	
				
				while(j < jamsToDisplay) {
					randomIndex = getRandomInt(0, maxIndex);
					if(jamIndices.indexOf(randomIndex) == -1) {
						jamIndices.push(randomIndex);
						j++;
					}
				}	
				
				console.log("jamIndices: " + jamIndices);
				
				/* Display jams */
				jamIndices.forEach(function(index){
					jam = jams[index];
					if(jam === undefined) {
						return;
					}
					html += formatJamHTML(jam);				
				});
			}
			
			html += "</ul>";
			$("#jamResults").html(html);
			
		})
		.fail(function(jqXHR, error, errorThrown){
			alert("An error occurred. Please try again later.");
		});
	};

	
	var getTotalJams = function(username) {				
		var request = { 
			key: key
		};
		
		$.ajax({
			url: "http://api.thisismyjam.com/1/" + username + ".json",
			data: request,
			dataType: "json",
			type: "GET",
		})
		.done(function(results) {					
			totalJams = results.person.jamsCount;
			totalJamPages = Math.ceil(totalJams / jamsPerPage);
			if(totalJams <= 0 || totalJamPages <= 0) {
				$("#jamResults").html("<p class='info'>" + username + " has no past jams.</p>");				
				return;			
			} else {		
				jamPage = getRandomInt(1, totalJamPages);
				displayJams();				
			}							
		})
		.fail(function(jqXHR, error, errorThrown){			
			if(jqXHR.status == 404) {
				$("#jamResults").html("<p class='info'>Username '" + username + "' not found.</p>");			
			} else {
				$("#jamResults").html("<p class='info'>An error occurred. Please try again later.</p>");
			}
		});	

	};
	
	$("#userForm").submit(function(event){
		console.log("--------------------------------------------");
		event.preventDefault();			
		username = $(this).find("input[name='username']").val();
		username = $.trim(username);				
		
		if(!isValidInput(username)) {
			alert("Please fill in a username.");
			return;
		}
					
		console.log("Username: " + username);
		resetResultFields();
		getTotalJams(username);		
	});

});