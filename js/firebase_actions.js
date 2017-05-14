function save_and_log_out() {
	save_my_markers(markers, true);
	user_log_out();
}


function change_values(index) {
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
	localStorage.setItem("pakpak_custom_dataset_" + markers[index], JSON.stringify(markers[index]));
}

var markers_to_save_online = [];
var markers_to_save_online_hashes = [];
var last_uid = null;

function save_local(markers) {
	var lst = [];
	for (var i = 0; i < markers.length; i++) {
		var m = JSON.stringify(markers[i]);
		lst[i] = JSON.parse(JSON.stringify(m));
		localStorage.setItem("pakpak_custom_dataset", JSON.stringify(lst[i]));
	};
	localStorage.setItem("pakpak_custom_dataset", lst);
	//console.log(localStorage);
	//console.log(localStorage.getItem("pakpak_original_dataset"));
}

function delete_marker(index) {
	for (int i = index+1; i<markers.length; i++){
		markers[i][""] = markers[i][""]-1;
		markers[i]["S#"] = markers[i]["S#"]-1; 
	}
	markers[index] = "";
	save_local(markers);
	console.log(markers[index]);
}

function addMarker() {
	var type_attack = $("#select_attack_type").val();
	var date = $("#date").val();
	var day_type = $("#day_type").val();
	var city = $("#city").val();
	var killed = $("#killed").val();
	var injured = $("#injured").val();
	var terro = $("#terro").val();
	var target_type = $("#select_target_type").val();
	var religious_target_type = $("#select_religious_type").val();
	console.log(type_attack,date,day_type,city,killed,injured,terro,target_type,religious_target_type);

}

function save_my_markers(markers, online) {
	last_uid = current_user.uid;
	var lst = [];
	var lst_hashes = [];

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

		lst[i] = JSON.parse(JSON.stringify(m));
		lst_hashes[i] = hashJSON(m);

		//save each marker in the local storage
		localStorage.setItem("pakpak_custom_dataset_hashes_" + last_uid + "_" + lst_hashes[i], JSON.stringify(lst[i]));
	}
/*
	//offline saving the markers
	var dataset_version = JSON.stringify(lst).hashCode();
	localStorage.setItem("pakpak_custom_dataset_" + current_user.uid, JSON.stringify(markers));
	localStorage.setItem("pakpak_custom_dataset_version_" + current_user.uid, dataset_version);
*/
	//save all the markers hash/id in the local storage...
	localStorage.setItem("pakpak_custom_dataset_hashes_" + last_uid, lst_hashes);


	if (online) {
		var database = firebase.database();
/*
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
*/

//////////////
		var ref = database.ref('hashes/' + last_uid);
		ref.set({hashes: lst_hashes.join()}); //upload the list of all markers as a single string...

		//push each marker online if not exists
		markers_to_save_online = lst;
		markers_to_save_online_hashes = lst_hashes;
		//console.log(markers_to_save_online_hashes);
		for (var i = 0; i < markers_to_save_online.length; i++) {
			var database = firebase.database();
			var ref = database.ref('markers_pool/' + markers_to_save_online_hashes[i]);

		//	console.log("" + i + "_" + markers_to_save_online_hashes[i]);

			//TODO: check if exists before to upload...
			ref.set({marker : markers_to_save_online[i]});
		}
	} else {
		toastr.info("Markers localy saved...");
	}

}



function action_when_sign_in() {
	$("#connexion_box").css("display", "none");
	$("#deconnexion_box").css("display", "block");

	toastr.info("Fetching your custom markers from your localStorage...");

	var offline_markers = JSON.parse(localStorage.getItem("pakpak_custom_dataset_" + current_user.uid));
	var offline_version = JSON.parse(localStorage.getItem("pakpak_custom_dataset_version_" + current_user.uid));

	//load the user hashes list...
	var offline_markers_hashes = localStorage.getItem("pakpak_custom_dataset_hashes_" + current_user.uid);
	if (offline_markers_hashes)
		offline_markers_hashes = offline_markers_hashes.split(',').map(function (v) { return parseInt(v); });
	//load the user markers from hashes id...
	var offline_markers_by_hashes = [];
	for (var i = 0; i < offline_markers_hashes.length; i++) {
		offline_markers_by_hashes.push(JSON.parse(
			localStorage.getItem("pakpak_custom_dataset_hashes_" + current_user.uid + "_" + offline_markers_hashes[i])
		));
	}

	//get the markers list of the user online...
	var database = firebase.database();
	var ref = database.ref('hashes/' + current_user.uid);
	ref.once("value", function(v) {
		toastr.info("Fetching your custom markers from our database...");

		var online_markers_hashes = v.val().hashes;
		if (online_markers_hashes)
			online_markers_hashes = online_markers_hashes.split(',').map(function (v) { return parseInt(v); });
		var online_markers = [];

		if (online_markers_hashes == offline_markers_hashes)
			return;

		//for each maker hash, check if the marker is offline loaded...
		for (var i = 0; i < offline_markers_hashes.length; i++) {
			if (offline_markers_hashes.indexOf(offline_markers_hashes[i]) < 0) { //not locally saved...
				//TODO retrive the marker...

				var refMarker = 
				refMarker.on("value", function(v) {
					//add directly to markers...
					markers.push(v.val().marker);

					//reinitialise when a new marker was retrieved... ?
					initialize();
				});
			} else { //already in the localStorage... just retrieve it...
				online_markers.push(
					offline_markers[offline_markers_hashes.indexOf(offline_markers_hashes[i])]
				);
			}
		}

		markers = offline_markers;

		//initialize with the allready present markers...
		initialize();
	});
/*
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
*/
}

var current_user = null;

function user_create_account() {
	var email = $("#mail_input").val();
	var password = $("#pass_input").val();

	firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
	    current_user = firebase.auth().currentUser;
/*
	    //create a version number...
		var database = firebase.database();
		var t = database.ref('version/' + current_user.uid);
		t.set({version: 0});
*/

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


