var express=require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');

app.get('/scrape', function (req, res) {
	url='http://www.asx.com.au/asx/research/companyInfo.do?by=asxCode&asxCode=AGK';
	request(url, function (error, response, html) {
		//First we make sure there are no errors when making the request
		if(!error) {
			//we use the cheerio library on the returned html, which essentially gives us jQuery functionality
			var $ = cheerio.load(html);
			var parsedResults = [];
			//Finally we define the variables we're going to capture
			//We use the unique header class as a starting point
			$('#company-information').filter(function () {
				// Let's store the data we filter into a variable  so we can see what's going on
				var data = $(this);
				//When examining the DOM we notice that the title rests within the first child element of the header tag.
				//Using jQuery we can navigate and get the text by writing the following code
				name = data.children().first().text();
				//console.log(name);
				});
			var companyDetails={};
			$('.contenttable.company-details tr').each(function (i, el) {
				var h = $('th', this).text(), d = $('td', this).text().trim();
				companyDetails[h]=d;
			});
			console.log(companyDetails);
			//console.log(details);
			var companyInfo = {
					name: name,
					companyDetails: companyDetails
				};
			parsedResults.push(companyInfo);
			//console.log(parsedResults);
		}
		res.set('Content-type', 'text/html');
		res.send(parsedResults);
	})
})
app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;