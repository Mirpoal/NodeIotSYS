/**
 * 路由表
 */
module.exports = {

    /**
     * 网站后台
     */
  //index
  '/admin*':{
    get : 'admin'
  },

    // API
  '/api':{
      '/install': {
          get: 'install.status',
          post: 'install.install',

          '/test-database': {
              put: 'install.testDatabase'
          }
      },

      '/roles': {
          get: 'roles.list',
          post: 'roles.create',

          '/:_id': {
              get: 'roles.one',
              put: 'roles.update',
              delete: 'roles.remove'
          }
      },

      // 后台用户
      '/admin-users': {
          get: 'admin-users.list',
          post: 'admin-users.create',

          '/:_id': {
              get: 'admin-users.one',
              put: 'admin-users.update',
              delete: 'admin-users.remove'
          }
      },

      //账号相关
      '/account' : {
          put : 'account.update',

          get: 'account.current',
          '/sign-in': {
              put: 'account.signIn'
          },
          '/sign-out': {
              put: 'account.signOut'
          }
      },
      // 用户
      '/users': {
          get: 'users.get'
      },

      //传感器相关
      '/sensor' :{
          get : 'sensor.all',
          put : 'sensor.putsensor',
          '/:_id' : {
              get : 'sensor.one'
          },
          '/mac' :{
              '/:_id' :  {
                  get : 'sensor.getsensor'
              }
          },
          '/real' : {
              '/:_id' : {
                  get: 'sensor.getreal'
              }
          }
      },

      //设备认证相关
      '/auth' :{
          put : 'device.save',
          get : 'device.all',
          '/:_id' : {
              delete : 'device.remove'
          }
      },

      '/mac' : {
          get : 'mac.all'
      },

      '/controller' :{
          put : 'controller.save',
          get : 'controller.all'
      }
  },


    /**
     * 网站前台
     */
    // 检查安装状态
    '*': { get: 'install.access' },

    // 首页
    '/': {
        get: 'noderiotsys.login',
        post: 'noderiotsys.dologin'
    },

    '/signOut' : {
        get : 'noderiotsys.signOut'
    },

    '/introduce' : {
        get : 'noderiotsys.introduce'
    },

    '/dashboard' : {
        get: 'noderiotsys.layoutmain',
        '/extend' :{
            post : 'noderiotsys.extend'
        }
    },

    // 错误页
    '/*': { get: 'errors.notFound' }

};