/**
 * Developer Controller
 */
angular.module('controllers').controller('developer', ['$scope','$state', '$http',
    function ($scope,$state, $http) {
        'use strict';

        /**
         * 初始化变量
         */
        $scope.transmit = false;
        $scope.deletedeviceId = '';
        $scope.devices = [];
        $scope.devicesList = [];

        $http.get('/api/auth')
            .then(function (res) {
                var source= _.partition(res.data,'_id');
                $scope.devicesList = source[0];
            }, function () {
                $scope.$emit('notification', {
                    type: 'danger',
                    message: '设备读取成功'
                });
            });

        $scope.deleteAuth = function () {
            $scope.transmit = true;
            $http.delete('/api/auth/'+$scope.deletedeviceId)
                .success(function () {
                    $('#deleteModal').modal('hide');
                    $scope.transmit = false;
                    $state.go('main.developer', null, { reload: 'main.developer' });
                    $scope.$emit('notification', {
                        type: 'success',
                        message: '删除设备成功'
                    });
                })
                .error(function () {
                    $scope.$emit('notification', {
                        type: 'danger',
                        message: '删除设备失败'
                    });
                });
        }
    }
]);