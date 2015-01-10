$(document).ready(function(){

	var jamsPerPage = 60;	/* Dependent on This Is My Jam */
	var jamsToDisplay = 3;
	var totalJams;
	var jamIndices = [];
	var jamPage = -1;
	var username;
	var key = "1155729500c504209f43e65fd110766512213181";

	$("#userForm").submit(function(event){
		event.preventDefault();
		username = $(this).find("input[name='username']").val();
		username = $.trim(username);
		if(!isValidInput(username)) {
			alert("Please fill in a username.");
			return;
		}
		getTotalJams(username);		
	});

	function isValidInput() {
		if(username) {
			return true;
		}
		return false;
	}

	function resetResultFields() {
		totalJams = 0;
		jamPage = -1;
		jamIndices = [];
		username = "";
		$("#userInput").val("");
	}

	function getTotalJams() {
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
			if(totalJams <= 0) {
				$("#jamResults").html("<p class='info'>" + username + " has no past jams.</p>");				
				resetResultFields();
				return;			
			} else {				
				randomizeVariables();
				displayPastJams();
			}		
		})
		.fail(function(jqXHR, error, errorThrown){			
			if(jqXHR.status == 404) {
				$("#jamResults").html("<p class='info'>Username '" + username + "' not found.</p>");			
			} else {
				$("#jamResults").html("<p class='info'>An error occurred. Please try again later.</p>");
			}
			resetResultFields();
		});		
	}

	/* Value of max is inclusive */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function setJamIndices(maxIndices, maxIndex) {
		var randomJamIndex;
		var j = 0;

		while(j < maxIndices) {
			randomJamIndex = getRandomInt(0, maxIndex); 
			if(jamIndices.indexOf(randomJamIndex) == -1) {
				jamIndices.push(randomJamIndex);
				j++;	
			} 			
		}	
	}

	/* Get random jam indices from a random page */
	function randomizeVariables() {					
		var maxIndex; 
		var maxIndices = jamsToDisplay;
		var totalJamPages = Math.ceil(totalJams / jamsPerPage);
		var totalJamsLastPage = -1;
		jamPage = 1;

		/* Case: One page and not enough jams */
		if(totalJams < jamsToDisplay) {
			maxIndex = totalJams - 1;
			maxIndices = totalJams;
			setJamIndices(maxIndices, maxIndex);
			return;
		} else {
			/* Case: One page of jams */
			if(totalJams <= jamsPerPage) {
				maxIndex = totalJams - 1;
				setJamIndices(maxIndices, maxIndex);
				return;
			} 
			/* Case: Multiple pages of jams */
			else {				
				jamPage = getRandomInt(1, totalJamPages);

				/* Case: Last page of jams */
				if(jamPage === totalJamPages) {
					totalJamsLastPage = totalJams - (jamsPerPage * (totalJamPages - 1));

					if(totalJamsLastPage < jamsToDisplay) {
						jamPage -= 1;
					} else {
						maxIndex = totalJamsLastPage - 1;
						setJamIndices(maxIndices, maxIndex);				
						return;
					}
				} 
				
				/* Case: Jam page has enough jams */	
				maxIndex = jamsPerPage - 1;
				setJamIndices(maxIndices, maxIndex);
			}			
		}
	}

	function displayPastJams() {	
		var jam;
		var jamDate;
		var html = "";	

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
			$("#jamResults").html("");
						
			html += "<h2><a href='http://www.thisismyjam.com/" + username + "'>" + username + "</a> jams</h2>";	
			html += "<ul id='pastJams'>";
			
			jamIndices.forEach(function(index) {
				jam = results.jams[index];

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
			});

			html += "</ul>";
			$("#jamResults").html(html);
			resetResultFields();
		})
		.fail(function(jqXHR, error, errorThrown){
			alert("An error occurred. Please try again later.");
		});	
	}

});