/**
 * Link Controller
 */
angular.module('controllers').controller('link', ['$scope', '$state', '$stateParams', '$http',
    function ($scope, $state, $stateParams, $http) {
        'use strict';

        /**
         * 初始化变量
         */
        $scope.mac = '';
        $scope.auth = '';
        $scope.description='';

        $scope.deletedeviceId = '';
        $scope.devicesList = [];

        async.parallel({
            deviceupdate: function (callback) {
                if ($stateParams._id) {
                    $http.get('/api/devinfo/' + $stateParams._id)
                        .then(function (res) {
                            var data = res.data;
                            if (data) {
                                callback(null, data)
                            } else {
                                $state.go('main.developer');
                            }
                        }, function (res) {
                            callback(res.data);
                        });
                }else {
                    callback(null);
                }
            }
        },function (err, results) {
            if (err) {
                $scope.$emit('notification', {
                    type: 'danger',
                    message: '获取设备失败'
                });
                return false;
            }
            console.log(results.deviceupdate);
            if(results.deviceupdate) {
                $scope.update_mac = results.deviceupdate.mac;
                $scope.update_auth = results.deviceupdate.auth;
                $scope.update_description = results.deviceupdate.description;
            }
        });

        $scope.savedevice = function () {
            var devinfo = {
                mac : $scope.mac,
                auth : $scope.auth,
                description : $scope.description
            };
            $http.put('/api/auth',devinfo)
                .success(function () {
                    $scope.$emit('notification', {
                        type: 'success',
                        message: '新增设备成功'
                    });
                    $state.go('main.developer',null,{ reload: 'main.developer' });
                })
                .error(function () {
                    $scope.$emit('notification', {
                        type: 'danger',
                        message: '新增设备失败'
                    });
                });
        };

        $scope.updatedevice = function () {
            var devinfo = {
                mac : $scope.update_mac,
                auth : $scope.update_auth,
                description:$scope.update_description
            };
            $http.put('/api/devinfo/' + $stateParams._id, devinfo)
                .then(function () {
                    $scope.$emit('notification', {
                        type: 'success',
                        message: '更新设备成功'
                    });
                    $state.go('main.developer', null, { reload: 'main.developer' });
                }, function () {
                    $scope.$emit('notification', {
                        type: 'danger',
                        message: '更新设备失败'
                    });
                });
        };
    }
]);