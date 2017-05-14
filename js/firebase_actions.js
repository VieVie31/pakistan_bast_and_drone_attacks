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

	//TODO: save the GPS coordinates ??

	//day
	var day = parseInt($("#day_" + index).val().trim());
	if ('' + day != "NaN" && day < 31 && day > 0) day = day;
	else {
		toastr.error("The only 0 < 'Integer' < 32 accepted !!");
		//TODO: reset the old value
		return;
	}
	//month
	var month = parseInt($("#month_" + index).val().trim());
	if ('' + month != "NaN" && month < 13 && month > 0) month = month;
	else {
		toastr.error("The only 0 < 'Integer' < 13 accepted !!");
		//TODO: reset the old value
		return;
	}
	//year
	var year = parseInt($("#year_" + index).val().trim());
	if ('' + year != "NaN" && year > 0) year = year;
	else {
		toastr.error("The only 0 < 'Integer' accepted !!");
		//TODO: reset the old value
		return;
	}
	markers[index].timestamp = '' + Math.round(new Date(year, month, day).getTime() / 1000);
	//TODO: change the day of the week!!
	//TODO: change the icone !!
	//city
	var v = $("#city_" + index).val().trim();
	if ('' + v) markers[index].City = v;
	else {
		toastr.error("city name should not be empty !! :'(");
		$("#city_" + index).val(markers[index].City.trim());
		return;
	}
	//killed
	var v = parseInt($("#nb_killed_" + index).val());
	if ('' + v != "NaN") markers[index].nb_killed = v;
	else {
		toastr.error("The only 'Integer' accepted !!");
		$("#nb_killed_" + index).val(markers[index].nb_killed); //reset the old value
		return;
	}
	//injured 
	var v = parseInt($("#nb_injured_" + index).val());
	if ('' + v != "NaN") markers[index].nb_injured = v;
	else {
		toastr.error("The only 'Integer' accepted !!");
		$("#nb_injured_" + index).val(markers[index].nb_injured);
		return;
	}
	//terro 
	var v = parseFloat($("#nb_terro_" + index).val());
	if ('' + v != "NaN") markers[index].nb_terro = v;
	else {
		toastr.error("Only 'Integer' or 'Float' accepted !!");
		$("#nb_terro_" + index).val(markers[index].nb_terro);
		return;
	}
	save_local();
}

function save_local() {
<<<<<<< HEAD
	localStorage.setItem("pakpak_custom_dataset", JSON.stringify(markers));

	var lst = [];
	for (var i = 0; i < markers.length; i++) {
		var m = JSON.stringify(markers[i]);
		lst[i] = JSON.parse(JSON.stringify(m));
		localStorage.setItem("pakpak_custom_dataset"+i, JSON.stringify(lst[i]));
	};
	localStorage.setItem("pakpak_custom_dataset", lst);
	//console.log(localStorage);
	//console.log(localStorage.getItem("pakpak_original_dataset"));
||||||| merged common ancestors
	var lst = [];
	for (var i = 0; i < markers.length; i++) {
		var m = JSON.stringify(markers[i]);
		lst[i] = JSON.parse(JSON.stringify(m));
		localStorage.setItem("pakpak_custom_dataset"+i, JSON.stringify(lst[i]));
	};
	localStorage.setItem("pakpak_custom_dataset", lst);
	//console.log(localStorage);
	//console.log(localStorage.getItem("pakpak_original_dataset"));
=======
	localStorage.setItem("pakpak_custom_dataset", JSON.stringify(markers));
>>>>>>> 0600ff4c49e4c3eb9bc52ecf130bd95a3158ce46
}

function delete_marker(index) {
<<<<<<< HEAD
	markerObjects[index].setMap(null);

||||||| merged common ancestors
=======
	markerObjects[index].setMap(null);
>>>>>>> 0600ff4c49e4c3eb9bc52ecf130bd95a3158ce46
	markers[index] = "";
	for (var i = index+1; i<markers.length; i++){
		markers[i][""] = markers[i][""]-1;
		markers[i]["S#"] = markers[i]["S#"]-1; 
	}
	save_local();
}

function addMarker() {
	var type_attack = $("#select_attack_type").val();
	var date = new Date($("#date").val());
	var day_type = $("#day_type").val();
	var city = $("#city").val();
	var killed = $("#killed").val();
	var injured = $("#injured").val();
	var terro = $("#terro").val();
	var target_type = $("#select_target_type").val();
	var religious_target_type = $("#select_religious_type").val();

	console.log(type_attack,date,day_type,city,killed,injured,terro,target_type,religious_target_type);

<<<<<<< HEAD
	var m = markers[markers.length-1];

	var m = [markers.length-1];
||||||| merged common ancestors
	var m = [markers.length-1];
=======
	var m = markers[markers.length-1];
>>>>>>> 0600ff4c49e4c3eb9bc52ecf130bd95a3158ce46
	m["City"] = city;
    m["day"]=jourDeLaSorciere(date.getDay()),
    m["Blast Day Type"]=day_type;
<<<<<<< HEAD
    m["timestamp"]=date.getTime();
||||||| merged common ancestors
    m["timestamp"]=day.getTime(),
=======
    m["timestamp"]=date.getTime(),
>>>>>>> 0600ff4c49e4c3eb9bc52ecf130bd95a3158ce46
    m["nb_killed"]=killed;
    m["nb_injured"]=injured;
    m["nb_terro"]=terro;
    m["target_type"]=target_type;
    m["religious_target"]=religious_target_type;
    m["type_attack"]=type_attack;

    setPin();
    markerObjects[markers.length-1].setMap(map);
    save_local();
}
<<<<<<< HEAD

function setPin() {
       var data = markers[markers.length-1];
       var myLatlng = new google.maps.LatLng(
        parseFloat(data.Latitude)  + (Math.random() / 1000), //add very small random value to net get all points at the same pla
        parseFloat(data.Longitude) + (Math.random() / 1000)
      );
       
       var infos = make_info(data, markers.length-1);

      var administration = null;
      if (data.type_attack == "blast") { //suicide_attacks
             if (data.timestamp < 979945200)//clinton administration
               administration = "./img/bomb_red.png";
             else if (data.timestamp > 979945200 && data.timestamp < 1232406000)//bush administation
               administration = "./img/bomb_blue.png"; //republican
             else if (data.timestamp > 1232406000 && data.timestamp < 1484866800)//obama administration
               administration = "./img/bomb_red.png";
             else //trump administration
               administration = "./img/bomb_blue.png";
      } else if (data.type_attack == "drone") { //drone_attacks
         if (data.timestamp < 979945200)//clinton administration
               administration = "./img/drone_red.png";
             else if (data.timestamp > 979945200 && data.timestamp < 1232406000)//bush administation
               administration = "./img/drone_blue.png"; //republican
             else if (data.timestamp > 1232406000 && data.timestamp < 1484866800)//obama administration
               administration = "./img/drone_red.png";
             else //trump administration
               administration = "./img/drone_blue.png";
      }
      var pinImage = new google.maps.MarkerImage(administration);

      // marker object for the marker
      var marker = new google.maps.Marker({
        draggable: true, //make it movable
        data: data,
        position: myLatlng,
        map: map,
        title: data.Location,
        //animation: google.maps.Animation.DROP,
        opacity: 0.5,
        icon: pinImage,
        scaledSize: new google.maps.Size(12, 12)
      });

      //the pop up containing the infos
      var infowindow = new google.maps.InfoWindow({
        content: infos
      });


      // store in a global array
      var markerIndex = markerObjects.push(marker) - 1;

      //change the marker opacity when hovering it...
      google.maps.event.addListener(markerObjects[markerIndex], 'mouseover', function() {
       this.setOpacity(1);
      });

      google.maps.event.addListener(markerObjects[markerIndex], 'mouseout', function() {
       this.setOpacity(0.5);
      });

      // click listener on a marker itself
      google.maps.event.addListener(markerObjects[markerIndex], 'click', function() {
        var marker = this;
        if (marker.getAnimation() != null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          //display the infos
          infowindow.open(map, marker);
        }
      });

      var $row = $('<div>')
      .attr('id', 'id_lst_' + data["S#"] + '_' + data.type_attack)
      .addClass('list-group-item')
      .html(data.Location)
      .on('mouseenter', function() {
        var marker = markerObjects[markerIndex];
        marker.setAnimation(google.maps.Animation.BOUNCE);
      })
      .on('mouseleave', function() {
        var marker = markerObjects[markerIndex];
        if (marker.getAnimation() != null) {
          marker.setAnimation(null);
        }
      })
      .on('click', function() {
        var marker = markerObjects[markerIndex];
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.open(map, marker);
      });

      $row.appendTo('#overlay');
}

||||||| merged common ancestors
=======

function setPin() {
	var data = markers[markers.length-1];
	var myLatlng = new google.maps.LatLng(
        parseFloat(data.Latitude)  + (Math.random() / 1000), //add very small random value to net get all points at the same place...
        parseFloat(data.Longitude) + (Math.random() / 1000)
      );
	
	var infos = make_info(data, markers.length-1);

	var administration = null;
      if (data.type_attack == "blast") { //suicide_attacks
	      if (data.timestamp < 979945200)//clinton administration
	        administration = "./img/bomb_red.png";
	      else if (data.timestamp > 979945200 && data.timestamp < 1232406000)//bush administation
	        administration = "./img/bomb_blue.png"; //republican
	      else if (data.timestamp > 1232406000 && data.timestamp < 1484866800)//obama administration
	        administration = "./img/bomb_red.png";
	      else //trump administration
	        administration = "./img/bomb_blue.png";
      } else if (data.type_attack == "drone") { //drone_attacks
      	  if (data.timestamp < 979945200)//clinton administration
	        administration = "./img/drone_red.png";
	      else if (data.timestamp > 979945200 && data.timestamp < 1232406000)//bush administation
	        administration = "./img/drone_blue.png"; //republican
	      else if (data.timestamp > 1232406000 && data.timestamp < 1484866800)//obama administration
	        administration = "./img/drone_red.png";
	      else //trump administration
	        administration = "./img/drone_blue.png";
      }
      var pinImage = new google.maps.MarkerImage(administration);

      // marker object for the marker
      var marker = new google.maps.Marker({
        draggable: true, //make it movable
        data: data,
        position: myLatlng,
        map: map,
        title: data.Location,
        //animation: google.maps.Animation.DROP,
        opacity: 0.5,
        icon: pinImage,
        scaledSize: new google.maps.Size(12, 12)
      });

      //the pop up containing the infos
      var infowindow = new google.maps.InfoWindow({
        content: infos
      });


      // store in a global array
      var markerIndex = markerObjects.push(marker) - 1;

      //change the marker opacity when hovering it...
      google.maps.event.addListener(markerObjects[markerIndex], 'mouseover', function() {
      	this.setOpacity(1);
      });

      google.maps.event.addListener(markerObjects[markerIndex], 'mouseout', function() {
      	this.setOpacity(0.5);
      });

      // click listener on a marker itself
      google.maps.event.addListener(markerObjects[markerIndex], 'click', function() {
        var marker = this;
        if (marker.getAnimation() != null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          //display the infos
          infowindow.open(map, marker);
        }
      });

      var $row = $('<div>')
      .attr('id', 'id_lst_' + data["S#"] + '_' + data.type_attack)
      .addClass('list-group-item')
      .html(data.Location)
      .on('mouseenter', function() {
        var marker = markerObjects[markerIndex];
        marker.setAnimation(google.maps.Animation.BOUNCE);
      })
      .on('mouseleave', function() {
        var marker = markerObjects[markerIndex];
        if (marker.getAnimation() != null) {
          marker.setAnimation(null);
        }
      })
      .on('click', function() {
        var marker = markerObjects[markerIndex];
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.open(map, marker);
      });

      $row.appendTo('#overlay');
}

>>>>>>> 0600ff4c49e4c3eb9bc52ecf130bd95a3158ce46
//jeu de mot lol
function jourDeLaSorciere(d) {
	switch(d) {
		case 0 : return "Monday";
				break;
		case 1 : return "Tuesday";
				break;
		case 2 : return "Wednesday";
				break;
		case 3 : return "Thursday";
				break;
		case 4 : return "Friday";
				break;
		case 5 : return "Saturday";
				break;
		case 6 : return "Sunday";
				break;
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

function push_markers_online() {
    var email = $("#mail_input").val();
    var password = $("#pass_input").val();

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
        current_user = firebase.auth().currentUser;

        $("#mail_input").css("display", "none");
        $("#pass_input").css("display", "none");
        
        var database = firebase.database();
        var ref = database.ref("dataset/");
        ref.set({markers: JSON.stringify(markers)});

        toastr.success("data pushed !! :D");

    }, function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        toastr.error(errorMessage, "Sign In Error");
    });  
}

function pull_markers_offline() {
	var email = $("#mail_input").val();
    var password = $("#pass_input").val();

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
        current_user = firebase.auth().currentUser;

        $("#mail_input").css("display", "none");
        $("#pass_input").css("display", "none");
        
        var database = firebase.database();
	    var ref = database.ref("dataset/");
	    ref.once("value", function(v) {
	    	markers = JSON.parse(v.val().markers); //getting the values...
	    	initialize(); //reset the map...
	    });

        toastr.success("data pulled !! :D");

    }, function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        toastr.error(errorMessage, "Sign In Error");
    }); 
}
