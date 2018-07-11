require("dotenv").config();

var keys = require('./keys.js');
var request = require("request");
var Twitter = require("Twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var nodeArgs = process.argv;

var songOrMovie = "";
for (var i = 3; i < nodeArgs.length; i++) {   ///this for loop will concatenate in only one string the name of the the song or the movie if that has more than one word
    if (i > 3 && i < nodeArgs.length) {
        songOrMovie +=  "+" + nodeArgs[i];
    }
    else {
        songOrMovie += nodeArgs[i];
    }
}

var oper = process.argv[2];
var type = "track";

//Creating the instanced of the objects
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

// this switch will call the correct function depending on the choice of the user 
switch (oper) {
    case 'my-tweets': {
        tweet();
        break;
    }
    case 'spotify-this-song': {
        //if the user doesn't enter any song the system will show The Sign by default
        if (songOrMovie == "") {
            songOrMovie = "The Sign"
            spotifySong(songOrMovie, type);
        } else {
            spotifySong(songOrMovie, type); //if not will show info about the song calling the spotifySong function
        }
        break;
    }

    case 'movie-this': {
        //if the user doesn't enter any movie the system will show Mr. Nobody by default
        if (songOrMovie == "") {
            songOrMovie = "Mr. Nobody"
            movie(songOrMovie);
        } else {                  //if not will show info about the movie calling the movie function
            movie(songOrMovie);
        }
        break;
    }
    case 'do-what-it-says': {
        // in this case will read and execute a comand from the random.txt

        fs.readFile("random.txt", "utf8", function (error, data) {

            // If the code experiences any errors it will log the error to the console.
            if (error) {
                return console.log(error);
            }
            var dataArr = data.split(",");

            var action = dataArr[0];
            var movieSong = dataArr[1];
            //depending on the action readed this switch will execute a different function
            switch (action) {
                case "my-tweets": {
                    tweet();
                    break;
                }
                case "spotify-this-song": {
                    spotifySong(movieSong, type);
                    break;
                }
                case "movie-this": {
                    movie(movieSong);
                    break;
                }
            }
        });
        break;
    }
        //this function make a query to spotify api to retrieve information about a song
        function spotifySong(song, type) {

            spotify.search({ type: type, query: song }, function (error, song) {
                console.log(error);
                if (!error) {
                    console.log(song.tracks.items[0].artists[0].name);
                    console.log(song.tracks.items[0].name);
                    console.log(song.tracks.items[0].preview_url);
                    console.log(song.tracks.items[0].album.name);
                }
            });
        }

        //this function make a query to the omdb api in order to retrieve information about a specific movie
        function movie(movie) {
            var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

            request(queryUrl, function (error, response, body) {

                // If the request is successful show the information
                if (!error && response.statusCode === 200) {
                    console.log("Title: " + JSON.parse(body).Title);
                    console.log("Release Year: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);

                    // Some movies do not have rotten tomatoes, that's need to be checked
                    var ratingFilm = JSON.parse(body).Ratings.length;  //wrap in a var the length of the rating
                    for (let i = 0; i < ratingFilm; i++) { //loop the rating checking for source = rotten tomatoes
                        if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
                            console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[i].Value);  //if the movie has a value it's shown
                        } else {
                            console.log("Rotten Tomatoes: N/A"); //if not show N/A as value of the rotten tomatoes
                        }
                    }
                    console.log("Country: " + JSON.parse(body).Country);
                    console.log("Language: " + JSON.parse(body).Language);
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("Actors: " + JSON.parse(body).Actors);
                }
            });
        }

        // this function make a request to the Twitter api with a user_name and and "number" and return the last "number" of tweets of the user.
        function tweet() {
            client.get('statuses/user_timeline', { screen_name: 'iri04930287', count: 20 }, function (error, tweets, response) {

                for (i = 0; i < tweets.length; i++) {
                    console.log('================')
                    console.log('')
                    console.log(tweets[i].text);
                    console.log('')
                    console.log('================')
                }
            });
        }
}

