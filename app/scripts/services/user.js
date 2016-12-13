'use strict';

/**
* @ngdoc service
* @name pandrugsdbFrontendApp.RestDatabase
* @description
* # RestDatabase
* Factory in the pandrugsdbFrontendApp.
*/
angular.module('pandrugsdbFrontendApp')
.factory('user', ['$q', '$timeout', '$filter', '$http', '$sessionStorage', '$location',
  function restDatabaseFactory($q, $timeout, $filter, $http, $sessionStorage, $location) {
  // Service logic
  // ...
  var SERVER = 'http://sing.ei.uvigo.es'; // production
  //var SERVER = 'http://localhost:8080'; // development: local backend;
  //var SERVER = 'http://0.0.0.0:9000'; // development: via grunt reverse proxy to local backend
  //var SERVER = ''; // the server is in this machine (e.g.: docker distribution)
  var currentUser = 'anonymous';

  function doLogin(login, password, onSuccess, onError) {
    $http.defaults.headers.common.Authorization = 'Basic '+btoa(login+':'+password);
    $http.get(SERVER + '/pandrugsdb-backend/api/user/' + login)
    .success(function() {
      $sessionStorage.user = login;
      $sessionStorage.password = password;
      currentUser = login;
      if (onSuccess !== null) {
        onSuccess();
      }
    }).error(function() {
      doLogout();
      if (onError !== null) {
        onError();
      }
    });
  }

  function doLogout() {
    currentUser = 'anonymous';
    delete $sessionStorage.user;
    delete $sessionStorage.password;
  }

  function doConfirm(token, onSuccess, onError) {
    $http.get(SERVER + '/pandrugsdb-backend/public/registration/' + token)
    .success(onSuccess).error(onError);
  }

  function doRegister(login, email, password, onSuccess, onError) {
    var encodedTemplate = encodeURIComponent($location.absUrl().substring(0, $location.absUrl().indexOf('#'))+'#/login?confirmuuid=%s');
    $http.post(SERVER + '/pandrugsdb-backend/public/registration/?confirmurltemplate=' + encodedTemplate,
    {'login': login, 'email': email, 'password':password})
    .success(onSuccess).error(onError);
  }

  function getComputations(onSuccess, onError) {
    if (currentUser !== 'anonymous') {
      $http.get(SERVER + '/pandrugsdb-backend/api/variantsanalysis/' + currentUser)
      .success(function(data) { if (onSuccess !== null) { onSuccess(data); } })
      .error(function() { if (onError !== null) { onError(); } });
    }
  }

  function submitComputation(vcfFile, computationName, onSuccess, onError) {
    var fd = new FormData();
    fd.append('vcf', vcfFile);
    $http.post(SERVER + '/pandrugsdb-backend/api/variantsanalysis/' + currentUser +'?name='+computationName, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    }).success(onSuccess).error(onError);

  }

  function deleteComputation(computationId, onSuccess, onError) {
    $http.delete(
      SERVER + '/pandrugsdb-backend/api/variantsanalysis/' + currentUser + '/' + computationId)
    .success(onSuccess).error(onError);
  }

  if ('user' in $sessionStorage) {
    doLogin($sessionStorage.user, $sessionStorage.password, null, null);
  }


  // Public API here
  return {
    getCurrentUser: function() {
      return currentUser;
    },
    register: doRegister,
    login: doLogin,
    logout: doLogout,
    confirm: doConfirm,
    getComputations: getComputations,
    submitComputation: submitComputation,
    deleteComputation: deleteComputation
  };
}]);
