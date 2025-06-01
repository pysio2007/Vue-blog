---
title: Configure Redis Object Cache Plugin with 1Panel
date: 2024-09-14
icon: fa-brands fa-wordpress
category: develop
tag:
  - 1Panel
  - WordPress
---

## Step 1: Get Redis Password
![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/20241005215409.png)
Go to [App Store] -> [Installed] -> [Redis Parameters] to see the password and write it down

## Step 2: Modify object-cache.php File
In the website root directory ```wp-content/plugins/redis-cache/includes```, you can find the ```object-cache.php``` file  
Open and edit it  
![](https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect,slow-connection-quality=50/https://s3.pysio.online/pysioimages/20241005215426.png)  
Add or modify the following section, where PassWord is the Redis password you just obtained
```php
$parameters = [
   'scheme' => 'tcp',
   'host' => 'redis',
   'port' => 6379,
   'database' => 0,
   'password' => 'Your Redis Password',
   'timeout' => 1,
   'read_timeout' => 1,
   'retry_interval' => null,
   'persistent' => false,
];
```

## Step 3: Modify wp-config.php File
Find the wp-config.php file in the website root directory and add at the end

```php
/** Redis Cache */
define('WP_CACHE_KEY_SALT', '001');
define('WP_REDIS_SCHEME', 'tcp');
define('WP_REDIS_HOST', 'redis');
define('WP_REDIS_PORT', '6379');
define('WP_REDIS_DATABASE', '0');
define('WP_REDIS_PASSWORD', 'Your Redis Password');
```
### Finally: Enable the Plugin
Now enable your Redis Object Cache plugin, it should work properly now 