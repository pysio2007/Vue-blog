---
title: Remove PVE "No valid subscription" Popup
date: 2024-09-26
icon: fa-kit fa-pve
category: develop
tag:
  - PVE
  - Daily
---
Modify ```/usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js``` change
```js
Ext.Msg.show({
```
to
```js
Ext.Msg.noshow({
```
Execute the following command to restart PveProxy and remove the popup
```bash
systemctl restart pveproxy
``` 