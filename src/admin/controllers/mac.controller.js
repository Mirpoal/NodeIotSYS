/**
 * Mac Controller
 */
angular.module('controllers').controller('mac', ['$scope','$state', '$http',
    function ($scope,$state, $http) {
        'use strict';

        /**
         * 初始化变量
         */
        $scope.transmit = false;
        $scope.macList = [];

        $http.get('/api/mac')
            .then(function (res) {
                var source= _.partition(res.data,'_id');
                $scope.macList = source[0];
                console.log(source[0]);
            }, function () {
                $scope.$emit('notification', {
                    type: 'danger',
                    message: '设备读取成功'
                });
            });
    }
]);