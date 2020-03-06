var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var brewery = require("./Brewery.js");
const request = require('request');

function getStates(breweries){
  var states = [];
  for(var i = 0; i < breweries.length; i++){
    if (states.includes(breweries[i].state)){
      continue;
    }
    else{
        states.push(breweries[i].state);
    }
  }
  return states;
}

function getDict(states, breweries){
  var dict = [];
  for(var j = 0; j < states.length; j++){
    var tempAddrs = [];
    for(var i = 0; i < breweries.length; i++){
      if(breweries[i].state == states[j]){
        tempAddrs.push(breweries[i].getFullAddress());
      }
    }
    dict[states[j]] = tempAddrs;
  }
  return dict;
}

function createStateBlocks(states, dict){
  var resultString = "";
  for(var i = 0; i < states.length; i++){
    resultString += "<div class='form-group'>"
    resultString += "<h4>"+states[i]+"</h4>";
    var tempArray = dict[states[i]];
    for(var j = 0; j < tempArray.length; j++) {
      resultString += '<h5>'+tempArray[j]+'</h5>';
    }
    resultString += "</div>";
  }
  return resultString;
}

function createTable(breweries){
  var table = '<table class="table table-condensed table-striped table-bordered"><tr><th>Id</th><th>Name</th><th>Full address</th><th>Phone</th><th>Website URL</th></tr>';
  for(var i = 0; i < breweries.length; i++){
    if(breweries[i].type == 'micro'){
      continue;
    }else{
      table += '<tr><th>' + breweries[i].id + '</th><th>' + breweries[i].name +'</th><th>' + breweries[i].getFullAddress() + '</th><th>' +
       breweries[i].phone + '</th><th>' + breweries[i].website_url +'</th>' + '</tr>';
    }

  }
  table += "</table>";
  return table;
}

function getStyles(){
  var styles = '<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet">' +
               '<style>h5 {padding-left: 30px;}</style>';
  return styles;
}

app.get("*", function(req, res) {
    request('https://api.openbrewerydb.org/breweries', { json: true }, (err, response, body) => {
      if (err) { res.send(err); }
      var breweriesJSON = JSON.parse(JSON.stringify(body));
      var breweries = [];

      for(var i=0; i < breweriesJSON.length; i++){
        var jsonObject = JSON.parse(JSON.stringify(breweriesJSON[i]));
        jsonObject.__proto__ = brewery.Brewery.prototype;
        breweries.push(jsonObject);
      };

      var resultString = getStyles();
      var states = getStates(breweries);
      var dict = getDict(states, breweries);
      resultString += createStateBlocks(states, dict);
      var table = createTable(breweries);

      res.send(resultString + table);
    });
});

app.listen(3000, function(){
  console.log("Server is running...");
});
