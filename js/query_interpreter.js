filterMarkers = function (original_rules) {
    for (i = 0; i < markerObjects.length; i++) {
        marker = markerObjects[i];
        data = marker.data;

        //clone the rules to not destro them...
        rules = jQuery.extend(true, {}, original_rules);

        fun_condition = (rules.condition == "AND") ? filter_conditon_and : filter_conditon_or;

        if (fun_condition(rules.rules, data))
            marker.setVisible(true);
        else
            marker.setVisible(false);
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


//some tests cases...
r2 = {
  "condition": "AND",
  "rules": [
    {
      "condition": "AND",
      "rules": [
        {
          "id": "RELIGION",
          "field": "RELIGION",
          "type": "string",
          "input": "text",
          "operator": "equal",
          "value": "Muslim"
        },
        {
          "id": "RELIGION",
          "field": "RELIGION",
          "type": "string",
          "input": "text",
          "operator": "not_equal",
          "value": "None"
        }
      ]
    }
  ]
};

r3 = {
    "condition":"AND",
    "rules":[
    {
        "condition":"AND",
        "rules":[
        {
            "id":"RELIGION",
            "field":"RELIGION",
            "type":"string",
            "input":"text",
            "operator":"equal",
            "value":"Muslim,None"
        },
        {
            "id":"YEAR",
            "field":"YEAR",
            "type":"double",
            "input":"text",
            "operator":"less",
            "value":"2001"
        },
        {
            "condition":"AND",
            "rules":[
            {
                "id":"NB_KILLED",
                "field":"NB_KILLED",
                "type":"double",
                "input":"text",
                "operator":"greater",
                "value":"3"
            }
            ]
        }
        ]
    }
    ]
};

r1 = {
  "condition": "AND",
  "rules": [
    {
      "id": "YEAR",
      "field": "YEAR",
      "type": "double",
      "input": "text",
      "operator": "greater",
      "value": "2001"
    },
    {
      "id": "NB_KILLED",
      "field": "NB_KILLED",
      "type": "double",
      "input": "text",
      "operator": "greater",
      "value": "3"
    },
    {
      "id": "RELIGION",
      "field": "RELIGION",
      "type": "string",
      "input": "text",
      "operator": "equal",
      "value": "Muslim"
    }
  ]
};

//console.log(filter_conditon_or(r2.rules, markers[0]));
//console.log(filter_conditon_and(r3.rules, markers[0]));

