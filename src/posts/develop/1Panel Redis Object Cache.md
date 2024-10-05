---
title: 1panel面板配置Redis Object Cache插件
date: 2024-09-14
icon: https://imges.pysio.online/wordpress-brands-solid.svg
category: develop
tag:
  - 1Panel
  - WordPress
---

## 第一步 获取Redis的密码
![](https://imges.pysio.online//20241005215409.png)
[应用商店] -> [已安装] -> [Redis 参数] 就可以看见密码了 把密码记下来

## 第二步 修改object-cache.php文件
在网站根目录 ```wp-content/plugins/redis-cache/includes``` 下 可以找到 ```object-cache.php```文件 打开并编辑
![](https://imges.pysio.online//20241005215426.png)
添加或修改以下部分 其中PassWord是你刚刚获取的Redis密码
```php
$parameters = [
   'scheme' => 'tcp',
   'host' => 'redis',
   'port' => 6379,
   'database' => 0,
   'password' => '你的Redis密码',
   'timeout' => 1,
   'read_timeout' => 1,
   'retry_interval' => null,
   'persistent' => false,
];
```

## 第三步 修改wp-config.php文件
在网站根目录找到wp-config.php文件 在末尾添加

```php
/** Redis Cache */
define('WP_CACHE_KEY_SALT', '001');
define('WP_REDIS_SCHEME', 'tcp');
define('WP_REDIS_HOST', 'redis');
define('WP_REDIS_PORT', '6379');
define('WP_REDIS_DATABASE', '0');
define('WP_REDIS_PASSWORD', '你的Redis密码');
```
### 最后 启用插件
现在启用你的Redis Object Cache插件 他现在应该正常工作了