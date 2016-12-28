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

    function getComputation(userName, computationId, onSuccess, onError) {
      var headers = {};
      if (userName === 'guest') {
        headers.Authorization = 'Basic ' + btoa('guest:guest');
      }

      $http.get(BACKEND.API + 'variantsanalysis/' + userName + '/' + computationId, {headers:headers})
      .success(function(data) { if (onSuccess !== null) { onSuccess(data); } })
      .error(function() { if (onError !== null) { onError(); } });

    }

    function submitComputation(vcfFile, computationName, onSuccess, onError) {
      //var fd = new FormData();
      //fd.append('vcf', vcfFile);


      var headers = {'Content-Type': undefined};

      var requestUser = currentUser;
      if (currentUser === 'anonymous') {
        headers.Authorization = 'Basic ' + btoa('guest:guest');
        requestUser = 'guest';
      }

      var reader = new FileReader();
      reader.onload = function(e) {
        var fileContents = reader.result;
        $http.post(BACKEND.API + 'variantsanalysis/' + requestUser +'?name=' + computationName, fileContents, {
            transformRequest: angular.identity,
            headers: headers
        }).success(function(data, status, headers, config) {
          var newId = headers('Location').substring(headers('Location').lastIndexOf('/') + 1 );
          onSuccess(newId);
        }).error(onError);
      }
      reader.readAsText(vcfFile);



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
      getComputation: getComputation,
      submitComputation: submitComputation,
      deleteComputation: deleteComputation
    };
  }
]);
