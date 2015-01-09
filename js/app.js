$(document).ready(function(){

	var jamsPerPage = 3;

	$("#userForm").submit(function(event){
		event.preventDefault();
		var username = $(this).find("input[name='username']").val();
		username = $.trim(username);
		if(!isValidInput(username)) {
			alert("Please fill in a username.");
			return;
		}

		resetResultFields();
		getPastJams(username);				
	});

	var isValidInput = function(username) {
		if(username === "") {
			return false;
		}
		return true;
	};

	var resetResultFields = function() {
		$("#userInput").val("");
		$("#jamResults").html("");
	};

	var getPastJams = function(username) {
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
		.done(function(result){
			displayPastJams(username, result.jams);
		})
		.fail(function(jqXHR, error, errorThrown){
			if(jqXHR.status == 404) {
				alert("Username " + username + " does not exist.");				
			}
			else {
				alert("An error occurred. Please try again later.");
			}
			return;
		});
		
	};

	var displayPastJams = function(username, jams) {		
		var html = "";
			
		/* User has no past jams */
		if(jams.length <= 0) {
			html += "<p class='info'>" + username + " has no past jams.</p>"			
		}
		else {
			html += "<h2><a href='http://www.thisismyjam.com/" + username + "'>" + username + "</a> jams</h2>";
		}

		/* TODO: Handle past jams */


		$("#jamResults").html(html);
	};

});