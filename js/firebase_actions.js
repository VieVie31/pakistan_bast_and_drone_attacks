function save_and_log_out() {
	save_my_markers(markers, true);
	user_log_out();
}


function change_values(index) {
	//TODO: make it works !!!! without refreshing the map !!!
	/*
	var database = firebase.database();
	var ref = database.ref('markers/' + current_user.uid + "/markers/" + index);

	var tmp_m = JSON.parse(JSON.stringify(markers[index]));
	var id = tmp_m["S#"];
	var empty_id = tmp_m[""];
	delete tmp_m[""];
	delete tmp_m["S#"];
	tmp_m["S"] = id;
	tmp_m["id"] = "" + id + "_" + tmp_m.type_attack;

	//update the new values...
	tmp_m.nb_killed = $("#nb_killed_" + index).val();

	//upload the new version...
	ref.set(tmp_m);
	*/

	//killed
	var v = parseInt($("#nb_killed_" + index).val());
	if ('' + v != "NaN") markers[index].nb_killed = v;
	else {
		alert("The only 'Integer' accepted !!");
		$("#nb_killed_" + index).val(markers[index].nb_killed); //reset the old value
		return;
	}
	//injured 
	var v = parseInt($("#nb_injured_" + index).val());
	if ('' + v != "NaN") markers[index].nb_injured = v;
	else {
		alert("The only 'Integer' accepted !!");
		$("#nb_injured_" + index).val(markers[index].nb_injured);
		return;
	}
	//terro 
	var v = parseFloat($("#nb_terro_" + index).val());
	if ('' + v != "NaN") markers[index].nb_terro = v;
	else {
		alert("Only 'Integer' or 'Float' accepted !!");
		$("#nb_terro_" + index).val(markers[index].nb_terro);
		return;
	}
}

function save_my_markers(markers, online) {
	var lst = [];

	for (var i = 0; i < markers.length; i++) {
		//deepcopy of the marker
		var m = JSON.parse(JSON.stringify(markers[i]));
		var id = m["S#"];
		var empty_id = m[""];
		
		//thoses keys are not in varidl format so detele them...
		delete m[""];
		delete m["S#"];
		m["S"] = id;
		m["id"] = "" + id + "_" + m.type_attack;

		lst[i] = m;
	}

	//offline saving the markers
	var dataset_version = JSON.stringify(lst).hashCode();
	localStorage.setItem("pakpak_custom_dataset_" + current_user.uid, JSON.stringify(markers));
	localStorage.setItem("pakpak_custom_dataset_version_" + current_user.uid, dataset_version);

	if (online) {
		var database = firebase.database();
		var t = database.ref('version/' + current_user.uid);
		t.once("value", function(v) {
			var online_version = parseInt(v.val().version); 

			if (online_version != dataset_version) {
				//save my markers online
				var database = firebase.database();
				var t = database.ref('markers/' + current_user.uid);
				t.set({markers: lst});

				//saving the version of the dataset...
				var database = firebase.database();
				var t = database.ref('version/' + current_user.uid);
				t.set({version: dataset_version});

				toastr.info("Markers online saved...");
			} else {
				toastr.info("This version is allready online...");
			}
		});
	} else {
		toastr.info("Markers localy saved...");
	}

}



function action_when_sign_in() {
	$("#connexion_box").css("display", "none");
	$("#deconnexion_box").css("display", "block");

	var offline_markers = JSON.parse(localStorage.getItem("pakpak_custom_dataset_" + current_user.uid));
	var offline_version = JSON.parse(localStorage.getItem("pakpak_custom_dataset_version_" + current_user.uid));

	var database = firebase.database();
	var t = database.ref('version/' + current_user.uid);
	t.once("value", function(v) { 
		var online_version = 0;

		if (!v.val()) {
			//create a version number...
			var database = firebase.database();
			var t = database.ref('version/' + current_user.uid);
			t.set({version: 0});
		}

		online_version = parseInt(v.val().version);

		if (!offline_markers || offline_markers == "null" || online_version != parseInt(offline_version)) {
			toastr.info("Fetching your custom markers in our database...");

			var database = firebase.database();
			var ref = database.ref('markers/' + current_user.uid);
			ref.once("value", function (m) {
				//retrieve my markers...
				markers = m.val().markers;

				//reset in the original format not supported by the firebase database storage...
				for (var i = 0; i < markers.length; i++) {
					markers[i]["S#"] = markers[i]["S"];
					markers[i][""] = markers[i]["id"];
				}

				//reload ALL the map...
				markerObjects = [];
				$("#overlay").html(""); //reset the list of attentas...
				initialize(); //the map function...

				//save the markers offline...
				save_my_markers(markers, false);
			});
		} else { //TODO: check the version online / offline if the same or not...
			toastr.info("Using your offline stored markers...");

			//if allready offline value, just use it...
			markers = offline_markers;
			initialize(); //the map function...
		}

	});
}

var current_user = null;

function user_create_account() {
	var email = $("#mail_input").val();
	var password = $("#pass_input").val();

	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
	    current_user = firebase.auth().currentUser;

	    //create a version number...
		var database = firebase.database();
		var t = database.ref('version/' + current_user.uid);
		t.set({version: 0});


	    $("#connexion_box").css("display", "none");
		$("#deconnexion_box").css("display", "block");

	    //save the originals markers....
	    save_my_markers(markers, true);

	    
	    toastr.info("Your account is now live... Have fun !!");

	}, function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		toastr.error(errorMessage, "Account Creation Error");
	});
}

function user_sign_in() {
	var email = $("#mail_input").val();
	var password = $("#pass_input").val();

	firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
	    current_user = firebase.auth().currentUser;
	    toastr.info("You are now logged !!");
	    action_when_sign_in();
	}, function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		toastr.error(errorMessage, "Sign In Error");
	});
}

function user_log_out() {
	firebase.auth().signOut().then(function() {
		current_user = null;

		toastr.info("You are now disconnected !!");

		$("#connexion_box").css("display", "block");
		$("#deconnexion_box").css("display", "none");

		//reseting the originals markers storred in the localStorage...
		markers = localStorage.getItem("pakpak_original_dataset");
		markers = JSON.parse(markers);
	}, function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;

		toastr.error(errorMessage, "SignOut Error");
	});
}

