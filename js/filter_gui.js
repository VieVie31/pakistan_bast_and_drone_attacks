// Fix for Selectize
$('#builder-basic').on('afterCreateRuleInput.queryBuilder', function(e, rule) {
  if (rule.filter.plugin == 'selectize') {
    rule.$el.find('.rule-value-container').css('min-width', '200px')
    .find('.selectize-control').removeClass('form-control');
  }
});


data_from_select = function(id) {
  $(id).parent().attr('data-value', $(id).find(":selected").val());
}

data_from_text = function(id) {
  $(id).parent().attr('data-value', $(id).val());
}


$('#builder-basic').queryBuilder({
  plugins: ['bt-tooltip-errors'],
  
  filters: [
  {
    id: 'RELIGION',
    label: 'RELIGION',
    type: 'string',
    plugin: 'selectize',
    plugin_config: {
      valueField: 'id',
      labelField: 'id',
      maxItems: null,
      create: false,
      plugins: ['remove_button'],
      options: [{"id": "None"}, {"id": "Christian"}, {"id": "Sunni"}, {"id": "Ahmedi"}, {"id": "Shiite"}, {"id": "Jews"} ]
    }
  },
  {
   id: "YEAR",
   label: "YEAR",
   type: "double",
   operators: ["less", "greater"],
   validation: {
     callback : function(value, rule) {  
      if (value > 1995 && value < 2018) 
       return true;
     else {
       alert("Date must be between 1996 and 2017"); 
       return false;
     } 
   }
 }
},          
{
  id: "NB_KILLED",
  label: "NB_KILLED",
  type: "double",
  operators: ["less", "greater"]
},
{
  id: "NB_INJURED",
  label: "NB_INJURED",
  type: "double",
  operators: ["less", "greater"]
},
{
  id: "NB_KAMIKAZES",
  label: "NB_KAMIKAZES",
  type: "double",
  operators: ["less", "greater"]
},
{
  id: 'TARGET_TYPE',
  label: 'TARGET_TYPE',
  type: 'string',
  plugin: 'selectize',
  plugin_config: {
    valueField: 'id',
    labelField: 'id',
    maxItems: null,
    create: false,
    plugins: ['remove_button'],
    options: [{"id": "Civilian"}, {"id": "Government"}, {"id": "Law"}, {"id": "Religious"}, {"id": "Army"}, {"id": "Foreign"}, {"id": "Unknow"} ]
  }
},
{
  id: "IS_AREA",
  label: "IS_AREA",
  type: "double",
  operators: ["equal", "not_equal"],
  validation: {
    callback: function (value,  rule) {
      if (polygons_area_table['AREA_' + value] != null)
        return true;
      else {
        alert('' + value + ' is not a valid area number !!');
        return false;
      }
    }
  }
}
],

operators: [
{ type: 'equal', optgroup: 'scalar' },
{ type: 'not_equal', optgroup: 'scalar' },
{ type: 'greater', optgroup: 'scalar' },
{ type: 'less', optgroup: 'scalar' },
]

});

$('#btn-get').on('click', function() {
  var result = $('#builder-basic').queryBuilder('getRules');
  
  if (!$.isEmptyObject(result)) {
    filterMarkers(result);
  } else {
    //reset all the markers...
    filterMarkers({"condition": "AND","rules": []});
  }
});


//display the box correctly
$("#builder-basic").css("width", '80vw');
$("#builder-basic").css("overflow-x", "scroll");

//set be bg looking good...
//$(".rules-group-container").css("background", '#fff');
$("body").css("background", 'rgb(250, 240, 210)')
$(".rules-group-container").css("border", 'none');
