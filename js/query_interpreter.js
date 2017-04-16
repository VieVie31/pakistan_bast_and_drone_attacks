filterMarkers = function (rules) {
    for (i = 0; i < markerObjects.length; i++) {
        data = markerObjects[i].data;
        // If is same category or category not picked
        if (marker.category == category || category.length === 0) {
            marker.setVisible(true);
        }
        // Categories don't match 
        else {
            marker.setVisible(false);
        }
    }
}

function contion_and(rules, data) { //rules is a list of rules
    if (rules.length == 0)
        return true;
    else {
        current_rule = rules.pop();

        var result_current_rule = false;
        //TODO: do the filter corresponding to the current rule
        

        return result_current_rule && contion_and(rules, data);
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


r1 = {
  "condition": "AND",
  "rules": [
    {
      "id": "RELIGION",
      "field": "RELIGION",
      "type": "string",
      "input": "text",
      "operator": "equal",
      "value": "None"
    }
  ]
};
