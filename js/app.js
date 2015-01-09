$(document).ready(function(){

	var jamsPerPage = 60;	/* Dependent on This Is My Jam */
	var jamsToDisplay = 3;
	var totalJams;
	var jams = [];
	var jamIndices = [];
	var jamPage = -1;
	var username;

	$("#userForm").submit(function(event){
		event.preventDefault();
		username = $(this).find("input[name='username']").val();
		username = $.trim(username);
		if(!isValidInput(username)) {
			alert("Please fill in a username.");
			return;
		}

		resetResultFields();
		getTotalJams(username);		
		console.log("---Timing Example---");
	});

	function isValidInput() {
		if(username === "") {
			return false;
		}
		return true;
	}

	function resetResultFields() {
		totalJams = 0;
		jamPage = -1;
		jams = [];
		jamIndices = [];
		$("#userInput").val("");
		$("#jamResults").html("");
	}

	function getTotalJams() {
		var request = { 
			key: "1155729500c504209f43e65fd110766512213181"
		};

		$.ajax({
			url: "http://api.thisismyjam.com/1/" + username + ".json",
			data: request,
			dataType: "json",
			type: "GET",
			crossDomain: "true"
		})
		.done(function(results) {
			totalJams = results.person.jamsCount;
			
			if(totalJams <= 0) {
				$("#jamResults").html("<p class='info'>" + username + " has no past jams.</p>");
				return;			
			} else {				
				randomizeVariables();
				displayPastJams();
			}		
		})
		.fail(function(jqXHR, error, errorThrown){
			if(jqXHR.status == 404) {
				alert("Username " + username + " not found.");				
			} else {
				alert("An error occurred. Please try again later.");
			}
		});		
	}

	/* Value of max is inclusive */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function setJamIndices(maxIndices, maxIndex) {
		console.log("Reached setIndices start");
		var randomJamIndex;
		var j = 0;

		console.log("Max Indices: " + maxIndices + ", maxIndex: " + maxIndex);

		while(j < maxIndices) {
			randomJamIndex = getRandomInt(0, maxIndex); 
			if(jamIndices.indexOf(randomJamIndex) == -1) {
				jamIndices.push(randomJamIndex);
				j++;	
			} 			
		}	

		console.log("Reached setIndices end");
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
			console.log("Reached randomize -- One page not enough jams");
			maxIndex = totalJams - 1;
			maxIndices = totalJams;
			setJamIndices(maxIndices, maxIndex);
			return;
		} else {
			/* Case: One page of jams */
			if(totalJams <= jamsPerPage) {
				console.log("Reached Case One page of jams");
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
				//return;
			}			
		}

		console.log("Page: ", jamPage, ", Indices: " , jamIndices);
		
	}

	function displayPastJams(results) {	
		console.log("displayPastJams start");
		/*
		var html = "";		

		var request = { 
			page: jamPage,
			key: "1155729500c504209f43e65fd110766512213181"
		};

		$.ajax({
			url: "http://api.thisismyjam.com/1/" + username + "/jams.json",
			data: request,
			dataType: "json",
			type: "GET",
			crossDomain: "true"
		})
		.done(function(results){
			html += "<h2><a href='http://www.thisismyjam.com/" + username + "'>" + username + "</a> jams</h2>";	

			// TODO: Display jams 
			console.log(results); 
			jamIndices.forEach(function(index){
				console.log(results.jams[index]);
			});

			$("#jamResults").html(html);
		})
		.fail(function(jqXHR, error, errorThrown){
			alert("An error occurred. Please try again later.");
		});
		*/
	
		console.log("displayPastJams end");	
		console.log("--------------------------------------");
	}
});