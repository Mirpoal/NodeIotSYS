
angular.module('noderIot', [
  'ngAnimate',
  'ipCookie',
  'ui.router',
  'ngFileUpload',
  'angular-img-cropper',
  'controllers',
  'services',
  'directives',
  'filters',
  'views'
])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
  function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    'use strict';

    // 修改默认请求头
    $httpProvider.defaults.headers.common = {'content-type': 'application/json;charset=utf-8'};

    // 拦截无权限请求
    $httpProvider.interceptors.push('authorityInterceptor');

    // 开启 HTML5 模式
    $locationProvider.html5Mode(true);

    // 将所有未匹配路由转至根目录
    $urlRouterProvider.otherwise(function ($injector) { $injector.get('$state').go('main') });

    // 路由
    $stateProvider
        //安装
        .state('install', {
            url: '^/admin/install',
            controller: 'install',
            templateProvider: ['$templateCache', function($templateCache) {
                return $templateCache.get('install.view.html');
            }],
            resolve: {
                checkInstallResolve: ['checkInstallResolve', function (resolve) { return resolve.leaveToSignInOrNone() }],
            }
        })
          // 登录
          .state('signIn', {
            url: '^/admin/sign-in',
            controller: 'signIn',
            templateProvider: ['$templateCache', function($templateCache) {
              return $templateCache.get('sign-in.view.html');
            }],
              resolve: {
                  checkInstallResolve: ['checkInstallResolve', function (resolve) { return resolve.enterToInstallOrNone() }],
              }
          })
          //设备管理
          .state('main', {
              url: '^/admin',
              controller: 'main',
              templateProvider: ['$templateCache', function($templateCache) {
                  return $templateCache.get('main.view.html');
              }],
              resolve: {
                  account: 'account'
              }
          })
          //开发者中心
          .state('main.developer', {
              url: '^/admin/developer',
              controller: 'developer',
              templateProvider: ['$templateCache', function($templateCache) {
                  return $templateCache.get('developer.view.html');
              }]
          })
          // 设备修改
          .state('main.developer.update', {
              url: '^/admin/setting/dev/:_id',
              controller: 'link',
              templateProvider: ['$templateCache', function($templateCache) {
                  return $templateCache.get('update.view.html');
              }]
            })
        .state('main.developer.link',{
            url: '^/admin/developer/link',
            controller: 'link',
            templateProvider: ['$templateCache', function($templateCache) {
                return $templateCache.get('link.view.html');
            }]
        })
          // 扩展指南
          .state('main.mac', {
              url: '^/admin/mac',
              controller: 'mac',
              templateProvider: ['$templateCache', function($templateCache) {
                  return $templateCache.get('mac.view.html');
              }]
          })
          // 帐号设置
          .state('main.account', {
                url: '^/admin/account',
                controller: 'account',
                templateProvider: ['$templateCache', function($templateCache) {
                    return $templateCache.get('account.view.html');
                }]
            })

          // 后台用户
            .state('main.adminUsers', {
                url: '^/admin/admin-users',
                controller: 'adminUsers',
                templateProvider: ['$templateCache', function($templateCache) {
                    return $templateCache.get('admin-users.view.html');
                }]
            })

            // 后台用户 - 创建用户
            .state('main.adminUsers.create', {
                url: '^/admin/admin-users/create',
                controller: 'adminUsersChange',
                templateProvider: ['$templateCache', function($templateCache) {
                    return $templateCache.get('admin-users-change.view.html');
                }]
             })
            //用户更新
            .state('main.adminUsers.update', {
                url: '^/admin/setting/admin-users/:_id',
                controller: 'adminUsersChange',
                templateProvider: ['$templateCache', function ($templateCache) {
                    return $templateCache.get('admin-users-change.view.html');
                }]
            })

  }
]).run(['checkSignIn', '$templateCache', function (checkSignIn) {
  checkSignIn();
}]);


angular.module('controllers', []);
angular.module('services', []);
angular.module('directives', []);
angular.module('filters', []);
angular.module('views', []);