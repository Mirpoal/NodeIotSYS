/**
 * Install Controller
 */
angular.module('controllers').controller('install', ['$scope', '$state', '$http', '$timeout',
  function ($scope, $state, $http, $timeout) {
    'use strict';

    /**
     * 初始化变量
     */
    $scope.transmitting = false;
    $scope.page = 'license';
    $scope.databaseHost = 'localhost';
    $scope.databasePort = 27017;
    $scope.database = 'noderIotSys';
    $scope.databaseUser = '';
    $scope.databasePassword = '';
    $scope.databaseError = false;
    $scope.themes = [];
    $scope.theme = 'default';
    $scope.themeError = false;
    $scope.title = '';
    $scope.email = '';
    $scope.nickname = '';
    $scope.password = '';
    $scope.siteInfoError = false;
    $scope.hasInstall = false;
    $scope.installingTimeout = null;
    $scope.installingPoll = null;
    $scope.sponsor = 99;

    /**
     * 检查数据库连接
     */
    $scope.testDatabase = function () {
      $scope.transmitting = true;

      var data = {
        host: $scope.databaseHost,
        port: $scope.databasePort,
        db: $scope.database,
        user: $scope.databaseUser,
        pass: $scope.databasePassword
      };

      $http.put('/api/install/test-database', data)
        .then(function () {
          $scope.transmitting = false;
          $scope.databaseError = false;

          $scope.page = 'siteInfo';
        }, function () {
          $scope.transmitting = false;
          $scope.databaseError = true;
        });
    };

    /**
     * 提交 install
     */
    $scope.submitInstall = function () {
      $scope.transmitting = true;
      $scope.installing();

      var data = {
        databaseHost: $scope.databaseHost,
        databasePort: $scope.databasePort,
        database: $scope.database,
        databaseUser: $scope.databaseUser,
        databasePassword: $scope.databasePassword,
        email: $scope.email.toLowerCase(),
        nickname: $scope.nickname,
        password: $scope.password
      };

      $http.post('/api/install', data)
        .then(function () {
          $scope.hasInstall = true;
        }, function () {
          if ($scope.installingTimeout) $timeout.cancel($scope.installingTimeout);
          if ($scope.installingPoll) $timeout.cancel($scope.installingPoll);
          $scope.transmitting = false;
          $scope.siteInfoError = true;
          $scope.page = 'siteInfo';
        });
    };

    $scope.installing = function () {
      $scope.page = 'installing';

      $scope.installingTimeout = $timeout(function poll () {
        if (!$scope.hasInstall) {
          $scope.installingPoll = $timeout(poll, 1000);
        } else {
          $scope.page = 'installed';
        }
      }, 1000);
    };
  }
]);