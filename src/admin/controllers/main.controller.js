/**
 * Main Controller
 */
angular.module('controllers').controller('main', ['$scope', '$http',
	function ($scope, $http) {
		'use strict';

		/**
		 * 初始化变量
		 */
        $scope.deletedeviceId = '';
        $scope.devices = [];
        $scope.devicesList = [];
        $scope.transmitting = false;

        $http.get('/api/sensor')
            .then(function (res) {
                var source= _.partition(res.data,'_id');
                $scope.devicesList = source[0];
            }, function () {
                $scope.$emit('notification', {
                    type: 'danger',
                    message: '设备读取成功'
                });
            });
	}
]);