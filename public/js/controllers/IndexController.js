app.controller('IndexController', ['$scope', '$http', 'User', '$window', function($scope, $http, User, $window) {

  $scope.user = User;

  $http.get("/loggedin")
  .success(function (data) {
    if (data.isLoggedIn) {
      User.isLoggedIn = data.isLoggedIn;
      User.email = data.email;
      $scope.user = User;
    }
  })
  .error(function (err) {
    console.log('Error: ' + err);
  });

  $scope.logout = function() {
    $http.get("/logout");
    User.isLoggedIn = false;
    User.email = undefined;
  }

  // get latitude and longitude and store to User global obj
  var options = {enableHighAccuracy:true}

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
  }

  function onSuccess(position) {
    var lon = position.coords.longitude;
    var lat = position.coords.latitude;
    User.position = {'lon' : lon, 'lat' : lat};
    $http.get("/api/yelp/" + User.position.lat + "/" + User.position.lon)
    .success(function (data) {
      console.log(data);
      $scope.bars = data.businesses;
    })
    .error(function (err) {
      console.log('Error: ' + err);
    });
  }

  function onError() {
    alert("Geolocation is not supported by this browser.");
  }

  $scope.barSignUp = function(bar) {
    if (User.email == undefined) {
      window.location.href = '/login';
    }
    else {
      // sign the user up to the bar
      $http.post("/api/bar", bar)
      .success(function (data, status) {
        console.log('Bar entry created and user attendance registered.');
      })
      .error(function (data) {
        console.log('Error: ' + data);
      });
    }

  }



/*
- get all bars in the zone
  - show all bars in the zone
- if user online -> check if user going to a bar
  - update view based on step above
- get all bars with attendants
  - update view based on step above
*/


}]);
