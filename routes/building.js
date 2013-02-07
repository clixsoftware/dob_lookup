
/*
 * GET users listing.
 */

var needle = require("needle");

exports.list = function(req, res){

  var address = req.query['address']

  // get total https://nycopendata.socrata.com/resource/erm2-nwe9.json?$select=incident_address,%20count(incident_address)&$where=incident_address='385%20Union%20Avenue'&$group=incident_address

  query = "incident_address=" + address + "&$order=created_date DESC";  

  needle.get("https://nycopendata.socrata.com/resource/erm2-nwe9.json?" + query , function (error , response , body) {
	
	res.send(body)
	
	
  })
  

};