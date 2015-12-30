app.controller('IndexController', ['$scope', '$http', 'User', '$window', function($scope, $http, User, $window) {

  $scope.user = User;
  var bars = [];

  /*
  - get all bars in the zone DONE
  - show all bars in the zone DONE
  - check if user going in a bar
  - update view based on step above
  - get all bars with attendants
  - update view based on step above
  */

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

  // if geolocation successfull call yelp api and show result
  function onSuccess(position) {
    var lon = position.coords.longitude;
    var lat = position.coords.latitude;
    User.position = {'lon' : lon, 'lat' : lat};
    // call to yelp api
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
    // if user is logged out redirect to login
    if (User.email == undefined) {
      window.location.href = '/login';
    }
    else {
      bars.push(bar.id);
      // sign the user up to the bar

      // add bar to user bars in DB
      $http.post("/api/user/" + User.email + "/" + bars)
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
}
}]);
