'use strict';

/**
* @ngdoc service
* @name pandrugsdbFrontendApp.RestDatabase
* @description
* # RestDatabase
* Factory in the pandrugsdbFrontendApp.
*/
angular.module('pandrugsdbFrontendApp')
.factory('user', ['$q', '$timeout', '$filter', '$http', '$sessionStorage', '$location', 'BACKEND',
  function restDatabaseFactory($q, $timeout, $filter, $http, $sessionStorage, $location, BACKEND) {
    var currentUser = 'anonymous';

    function doLogin(login, password, onSuccess, onError) {
      $http.defaults.headers.common.Authorization = 'Basic ' + btoa(login + ':' + password);
      $http.get(BACKEND.API + 'user/' + login)
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
      $http.get(BACKEND.API + 'registration/' + token)
      .success(onSuccess).error(onError);
    }

    function doRegister(login, email, password, onSuccess, onError) {
      var encodedTemplate = encodeURIComponent($location.absUrl().substring(0, $location.absUrl().indexOf('#')) + '#/login?confirmuuid=%s');
      $http.post(BACKEND.API + 'registration/?confirmurltemplate=' + encodedTemplate,
        {'login': login, 'email': email, 'password': password})
        .success(onSuccess).error(onError);
    }

    function getComputations(onSuccess, onError) {
      if (currentUser !== 'anonymous') {
        $http.get(BACKEND.API + 'variantsanalysis/' + currentUser)
        .success(function(data) { if (onSuccess !== null) { onSuccess(data); } })
        .error(function() { if (onError !== null) { onError(); } });
      }
    }

    function submitComputation(vcfFile, computationName, onSuccess, onError) {
      var fd = new FormData();
      fd.append('vcf', vcfFile);
      $http.post(BACKEND.API + 'variantsanalysis/' + currentUser +'?name=' + computationName, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
      }).success(onSuccess).error(onError);

    }

    function deleteComputation(computationId, onSuccess, onError) {
      $http.delete(
        BACKEND.API + 'variantsanalysis/' + currentUser + '/' + computationId)
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
  }
]);
