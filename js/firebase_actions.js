function save_and_log_out() {
	save_my_markers(markers);
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
	}
	//injured 
	var v = parseInt($("#nb_injured_" + index).val());
	if ('' + v != "NaN") markers[index].nb_injured = v;
	else {
		alert("The only 'Integer' accepted !!");
		$("#nb_injured_" + index).val(markers[index].nb_injured);
	}
	//terro 
	var v = parseFloat($("#nb_terro_" + index).val());
	if ('' + v != "NaN") markers[index].nb_terro = v;
	else {
		alert("Only 'Integer' or 'Float' accepted !!");
		$("#nnb_terro_" + index).val(markers[index].nb_terro);
	}
}

function save_my_markers(markers) {
	var database = firebase.database();
	var t = database.ref('markers/' + current_user.uid);

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

	//save my markers online
	t.set({markers: lst});
}



function action_when_sign_in() {
	$("#connexion_box").css("display", "none");
	$("#deconnexion_box").css("display", "block");

	var database = firebase.database();
	var ref = database.ref('markers/' + current_user.uid);
	ref.on("value", function (m) {
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
	});
}

var current_user = null;

function user_create_account() {
	var email = $("#mail_input").val();
	var password = $("#pass_input").val();

	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
	    current_user = firebase.auth().currentUser;
	    toastr.info("Your account is now live... Have fun !!");

	    $("#connexion_box").css("display", "none");
		$("#deconnexion_box").css("display", "block");

	    //save the originals markers....
	    save_my_markers(markers);

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
	}, function(error) {
		var errorCode = error.code;
		var errorMessage = error.message;

		toastr.error(errorMessage, "SignOut Error");
	});
}

