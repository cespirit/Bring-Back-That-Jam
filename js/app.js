$(document).ready(function(){

	var jamsPerPage = 60;	/* Dependent on This Is My Jam */
	var jamsToDisplay = 3;
	var totalJams;
	var jams = [];
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
	});

	var isValidInput = function() {
		if(username === "") {
			return false;
		}
		return true;
	};

	var resetResultFields = function() {
		totalJams = 0;
		jams = [];
		$("#userInput").val("");
		$("#jamResults").html("");
	};

	var getTotalJams = function() {
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
			displayPastJams(results);
		})
		.fail(function(jqXHR, error, errorThrown){
			if(jqXHR.status == 404) {
				alert("Username " + username + " does not exist.");				
			}
			else {
				alert("An error occurred. Please try again later.");
			}
		});		
	};

	/* Value of max is inclusive */
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	} 

	/* Get random jams from a random page */
	var getRandomJams = function() {
		
		var jamPage = 1;
		var jamIndices = [];
		var randomJamIndex;
		var totalJamPages = Math.ceil(totalJams / jamsPerPage);
		var url;

		if(totalJams < jamsToDisplay) {
			for(var i = 0; i < totalJams; i++) {
				jamIndices.push(i);
			}
		}
		else {
			var j = 0;
			/* TODO: NEED TO ACCOUNT FOR NOT ENOUGH JAMS ON THE LAST PAGE...1,2,3, etc.*/
			while(j < jamsToDisplay) {
				randomJamIndex = getRandomInt(0, jamsPerPage - 1); 
				if(jamIndices.indexOf(randomJamIndex) != -1) {
					continue;	
				}
				jamIndices.push(randomJamIndex);
				j++;
			}

			if(totalJamPages > 1) {
				jamPage = getRandomInt(1, totalJamPages);
			}
		}

		console.log("Page: ", jamPage, ", Indices: " , jamIndices);

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
			console.log(results);

			console.log("Indices length", jamIndices.length);
			for(var i = 0; i < jamIndices.length; i++) {				
				jams.push(results.jams[jamIndices[i]]);
			}
			console.log(jams);
		})
		.fail(function(jqXHR, error, errorThrown){
			/* TODO: Failure Case */
		});

		
	};

/*
	var getFirstPageJams = function() {
		var request = { 
			show: "past",
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
			jams = results.jams;
			getNextPageJams(results);
			displayPastJams();			
		})
		.fail(function(jqXHR, error, errorThrown){
			if(jqXHR.status == 404) {
				alert("Username " + username + " does not exist.");				
			}
			else {
				alert("An error occurred. Please try again later.");
			}
		});
		
	};

	var getNextPageJams = function(results) {

		if(results.list.hasMore) {
			$.ajax({
				url: results.list.next,
				dataType: "json",
				type: "GET",
				crossDomain: "true"
			})
			.done(function(nextResults) {
				$.merge(jams, nextResults.jams);
				getNextPageJams(nextResults);
				
			})
			.fail(function(jqXHR, error, errorThrown) {			
				console.log("Error when getting next page's jams");				
			});
		}		
	};
*/

	var displayPastJams = function(results) {		
		var html = "";				

		/* User has no past jams */
		if(totalJams <= 0) {
			html += "<p class='info'>" + username + " has no past jams.</p>"			
		}
		else {
			html += "<h2><a href='http://www.thisismyjam.com/" + username + "'>" + username + "</a> jams</h2>";
			getRandomJams();

			/* TODO: WILL HAVE TO DO DISPLAY INSIDE .done() */
			console.log(jams.length);
		}		

		$("#jamResults").html(html);
	};

});