function refresh(value) {
  var f1 = document.getElementById("field1");
  var f2 = document.getElementById("field2");
  var f1Val = f1.options[f1.selectedIndex].value;
  var f2Val = f2.options[f2.selectedIndex].value;

  //does not have the same value
  if (f1Val==f2Val) {return;}
  
  var stats_on_visible_marker = getMyStats(f1Val,f2Val);
  drawChart(stats_on_visible_marker,f1Val,f2Val);
}

function getCount(attName, countAttName, markers) {
  var ht = [];

  for (var i = 0; i < markers.length; i++) {
    var t = parseInt(markers[i][countAttName]);
    var ht_val = ht[markers[i][attName]];
    ht_val = ((ht_val == '' + NaN) || (ht_val == null) ? 0 : ht_val);
    ht[markers[i][attName]] = ht_val + (t == '' + NaN ? 0 : t);
  }

  var k = [];
  for(var i=0; i<markers.length; i++) {
    if (k.indexOf(markers[i][attName]) == -1) {
      k.push(markers[i][attName]);
    }
  }

  out = [[attName,countAttName]];

  for (var i = 0; i<k.length; i++) {
    out.push([k[i],ht[k[i]]]);
  }
  
  return out;
}

function getMyStats(f1,f2) {
  return getCount(f1, f2, get_visible_markers());
}

function drawChart(array,f1,f2) {
  var data = google.visualization.arrayToDataTable(array);

  var options = {
    title: f1 + ' by nb ' + f2,
    pieSliceText: 'label',
    sliceVisibilityThreshold: .01,
    height: parseInt($("#div2").css("height")) - 50,
    width: parseInt($("#div2").css("width"))
  };
  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}