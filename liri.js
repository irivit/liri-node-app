require("dotenv").config();

var keys = require('./keys.js');
var request = require("request");
var Twitter = require("Twitter");
var Spotify = require("node-spotify-api");

var nodeArgs = process.argv;
var oper = process.argv[2];


var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

console.log(process.argv);

switch (oper) {
    case 'my-tweets': {
        client.get('statuses/user_timeline', { screen_name: 'iri04930287', count: 20 }, function (error, tweets, response) {

            for (i = 0; i < tweets.length; i++) {
                console.log('================')
                console.log('')
                console.log('')
                console.log(tweets[i].text); 
                console.log('')
                console.log('')
                console.log('================')
            }
        });
        break;
    }
    case 'spotify-this-song': {
        var songName = "";

        for (var i = 3; i < nodeArgs.length; i++) {
            if (i > 3 && i < nodeArgs.length) {
                songName = songName+ "+" + nodeArgs[i];
            }
            else {
                songName += nodeArgs[i];
            }
        }
        console.log('this is the name of the son:'+ songName);
        spotify.search({ type: 'track', query: songName}, function (error, song){
            console.log(error);
            if (!error) {
                console.log(song.tracks.items[0].artists[0].name);
                console.log(song.tracks.items[0].name);
                console.log(song.tracks.items[0].preview_url);
                console.log(song.tracks.items[0].album.name);
   
            }
         });
         break;
    }

    case 'movie-this': {

        var movieName = "";

        for (var i = 3; i < nodeArgs.length; i++) {
            if (i > 3 && i < nodeArgs.length) {
                movieName = movieName+ "+" + nodeArgs[i];
            }
            else {
                movieName += nodeArgs[i];
            }
        }

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        request(queryUrl, function (error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Release Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        });
        break;
    }
    case 'do-what-it-says': {

    }
}



function spotifyThisSong() {
    var song = "hello";

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "https://api.spotify.com/v1/users/" + spotify + "/playlists/" + song + "/tracks";


    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {
        console.log(body);

    });
}




