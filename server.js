var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var brewery = require("./Brewery.js");
const request = require('request');

// //app.use(express.static(__dirname + "/public"));
// app.get('/', function(req, res) {
//   //console.log("Hello from server!");
//   //вот тут уже нужно подгружать инфу о пиварнях
//   var b = new brewery.Brewery(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);
//   console.log(b);
//   //b.getFullAddress();
// });

app.get("*", function(req, res) {
  //console.log("Hello from server!");
  //вот тут уже нужно подгружать инфу о пиварнях
  //var b = new brewery.Brewery(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1);
  //b.getFullAddress();
  //console.log(b);
  //b.getFullAddress();

  var outputFile;

    request('https://api.openbrewerydb.org/breweries', { json: true }, (err, response, body) => {
      if (err) { return console.log(err); }
      var breweriesJSON = JSON.parse(JSON.stringify(body));
      var breweries = [];

      for(var i=0; i < breweriesJSON.length; i++){
        //breweries[i] = new brewery.Brewery(JSON.parse(JSON.stringify(breweries[i])));
        var jsonObject = JSON.parse(JSON.stringify(breweriesJSON[i]));
        jsonObject.__proto__ = brewery.Brewery.prototype;
        breweries.push(jsonObject);
        //console.log(jsonObject.getFullAddress());
      };

      var resultString = '<style>h5 {padding-left: 30px;}</style>';

      var states = [];
      var dict = [];

      // dict["lalala"] = ["1","2","3","4"]

      for(var i = 0; i < breweries.length; i++){
        if (states.includes(breweries[i].state)){
          continue;
        }
        else{
            states.push(breweries[i].state);
        }
      }

      for(var j = 0; j < states.length; j++){
        var tempAddrs = [];
        for(var i = 0; i < breweries.length; i++){
          if(breweries[i].state == states[j]){
            tempAddrs.push(breweries[i].getFullAddress());
          }
        }
        dict[states[j]] = tempAddrs;
      }

      for(var i = 0; i < states.length; i++){
        resultString += "<h4>"+states[i]+"</h4>";
        var tempArray = dict[states[i]];
        for(var j = 0; j < tempArray.length; j++) {
          resultString += '<h5>'+tempArray[j]+'</h5>';
        }
      }

      var table = '<table><tr><th>Id</th><th>Name</th><th>Full address</th><th>Phone</th><th>Website URL</th></tr>';

      for(var i = 0; i < breweries.length; i++){
        if(breweries[i].type == 'micro'){
          continue;
        }else{
          table += '<tr><th>' + breweries[i].id + '</th><th>' + breweries[i].name +'</th><th>' + breweries[i].getFullAddress() + '</th><th>' +
           breweries[i].phone + '</th><th>' + breweries[i].website_url +'</th>' + '</tr>';
        }

      }
      table += "</table>";



      res.send(resultString + table);
    });


  //res.send(b);
});

app.listen(3000, function(){
  console.log("Server is running...");
});
