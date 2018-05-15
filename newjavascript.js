var queryItem;
var location;
var map;
var center;
var place;
var results = null;
var i = 0;
var status;
var pagination;

$( "[name='queryItem']" ).click(function() {
  queryItem = this.id;
});

$( "[name='searchButton']" ).click(function() {
    if(queryItem == "eat"){
        i = 0;
        getLocation();
    } else if(queryItem == "read"){
        getBook();
    } else if(queryItem == "do"){
        
    } else if(queryItem =="watch"){
        
    }
});


$("[name='nobutton']").click(function() {
    if(queryItem == "eat"){
        getLocation();
    } else if(queryItem == "read"){
        getBook();
    } else if(queryItem == "do"){
        
    } else if(queryItem =="watch"){
        
    }    
});

function getLocation() {
    navigator.geolocation.getCurrentPosition
    (onLocationSuccess, onLocationError, { enableHighAccuracy: true });
}

var onLocationSuccess = function (position) {
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;
    getFood(Latitude, Longitude);
}


function getFood(Latitude, Longitude){
    $('#modalBody').html('');
    $('#modalTitle').html('');

    /* create location and create a service*/
    center = new google.maps.LatLng(Latitude, Longitude);
    map = new google.maps.Map(document.getElementById('map'), 
    {center: center, zoom: 13});
    var service = new google.maps.places.PlacesService(map);
    alert('i: ' + i);

    if(results == null || i == 5) {
        var request;
        if(results == null) {
            alert('results null');
            request = {
                location: center,
                radius: 10000,
                type: ['restaurant'],
                openNow: true,
            } 
        } else if(i == 5) {
            /* need to get next page of results */
            var next_page = pagination.nextPage();
            request = {
                location: center,
                radius: 10000,
                type: ['restaurant'],
                openNow: true,
                pagetoken: next_page
            }       
        } 
        i = 0;
        service.nearbySearch(request, function (resultss, statuss, paginationn) {
           results = resultss;
           status = statuss;
           pagination = paginationn;
           if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
            var place = results[i];
            var appendedString = '';
            //get place details
            request = {
                placeId: place.place_id
            };
            service.getDetails(request, function (placeDetails, statuss) {
                status = statuss;
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    //markup to display place details
                    appendedString += '<div>Address: ' + placeDetails.formatted_address + '</div>'; //address
                    appendedString += '<div><a href="' + placeDetails.url + '">Reviews, directions, and more</a><div>';
                    appendedString += '<div><a href="' + placeDetails.website + '">Company Website</a></div>';
                    $('#modalBody').append(appendedString);
                    //display results in modal body
                    $('#modalTitle').html(place.name);
                    $('#searchResultDisplay').modal('show');
                    i++;
                }
            });

           } else {
               alert('bad call');
           }

        });
    } else {
      console.log(results[i]);
      var place = results[i];
      var appendedString = '';
      //get place details
      var request = {
          placeId: place.place_id
      };
      service.getDetails(request, function (placeDetails, statuss) {
          status = statuss;
          if (status == google.maps.places.PlacesServiceStatus.OK) {

              //markup to display place details
              appendedString += '<div>Address: ' + placeDetails.formatted_address + '</div>'; //address
              appendedString += '<div><a href="' + placeDetails.url + '">Reviews, directions, and more</a><div>';
              appendedString += '<div><a href="' + placeDetails.website + '">Company Website</a></div>';
              $('#modalBody').append(appendedString);
              //display results in modal body
              $('#modalTitle').html(place.name);
              $('#searchResultDisplay').modal('show');
              i++;
          } else {
              alert('noo');
          }
      });      

    }
}




function onLocationError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}



function getBook(){
    $('#modalBody').html('');
    $('#modalTitle').html('');
        
    var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var book_json = JSON.parse(this.responseText);
                console.log(book_json);
                if(book_json.book.title[0] == null ||
                   book_json.book.authors.author.name == null){
                    //book didn't have a title or something
                    getBook();
                } else {
                    var bookString = '<div>Author: ' + 
                            book_json.book.authors.author.name + '</div>';
                    if(book_json.book.description[0] != null){
                        bookString += '<div>Description: ' + 
                                book_json.book.description + '</div>';
                    }
                    bookString += '<img src="' + 
                            book_json.book.image_url + '" />';
                    //display results in modal body
                    $('#modalTitle').html(book_json.book.title + ' by ' +
                            book_json.book.authors.author.name);
                    $('#modalBody').append(bookString);
                    $('#searchResultDisplay').modal('show');
                }
            }
        };
        xmlhttp.open("GET", "/gimmeapp/books.php", true);
        xmlhttp.send();
}