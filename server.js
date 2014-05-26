var express=require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');

app.get('/scrape', function (req, res) {
	url='http://www.imdb.com/title/tt0302886/';
	request(url, function (error, response, html) {
		//First we make sure there are no errors when making the request
		if(!error) {
			//we use the cheerio library on the returned html, which essentially gives us jQuery functionality
			var $ = cheerio.load(html);
			var parsedResults = [];
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
				release=data.children().last().children().text();
				
				});
			$('.star-box.giga-star').filter(function () {
				var data = $(this);
				rating = data.children().first().text();
				
			});
			var MovieInfo = {
					title: title,
					release: release,
					rating: rating
				};
			parsedResults.push(MovieInfo);
			console.log(parsedResults);

		}
		res.set('Content-type', 'text/html');
		res.send(parsedResults);
	})

})
app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;