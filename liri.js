require("dotenv").config();

var keys = require('./keys.js');
var request = require("request");
var Twitter = require("Twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var nodeArgs = process.argv;
var oper = process.argv[2];


var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

console.log(process.argv);

switch (oper) {
    case 'my-tweets': {
        tweet();
        break;
    }
    case 'spotify-this-song': {
        var songName = "";
        for (var i = 3; i < nodeArgs.length; i++) {
            if (i > 3 && i < nodeArgs.length) {
                songName = songName + "+" + nodeArgs[i]; 
            }
            else {
                songName += nodeArgs[i];
            }
        }
        if (songName == "") {
            songName = "The Sign"
            spotifySong(songName);
        } else {
            spotifySong(songName);
        }
        break;
    }

    case 'movie-this': {

        var movieName = "";

        for (var i = 3; i < nodeArgs.length; i++) {
            if (i > 3 && i < nodeArgs.length) {
                movieName = movieName + "+" + nodeArgs[i];
            }
            else {
                movieName += nodeArgs[i];
            }
        }
        if (movieName == "") {
            movieName = "Mr. Nobody"
            movie(movieName);
        } else {
            movie(movieName);
        }
        break;
    }
    case 'do-what-it-says': {
        fs.readFile("random.txt", "utf8", function (error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }
            // Then split it by commas (to make it more readable)
            console.log(data);
            var dataArr = data.split(",");

            // We will then re-display the content as an array for later use.
            console.log(dataArr);

            var action = dataArr[0];
            var movieSong = dataArr[1];  

            console.log(action);
            console.log(movieSong);

            switch (action) {
                case "my-tweets": {
                    tweet();
                    break;
                }
                case "spotify-this-song": {
                    // var comand = dataArr[1];
                    // var comandReplace = replaceName(comand);
                    // console.log("this is comand " + comandReplace);
                    spotifySong(dataArr[1]);
                    break;
                }
                case "movie-this": {
                    // var comandReplace = replaceName(comand);
                    // console.log("this is comand " + comandReplace);
                    movie(dataArr[1]);
                    break;
                }
            }
        });
        break;
    }

        function spotifySong(song) {

            spotify.search({ type: 'track', query: songName }, function (error, song) {
                console.log(error);
                if (!error) {
                    console.log(song.tracks.items[0].artists[0].name);
                    console.log(song.tracks.items[0].name);
                    console.log(song.tracks.items[0].preview_url);
                    console.log(song.tracks.items[0].album.name);
                }
            });
        }

        function movie(movie) {
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
        }

        function tweet() {
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
        }


        function replaceName(e) {
            var son = e.replace(/ /g, "+");
            return son;
        }
}

