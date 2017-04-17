filterMarkers = function (original_rules) {
    for (i = 0; i < markerObjects.length; i++) {
        marker = markerObjects[i];
        data = marker.data;

        //clone the rules to not destro them...
        rules = jQuery.extend(true, {}, original_rules);

        fun_condition = (rules.condition == "AND") ? filter_conditon_and : filter_conditon_or;

        if (fun_condition(rules.rules, data)) {
            $('#id_lst_' + data["S#"]).css('display', 'block'); //display in the left list
            marker.setVisible(true); //display the amrker
        } else {
            $('#id_lst_' + data["S#"]).css('display', 'none'); //hide from the list
            marker.setVisible(false); //hide the marker
        }
    }
}

function filter_conditon_and(rules, data) { //rules is a list of rules
    if (rules.length == 0)
        return true;
    else {
        current_rule = rules.pop();

        var result_current_rule = false;
        switch (current_rule.id) {
        case "RELIGION":
            result_current_rule = filter_religion(current_rule, data);
            break;
        case "YEAR":
            result_current_rule = filter_year(current_rule, data);
            break;
        case "NB_KILLED":
            result_current_rule = filter_killed(current_rule, data);
            break;
        case "NB_INJURED":
            result_current_rule = filter_injured(current_rule, data);
            break;
        case "NB_KAMIKAZES":
            result_current_rule = filter_kamikaze(current_rule, data);
            break;
        case "TARGET_TYPE":
            result_current_rule = filter_target_type(current_rule, data);
            break;
        case "IS_AREA":
            result_current_rule = filter_area(current_rule, data);
            break;
        default: //undefined --> new group of rules
            if (current_rule.condition == "AND")
                result_current_rule = filter_conditon_and(current_rule.rules, data);
            else if (current_rule.condition == "OR") 
                result_current_rule = filter_conditon_or(current_rule.rules, data);
            break;
        }


        return result_current_rule && filter_conditon_and(rules, data);
    }
}

function filter_conditon_or(rules, data) { //rules is a list of rules
    if (rules.length == 0)
        return true;
    else {
        current_rule = rules.pop();

        var result_current_rule = false;
        switch (current_rule.id) {
        case "RELIGION":
            result_current_rule = filter_religion(current_rule, data);
            break;
        case "YEAR":
            result_current_rule = filter_year(current_rule, data);
            break;
        case "NB_KILLED":
            result_current_rule = filter_killed(current_rule, data);
            break;
        case "NB_INJURED":
            result_current_rule = filter_injured(current_rule, data);
            break;
        case "NB_KAMIKAZES":
            result_current_rule = filter_kamikaze(current_rule, data);
            break;
        case "TARGET_TYPE":
            result_current_rule = filter_target_type(current_rule, data);
            break;
        case "IS_AREA":
            result_current_rule = filter_area(current_rule, data);
            break;
        default: //undefined --> new group of rules
            if (current_rule.condition == "AND")
                result_current_rule = filter_conditon_and(current_rule.rules, data);
            else if (current_rule.condition == "OR") 
                result_current_rule = filter_conditon_or(current_rule.rules, data);
            break;
        }

        return result_current_rule || filter_conditon_and(rules, data);
    }
}

function filter_religion(r, data) {
    if (r.operator == "equal") {
        religions = r.value.split(',');
        for (var i = 0; i < religions.length; i++) {
            if (religions[i] == data.religious_target)
                return true;
        }

        return false;
    } else { //not equal
        religions = r.value.split(',');
        for (var i = 0; i < religions.length; i++) {
            if (religions[i] != data.religious_target)
                return true;
        }

        return false;
    }
}

function filter_target_type(r, data) {
    if (r.operator == "equal") {
        target_type = r.value.split(',');
        for (var i = 0; i < target_type.length; i++) {
            if (target_type[i] == data.target_type)
                return true;
        }

        return false;
    } else { //not equal
        target_type = r.value.split(',');
        for (var i = 0; i < target_type.length; i++) {
            if (target_type[i] != data.target_type)
                return true;
        }

        return false;
    }
}

function filter_year(r, data) {
    if (r.operator == "less")
        return (parseInt(r.value) > new Date(parseInt(data.timestamp) * 1000).getUTCFullYear());
    else //greater
        return (parseInt(r.value) < new Date(parseInt(data.timestamp) * 1000).getUTCFullYear());
}

function filter_killed(r, data) {
    if (r.operator == "less")
        return (parseInt(r.value) > parseInt(data.nb_killed));
    else //greater
        return (parseInt(r.value) < parseInt(data.nb_killed));
}

function filter_injured(r, data) {
    if (r.operator == "less")
        return (parseInt(r.value) > parseInt(data.nb_injured));
    else //greater
        return (parseInt(r.value) < parseInt(data.nb_injured));
}

function filter_kamikaze(r, data) {
    if (r.operator == "less")
        return (parseInt(r.value) > parseInt(data.nb_kamikaze));
    else //greater
        return (parseInt(r.value) < parseInt(data.nb_kamikaze));
}

function filter_area(r, data) {
    var polygon = polygons_area_table['AREA_' + r.value];
    var myLatlng = new google.maps.LatLng(
        parseFloat(data.Latitude),
        parseFloat(data.Longitude)
    );

    if (r.operator == "equal") {
        return google.maps.geometry.poly.containsLocation(myLatlng, polygon);
    } else { //not equal
        return !google.maps.geometry.poly.containsLocation(myLatlng, polygon);
    }
}

