/**
 * ndNavigation Directives
 */
angular.module('directives').directive('ndNavigation', ['$templateCache', '$rootScope', '$state', '$timeout', '$http', '$filter', 'account',
  function ($templateCache, $rootScope, $state, $timeout, $http, $filter, account) {
    return {
	    restrict: 'E',
	    template: $templateCache.get('navigation.view.html'),
        link: function (scope, element) {
        /**
         * 初始化变量
         */
        scope.auth = {};
        scope.user = {};

        /**
         * 读取用户
         */
        function loadUser () {
          account.get()
            .then(function (user) {
              scope.user = user;
            }, function () {
              scope.$emit('notification', {
                type: 'danger',
                message: '读取用户失败'
              });
            });
        } loadUser();

        /**
         * 退出登录
         */
        scope.signOut = function () {
          $http.put('/api/account/sign-out')
            .then(function () {
              // 清空账户缓存
              account.reset();
              $state.go('signIn');
            }, function () {
              scope.$emit('notification', {
                type: 'danger',
                message: '退出登录失败'
              });
            });
        };

        /**
         * 接收用户更新消息
         */
        $rootScope.$on('mainUserUpdate', function () {
          account.reset();
          loadUser();
        });
      }
    }
  }
]);