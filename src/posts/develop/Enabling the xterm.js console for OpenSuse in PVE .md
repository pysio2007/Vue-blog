---
title: 在PVE为OpenSuse启用xterm.js控制台
date: 2024-09-13
icon: https://imges.pysio.online//opensuse-brands-solid.svg
category: develop
tag:
  - PVE
  - OpenSuse
---

## 关闭 VM，并给 VM 添加一个 serial port
在 PVE Host 中用 qm 命令建立 serial port，假设我的 VM ID 是 100
```bash
qm set 100 -serial0 socket
```
接着重开 VM，用 dmesg 确认是否有 ttyS 出現
```bash
dmesg | grep ttyS
```
## OpenSuse修改 grub 配置
```/etc/default/grub``` 的 ```GRUB_CMDLINE_LINUX``` 参数，添加
```
console=tty0 console=ttyS0,115200
```
更新Grub配置
```bash
grub2-mkconfig --output=/boot/grub2/grub.cfg
```
重启OpenSuse虚拟机 检查 xterm.js 是否可用