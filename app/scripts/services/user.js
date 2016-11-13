'use strict';

/**
* @ngdoc service
* @name pandrugsdbFrontendApp.RestDatabase
* @description
* # RestDatabase
* Factory in the pandrugsdbFrontendApp.
*/
angular.module('pandrugsdbFrontendApp')
.factory('user', ['$q', '$timeout', '$filter', '$http', function restDatabaseFactory($q, $timeout, $filter, $http) {
  // Service logic
  // ...
  //var SERVER = 'http://sing.ei.uvigo.es'; // production
  //var SERVER = 'http://localhost:8080'; // development: local backend;
  var SERVER = 'http://0.0.0.0:9000'; // development: via grunt reverse proxy to local backend


  var currentUser = "anonymous";

  function doLogin(login, password, onSuccess, onError) {
    $http.defaults.headers.common.Authorization = 'Basic '+btoa(login+':'+password);
    $http.get(SERVER + '/pandrugsdb-backend/api/user/' + login)
    .success(function() {
      sessionStorage.setItem('user', login);
      sessionStorage.setItem('password', password);
      currentUser = login;
      if (onSuccess !== null) onSuccess();
    }).error(function() {
      doLogout();
      if (onError !== null) onError();
    });
  }

  function doLogout() {
    currentUser = "anonymous";
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('password');
  }

  if (sessionStorage.getItem('user') !== null) {
    doLogin(sessionStorage.getItem('user'), sessionStorage.getItem('password'), null, null);
  }


  // Public API here
  return {
    getCurrentUser: function() {
      return currentUser;
    },
    login: doLogin,
    logout: doLogout
  };
}]);
