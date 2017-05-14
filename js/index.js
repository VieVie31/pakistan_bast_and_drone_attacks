
var map;
var markerObjects = [];

var polygon_id_counter = 1; //to identifiate easily the polygons added by user...
var polygons_area_table = [];

function utcformat(d) {
  d = new Date(d);
  var tail = ' GMT', D = [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate()];
  var i= 3;
  while (i) {
    --i;
    if (D[i]<10) 
      D[i]= '0'+D[i];
  }
  return D.join('/') + tail;
}

function make_info(data, index_of_data) {
  var date = utcformat(parseInt(data.timestamp) * 1000).split(' ')[0].split('/');

  return '<div id="content">'+
  '<div id="bodyContent">'+
  '<table id="infobulle_table">'+
  '<caption>' + data.Location + '</caption>'+
  '<tr>'+
  '<td>' + "DATE" + '</td>'+
  '<td><input type="text" id="day_' + index_of_data + '" value="' + date[2] + '" placeholder="day" style="width:33px;border:none;" onchange="change_values(' + index_of_data + ');"/>' + '<input type="text" id="month_' + index_of_data + '" value="' + date[1] + '" placeholder="month" style="width:33px;border:none;" onchange="change_values(' + index_of_data + ');"/>' + '<input type="text" id="year_' + index_of_data + '" value="' + date[0] + '" placeholder="year" style="width:33px;border:none;" onchange="change_values(' + index_of_data + ');"/>' + '</td>'+
  '</tr>'+

  '<tr>'+
  '<td>' + "CITY" + '</td>'+
  '<td><input id="city_' + index_of_data + '" type="text" value="' + data.City + '" placeholder="city..." onchange="change_values(' + index_of_data + ');"/></td>'+
  '</tr>'+

  '<tr>'+
  '<td>' + "#KiLLED" + '</td>'+
  '<td><input id="nb_killed_' + index_of_data + '" type="text" value="' + data.nb_killed + '" onchange="change_values(' + index_of_data + ');"></input></td>'+
  '</tr>'+

  '<tr>'+
  '<td>' + "#INJURED" + '</td>'+
  '<td><input id="nb_injured_' + index_of_data + '" type="text" value="' + data.nb_injured + '" onchange="change_values(' + index_of_data + ');"></input></td>'+
  '</tr>'+

  '<tr>'+
  '<td>' + "#NB_TERRO" + '</td>'+
  '<td><input id="nb_terro_' + index_of_data + '" type="text" value="' + data.nb_terro + '" onchange="change_values(' + index_of_data + ');"></input></td>'+//' + data.nb_terro + '</td>'+
  '</tr>'+

  '<tr>'+
  '<td>' + "TARGET TYPE" + '</td>'+
  '<td>' + data.target_type + '</td>'+
  '</tr>'+

  '<tr>'+
  '<td>' + "RELIGIOUS TARGET" + '</td>'+
  '<td>' + data.religious_target + '</td>'+
  '</tr>'+

  '</table>'+

  '<button onclick="delete_marker('+ index_of_data +');">delete</button>' + 
  '<button onclick="console.log(' + index_of_data + ');">index</button>' + 
/*
  (
  	current_user != null 
  	? '<button onchange="change_values(' + index_of_data + ');">Enregister les nouvelles valeurs</button>'
  	: ''
  ) +
*/
  '</div>'+
  '</div>';
}

function initialize() {
    markerObjects = []; //do not forget to reinitialise the markerobjects list... :p
    $("#overlay").html(""); //reset the list...

    var myOptions = {
      center: new google.maps.LatLng(markers[0].Latitude, markers[0].Longitude),
      zoom: 5,
      mapTypeId: google.maps.MapTypeId.HYBRID,

      disableDefaultUI: true,

      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },

      mapTypeControl: true,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },

      fullscreenControl: true,
      streetViewControl: false
    };

    map = new google.maps.Map(document.getElementById("map"), myOptions);
    map.setTilt(45);

    // drop markers one by one
    var i = 0;
    var interval = setInterval(function() {
      var data = markers[i];
      var myLatlng = new google.maps.LatLng(
        parseFloat(data.Latitude)  + (Math.random() / 1000), //add very small random value to net get all points at the same place...
        parseFloat(data.Longitude) + (Math.random() / 1000)
      );

      var infos = make_info(data, i);

      //set different images : bomb = terrorist attacks, plane = drone attacks
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

      // create a row in the overlay table and bind onhover
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

    // continue iteration
    i ++;
    if (i == markers.length) {
      clearInterval(interval);
    }
  }, 0);

  //add a drawer manager to let the user filter by drawed region ??
  //https://developers.google.com/maps/documentation/javascript/examples/drawing-tools
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.LEFT_TOP,
      drawingModes: ['polygon', 'marker']
    },
    markerOptions: {
      icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
    },
    polygonOptions: {
      clickable: true,
      editable: true,
      dragable: true,
      zIndex: 1
    }
  });
  
  //TODO : define actions associated to the drawing manager, polygons and markers...
  google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
  		if (event.type == "polygon"){
  	        var polygon_id = 'AREA_' + (polygon_id_counter ++); //set an id to the polygon
  	  
  	        polygons_area_table[polygon_id] = event.overlay; //save the polygon in tha table...
  	  
  	        event.overlay.content = polygon_id;
  	        event.overlay.infoWindow = new google.maps.InfoWindow;
  	        event.overlay.infoWindow.setContent(event.overlay.content);
  	  
  	        google.maps.event.addListener(event.overlay, 'click', function(e) {
  	              event.overlay.infoWindow.setPosition(e.latLng);
  	              event.overlay.infoWindow.open(map);
  	        });
  	  
  	        google.maps.event.addListener(event.overlay, 'rightclick', function() {
  	              polygons_area_table[event.overlay.content] = null;
  	              event.overlay.infoWindow.open(null);
  	              event.overlay.setMap(null);
  	        });
  	    } else if (event.type == "marker") {
  	    	//alert("TODO : adding markers...");
          add_marker(event);
  	    }
  });
  
  drawingManager.setMap(map);

  //FIXME : filters doesn't work on maker cluster... :'(
  //var markerCluster = new MarkerClusterer(map, markerObjects, {maxZoom: 5, imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
}


google.maps.event.addDomListener(window, 'load', initialize);

//create a filter text entry
//$("#overlay").prepend("<input type='text' placeholder='search...' style='width:100%;height:50px;'></input>")

function add_marker(event) {
  var lat = event.overlay.position.lat();
  var lng = event.overlay.position.lng();
  var id = markers.length;
  
  $("#addMarker").modal("show");

  var new_marker = [{
    "":parseInt(id-1),
    "S#":parseInt(id),
    "Blast Day Type":"",
    "City":"",
    "Latitude": parseFloat(lat),
    "Longitude": parseFloat(lng),
    "day":"",
    "timestamp":"",
    "nb_killed":"",
    "nb_injured":"",
    "nb_terro":"",
    "target_type":"",
    "religious_target":"",
    "type_attack":""
  }];

  markers.push(new_marker);
}

