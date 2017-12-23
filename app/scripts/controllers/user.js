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
 * @ngdoc function
 * @name pandrugsFrontendApp.controller:HeaderCtrl
 * @description
 * # HeaderCtrl
 * Controller of the pandrugsFrontendApp
 */
angular.module('pandrugsFrontendApp')
  .controller('UserCtrl', ['user', '$scope', '$location',
    function (user, $scope, $location) {
      if ($location.search().confirmuuid) {
            user.confirm($location.search().confirmuuid, function(){
              window.alert('Your user has been successfully activated. You can now login.');
              $location.path('/login');
            }, function(){
              window.alert('ERROR: Your user could not be activated.');
            });
      }

      $scope.newUser = false;

      $scope.showRegistration = function () {
        $scope.newUser = true;
      };

      $scope.showLogin = function () {
        $scope.newUser = false;
      };

      function doRedirectIfRef() {
        if ($location.search().ref !== undefined && user.getCurrentUser() !== 'anonymous') {
          $location.url(decodeURIComponent($location.search().ref));
        } else if ($location.search().ref === undefined && user.getCurrentUser() !== 'anonymous') {
          $location.path('/');
        }
      }

      user.onLoginStateChanged(doRedirectIfRef);

      $scope.$on('$destroy', function() {
        user.removeLoginStateChanged(doRedirectIfRef);
      });

      doRedirectIfRef();

      $scope.doLogin = function() {
        user.login(
          $scope.login,
          $scope.password,
          null,
          function() { window.alert('Your login/password was not correct. Please make sure that you have been registered with this login/password'); }
        );
      };

      $scope.register = function() {
        user.register(
          $scope.newlogin,
          $scope.newemail,
          $scope.newpassword,
          function() {
            window.alert('Your user has been now register. We have sent you an email in order to activate it. Please check your inbox');
            $scope.newlogin = '';
            $scope.newemail = '';
            $scope.newpassword = '';
          },
          function() {
            window.alert('An error has occurred during registration. Please contact administrator');
          }
        );
      };

      $scope.currentUser = function() {
        return user.getCurrentUser();
      };

      $scope.logout = function() {
        user.logout();
      };

    }
  ]);
