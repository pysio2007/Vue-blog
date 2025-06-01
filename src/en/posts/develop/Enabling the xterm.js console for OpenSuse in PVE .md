---
title: Enabling xterm.js Console for OpenSuse in PVE
date: 2024-09-13
icon: fa-brands fa-opensuse
category: develop
tag:
  - PVE
  - OpenSuse
---

## Shut down VM and add a serial port to the VM
Use the qm command in PVE Host to create a serial port, assuming my VM ID is 100
```bash
qm set 100 -serial0 socket
```
Then restart the VM and use dmesg to confirm if ttyS appears
```bash
dmesg | grep ttyS
```
## Modify grub configuration in OpenSuse
In ```/etc/default/grub``` add to the ```GRUB_CMDLINE_LINUX``` parameter:
```
console=tty0 console=ttyS0,115200
```
Update Grub configuration
```bash
grub2-mkconfig --output=/boot/grub2/grub.cfg
```
Restart the OpenSuse virtual machine and check if xterm.js is available 