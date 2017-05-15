google.charts.load('current', {packages: ['corechart', 'bar']});
google.charts.setOnLoadCallback(timeChart);



function refresh_piechart() {
  var f1 = document.getElementById("field1");
  var f2 = document.getElementById("field2");
  var f1Val = f1.options[f1.selectedIndex].value;
  var f2Val = f2.options[f2.selectedIndex].value;

  //does not have the same value
  if (f1Val==f2Val) {return;}
  
  var stats_on_visible_marker = getCount(f1Val, f2Val, get_visible_markers());
  drawChart(stats_on_visible_marker,f1Val,f2Val);
}

function listeTime(m) {
  var liste = [];
  for (var i = 0; i < m.length; i++) {
     if (m[i].type_attack=='blast'){
              liste.push([utcformat(parseInt(m[i].timestamp)*1000),parseInt(m[i].nb_killed),0]);
            }
            else{
              liste.push([utcformat(parseInt(m[i].timestamp)*1000),0,parseInt(m[i].nb_killed)]);
            }
          }
  
  return [["Date","blast attack","drone attack"]].concat(liste)
}

function timeChart() {
        var da = get_visible_markers();
        

        var data = google.visualization.arrayToDataTable(listeTime(da));

        var options = {
          title: 'Company Performance',
          curveType: 'function',
          legend: { position: 'right' },
          height: parseInt($("#div4").css("height")),
          width: parseInt($("#div4").css("width")),
          explorer: { 
              actions: ['dragToZoom', 'rightClickToReset'],
              axis: ['horizontal', 'vertical'],
              keepInBounds: true,
              maxZoomIn: 4.0
          }
        };

        var chart = new google.visualization.LineChart(document.getElementById('chartTime'));

        chart.draw(data, options);
      }

function refresh_day() {
  var f3 = document.getElementById("field3");
  var f3Val = f3.options[f3.selectedIndex].value;
  var fDay = "day";

  var ma = get_visible_markers();
  var data = google.visualization.arrayToDataTable([
        ['Day', 'Drone Attacks', 'Blast Suicide Attacks'],
        ['Mo', ma.map(function(m) { return (m.type_attack == "drone" && parseInt(m[f3Val]) > 0 && m.day == "Monday") ? 1 : 0}).reduce(add, 0), ma.map(function(m) { return (m.type_attack == "blast" && parseInt(m[f3Val]) > 0 && m.day == "Monday") ? 1 : 0}).reduce(add, 0)],
        ['Tu', ma.map(function(m) { return (m.type_attack == "drone" && parseInt(m[f3Val]) > 0 && m.day == "Tuesday") ? 1 : 0}).reduce(add, 0), ma.map(function(m) { return (m.type_attack == "blast" && parseInt(m[f3Val]) > 0 && m.day == "Tuesday") ? 1 : 0}).reduce(add, 0)],
        ['We', ma.map(function(m) { return (m.type_attack == "drone" && parseInt(m[f3Val]) > 0 && m.day == "Wednesday") ? 1 : 0}).reduce(add, 0), ma.map(function(m) { return (m.type_attack == "blast" && parseInt(m[f3Val]) > 0 && m.day == "Wednesday") ? 1 : 0}).reduce(add, 0)],
        ['Th', ma.map(function(m) { return (m.type_attack == "drone" && parseInt(m[f3Val]) > 0 && m.day == "Thursday") ? 1 : 0}).reduce(add, 0), ma.map(function(m) { return (m.type_attack == "blast" && parseInt(m[f3Val]) > 0 && m.day == "Thursday") ? 1 : 0}).reduce(add, 0)],
        ['Fr', ma.map(function(m) { return (m.type_attack == "drone" && parseInt(m[f3Val]) > 0 && m.day == "Friday") ? 1 : 0}).reduce(add, 0), ma.map(function(m) { return (m.type_attack == "blast" && parseInt(m[f3Val]) > 0 && m.day == "Friday") ? 1 : 0}).reduce(add, 0)],
        ['Sa', ma.map(function(m) { return (m.type_attack == "drone" && parseInt(m[f3Val]) > 0 && m.day == "Saturday") ? 1 : 0}).reduce(add, 0), ma.map(function(m) { return (m.type_attack == "blast" && parseInt(m[f3Val]) > 0 && m.day == "Saturday") ? 1 : 0}).reduce(add, 0)],
        ['Su', ma.map(function(m) { return (m.type_attack == "drone" && parseInt(m[f3Val]) > 0 && m.day == "Sunday") ? 1 : 0}).reduce(add, 0), ma.map(function(m) { return (m.type_attack == "blast" && parseInt(m[f3Val]) > 0 && m.day == "Sunday") ? 1 : 0}).reduce(add, 0)],
      ]);

  var materialOptions = {
        chart: {
          title: ' Attack by day of the week'
        },
        hAxis: {
          title: 'Total Population',
          minValue: 0,
        },
        vAxis: {
          title: 'City'
        },
        bars: 'vertical',
        legend: {
            position: 'none'
        },
        height: parseInt($("#div2").css("height")) - 50,
        width: parseInt($("#div2").css("width"))
      };

      var materialChart = new google.charts.Bar(document.getElementById('week-div'));
      materialChart.draw(data, materialOptions);

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


function add(a, b) {
  return a + b;
}

function ville_list(m) {
    li =[];
    for (var i=0;i<m.length;i++){
        if (li.indexOf(m[i].City)==-1){
            li.push(m[i].City);
        }
    }
    return li;
  }

function Bubble_city() {
  var ma = get_visible_markers();
  list_ville = ville_list(ma);
  data_ville = [['CITY', 'civil killed', 'civil injured','killed by terrorist','people killed by drone','terrorist killed']];
  for (var i =0; i<ma.length; i++){
        if (data_ville[list_ville.indexOf(ma[i].City)+1] == undefined ) {
        data_ville[list_ville.indexOf(ma[i].City)+1] = [ma[i].City,0,0,0,0,0]; }
        if (ma[i].type_attack=="drone"){
            data_ville[list_ville.indexOf(ma[i].City)+1][4] += parseInt(ma[i].nb_killed) + parseInt(ma[i].nb_injured);}
        if (ma[i].type_attack=="blast"){
            data_ville[list_ville.indexOf(ma[i].City)+1][3] += parseInt(ma[i].nb_killed);}

        data_ville[list_ville.indexOf(ma[i].City)+1][1] += parseInt(ma[i].nb_killed) ;      
        data_ville[list_ville.indexOf(ma[i].City)+1][2] += parseInt(ma[i].nb_injured);
        data_ville[list_ville.indexOf(ma[i].City)+1][5] += parseInt(ma[i].nb_terro);
  }
  var data = google.visualization.arrayToDataTable(data_ville);

  var options = {

    title: 'Correlation of people killed by terrorist with people killed by drone' +
           ' sorted by city',
    hAxis: {title: 'civil killed or injured by drone'},
    vAxis: {title: 'civil killed or injured by terrorist'},
    bubble: {textStyle: {fontSize: 11}},
    explorer: { actions: ['dragToZoom', 'rightClickToReset']},
    colorAxis: {colors: ['yellow', 'red']},
    tooltip : {
        trigger: 'none'
    },
    height: parseInt($("#div1").css("height")),
    width: parseInt($("#div1").css("width"))
  };

var chart = new google.visualization.BubbleChart(document.getElementById('bubbleCity'));
  chart.draw(data, options);
}


function refresh_graphs() {
    Bubble_city();
    refresh_piechart();
    refresh_day();
    timeChart();
} 