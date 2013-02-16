
/*
 * GET users listing.
 */

var needle = require("needle");

var LRU = require("lru-cache")
  , options = { max: 500
              , length: function (n) { return n.length }
              , maxAge: 1000 * 60 * 60 * 24 }
  , cache = LRU(options)

exports.list = function(req, res){

  var address = req.query['address'];

  var zip = req.query['zip'];

  query = "incident_address=" + address; 

  if (zip !== '' && zip !== undefined) {
	
	query += "&incident_zip=" + zip;
	
  }

  // get total https://nycopendata.socrata.com/resource/erm2-nwe9.json?$select=incident_address,%20count(incident_address)&$where=incident_address='385%20Union%20Avenue'&$group=incident_address

  query =  query + "&$order=created_date DESC";  


	if ( cache.get(query) === undefined ) {

		needle.get("https://nycopendata.socrata.com/resource/erm2-nwe9.json?" + query , function (error , response , body) {

			cache.set(query , body)

			res.send(body)
		
		})

	} else {
		
		res.send(cache.get(query))

	} 

};