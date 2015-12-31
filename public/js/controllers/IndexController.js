app.controller('IndexController', ['$scope', '$http', 'User', '$window', function($scope, $http, User, $window) {

  /*
  USER STORY 1
  - User gets to web page DONE
  - User sees list of bars in his zone DONE
  - User can search for bars in a different zone DONE
  - When user tries to attend a bar he's redirected to login page DONE

  USER STORY 2
  - user logs in DONE
  - user sees on the top the list of bars where he's going with the SignOut button TODO
  - user sees on the bottom the list of bars in his zone with the SignUp button DONE
  - user can also search for bars in a differnt zone TODO

  USER STORY 3
  - when user clicks on the SignUp button of a bar:
  - if bar is not there, bar is added to the user.bars list of bars where the users is attending
  - the user.bars list is updated in the DB
  - if bar is in DB, the counter of attendants goes +1
  - else the bar is added to the DB with counter at 1
  - client is updated the SignUp button becomes a SignOut button and the number of attendants goes +1

  USER STORY 4
  - when user clicks on teh SignOut button of a bar:
  - bar is removed from the user.bars list
  - the user.bars list is updated in the DB
  - lower counter of attendants for the entry of the bar in the DB by -1
  - client is updated and the SignOut button becomes a SignUp button and the number of attendants goes -1
  */

  // initialize variables
  $scope.searchString = "";

  // check if user is loggedin and store user information
  $http.get("/loggedin")
  .success(function (data) {
    if (data) {
      User = data;
      $scope.user = User;
    }
    /*
    if (data.isLoggedIn) {
    console.log(data);
    User.isLoggedIn = data.isLoggedIn;
    User.email = data.email;
    $scope.user = User
    userBars = data.bars;
    console.log(userBars)
  }
  */
})
.error(function (err) {
  console.log('Error: ' + err);
});

// get latitude and longitude and store to User global obj
var options = {enableHighAccuracy:true}
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}

// if geolocation successfull call yelp api and show result
function onSuccess(position) {
  // call to yelp api using user's current location
  $http.get("/api/yelp/" + position.coords.latitude + "/" + position.coords.longitude)
  .success(function (data) {
    console.log(data);
    $scope.bars = data.businesses;
    // check if user is going to one of these bars
    /*
    for (var i = 0; i < $scope.bars.length; i++) {
    for (var x = 0; x < userBars.length; x++) {
    if (userBars[x] == $scope.bars[i].id) {
    // and set corresponding button visibility
    $scope.bars[i].userIsAttending = true;
  }
  else {
  $scope.bars[i].userIsAttending = false;
}
}
}
*/
})
.error(function (err) {
  console.log('Error: ' + err);
});
}

// if geolocation gives error
function onError() {
  alert("Geolocation is not supported by this browser.");
}

// manage user signing up to a bar
$scope.barSignUp = function(bar) {
  /*
  // if user is logged out redirect to login
  if (User.email == undefined) {
  window.location.href = '/login';
}
else {
userBars.push(bar.id);
// sign the user up to the bar
console.log(userBars)

// add bar to user bars in DB
$http.post("/api/user/" + User.email + "/" + userBars)
.success(function (data, status) {
console.log('User bars list updated.');
})
.error(function (data) {
console.log('Error: ' + data);
});

// if bar already exist in DB, update its attendants


// else create bar in the DB
/**
$http.post("/api/bar", bar)
.success(function (data, status) {
console.log('Bar entry created and user attendance registered.');
})
.error(function (data) {
console.log('Error: ' + data);
});
*/
}

$scope.search = function(searchString) {
  console.log(searchString);
  // call to yelp api using user's current location
  $http.get("/api/yelp/" + searchString)
  .success(function (data) {
    console.log(data);
    $scope.bars = data.businesses;
  })
  .error(function (err) {
    console.log('Error: ' + err);
  });
}

$scope.logout = function() {
  $http.get("/logout");
  User = {};
  $scope.user = User;
}


}]);
