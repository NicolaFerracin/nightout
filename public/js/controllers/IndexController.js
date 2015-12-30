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
    })
    .error(function (err) {
      console.log('Error: ' + err);
    });
  }

  function onError() {
    alert("Geolocation is not supported by this browser.");
  }






}]);
