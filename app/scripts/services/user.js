/*
 * PanDrugs Frontend
 *
 * Copyright (C) 2015 - 2017 Fátima Al-Shahrour, Elena Piñeiro,
 * Daniel Glez-Peña and Miguel Reboiro-Jato
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 */
'use strict';

/**
 * @ngdoc service
 * @name pandrugsFrontendApp.RestDatabase
 * @description
 * # RestDatabase
 * Factory in the pandrugsFrontendApp.
 */
angular.module('pandrugsFrontendApp')
  .factory('user', ['$q', '$timeout', '$filter', '$http', '$sessionStorage', '$location', 'BACKEND',
    function restDatabaseFactory($q, $timeout, $filter, $http, $sessionStorage, $location, BACKEND) {
      var currentUser = 'anonymous';

      function doLogin(login, password, onSuccess, onError) {
        $http.defaults.headers.common.Authorization = 'Basic ' + btoa(login + ':' + password);
        // signals the backend to send a WWW-Authenticate: xBasic avoiding the browser login dialog to appear
        $http.defaults.headers.common['x-requested-with'] = 'xmlhttprequest';

        $http.get(BACKEND.API + 'user/' + login)
          .then(function () {
            $sessionStorage.user = login;
            $sessionStorage.password = password;
            currentUser = login;

            if (onSuccess) {
              onSuccess();
            }
          }, function () {
            doLogout();

            if (onError) {
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
        .then(function (response) {
          if (onSuccess) {
            onSuccess(response.data);
          }
        }, function () {
          if (onError) {
            onError();
          }
        });
      }

      function doRegister(login, email, password, onSuccess, onError) {
        var absUrl = $location.absUrl();
        var encodedTemplate = encodeURIComponent(absUrl.substring(0, absUrl.indexOf('#')) + '#/login?confirmuuid=%s');

        $http.post(BACKEND.API + 'registration/?confirmurltemplate=' + encodedTemplate,
          {
            'login': login,
            'email': email,
            'password': password
          }
        ).then(function (response) {
          if (onSuccess) {
            onSuccess(response.data);
          }
        }, function () {
          if (onError) {
            onError();
          }
        });
      }

      function getComputations(onSuccess, onError) {
        if (currentUser !== 'anonymous') {
          $http.get(BACKEND.API + 'variantsanalysis/' + currentUser)
            .then(function (response) {
              if (onSuccess) {
                onSuccess(response.data);
              }
            }, function () {
              if (onError) {
                onError();
              }
            });
        }
      }

      function getComputation(userName, computationId, onSuccess, onError) {
        var headers = {};
        if (userName === 'guest') {
          headers.Authorization = 'Basic ' + btoa('guest:guest');
        }

        $http.get(BACKEND.API + 'variantsanalysis/' + userName + '/' + computationId, {headers: headers})
          .then(function (response) {
            if (onSuccess) {
              onSuccess(response.data);
            }
          }, function () {
            if (onError) {
              onError();
            }
          });

      }

      function submitComputation(vcfFile, computationName, onSuccess, onError) {
        var headers = {'Content-Type': undefined};

        var requestUser = currentUser;
        if (currentUser === 'anonymous') {
          headers.Authorization = 'Basic ' + btoa('guest:guest');
          requestUser = 'guest';
        }

        var reader = new FileReader();
        reader.onload = function () {
          var fileContents = reader.result;
          $http.post(BACKEND.API + 'variantsanalysis/' + requestUser + '?name=' + computationName, fileContents, {
            transformRequest: angular.identity,
            headers: headers
          }).then(function (response) {
            if (onSuccess) {
              var location = response.headers('Location');
              var newId = location.substring(location.lastIndexOf('/') + 1);

              onSuccess(newId);
            }
          }, onError);
        };
        reader.readAsText(vcfFile);
      }

      function deleteComputation(computationId, onSuccess, onError) {
        $http.delete(
          BACKEND.API + 'variantsanalysis/' + currentUser + '/' + computationId)
          .then(function (response) {
            if (onSuccess) {
              onSuccess(response.data);
            }
          }, function () {
            if (onError) {
              onError();
            }
          });
      }

      if ('user' in $sessionStorage) {
        doLogin($sessionStorage.user, $sessionStorage.password);
      }


      // Public API here
      return {
        getCurrentUser: function () {
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
