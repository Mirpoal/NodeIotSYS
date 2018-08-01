# NodeIotSYS
基于NodeJS的小型物联管理系统，前台展示后期还需添加新框架。待续....

1. 电脑安装 Node.js  +  MongoDB数据库，并给系统添加  Node.js的环境变量。具体怎么操作看你用的操作系统。

2. clone至你的机器后删除  lock数据库锁定文件

3. 给MongoDB数据库添加用户认证   比如：  noderiotsys数据库的用户为 Poal ; 密码为 123

4. 用webstorm打开项目，用其他工具也行，没有发现比这个好用的，主要是集成了 Node.js  

5. 项目跟目录下允许   node install --prodution    命令（需要环境变量支持，见步骤1）安装项目的第三方库。

6. 运行  node app.js   运行项目，没有  lock  文件会进入系统数据库安装界面。

7. 数据库认证完后，用另一个仓库(NodeIOTSYS_ESP8266_Client)下的arduino文件烧如arduino或者ESP8266或者NodeMCU充当客服端发送数据上传系统

8. 系统后台添加客服端的 mac 地址信息和  认证密码  与客服端对接。

9. 前端用可视化界面显示 数据  。
