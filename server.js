var express=require('express');
var app = express();
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

app.get('/scrape', function (req, res) {
	url='http://www.imdb.com/title/tt1723121/';
	request(url, function (error, response, html) {
		//First we make sure there are no errors when making the request
		if(!error) {
			//we use the cheerio library on the returned html, which essentially gives us jQuery functionality
			var $ = cheerio.load(html);
			//Finally we define the variables we're going to capture
			var title, release, rating;
			var json = {title: "", release: "", rating: ""};
			//We use the unique header class as a starting point
			$('.header').filter(function () {
				// Let's store the data we filter into a variable  so we can see what's going on
				var data = $(this);
				//When examining the DOM we notice that the title rests within the first child element of the header tag.
				//Using jQuery we can navigate and get the text by writing the following code
				title = data.children().first().text();
				json.title=title;
				
				release=data.children().last().children().text();
				json.release=release;
						});
			$('.star-box.giga-star').filter(function () {
				var data = $(this);
				rating = data.children().first().text();
				json.rating=rating;
			});

		}
		fs.writeFile('output.json', JSON.stringify(json, null, 4), function (err) {
			console.log('File successfully written! Check project directory');
		})
		res.send(JSON.stringify(json, null, 4));
	})

})
app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;