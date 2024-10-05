---
title: 去除 PVE “无有效的订阅” 弹窗
date: 2024-09-26
icon: https://imges.pysio.online/pvelogo.svg
category: develop
tag:
  - PVE
  - 日常
---
修改 ```/usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js``` 将
```js
Ext.Msg.show({
```
修改为
```js
Ext.Msg.noshow({
```
执行以下命令 重启PveProxy即可去除弹窗
```bash
systemctl restart pveproxy
```

