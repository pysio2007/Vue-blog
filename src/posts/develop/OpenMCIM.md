---
title: 部署OpenMcim节点
date: 2024-10-07
icon: fa-kit fa-modrinth
category: develop
tag:
  - MC
  - 服务
---

<!-- markdownlint-disable MD028 -->

> [!info] 
> MCIM 需要提供文件镜像，但由于成本问题，以及受到 OpenBMCLAPI 的启发，本项目分发 Mod 文件基于网盘
> 感谢各位的支持~！感谢您为改善国内 Mod 下载环境的贡献！

<!-- markdownlint-enable MD028 -->

<!-- more -->

## OpenBmclapi

> [!tip]
> 我更建议你使用已经修改过的OpenMcim执行上线 

> [!warning]
> 因为 Modrinth 原因 会有很多Hash错误的文件 未修改的OpenBmclapi无法上线

### 从源码运行

#### 环境

- Node.js 18以上
- Windows/MacOS/Linux, x86/arm均可 (凡是nodejs支持的环境都可以)

#### 设置环境

1. 去 <https://nodejs.org/zh-cn/> 下载LTS版本的nodejs并安装
2. Clone 并安装依赖

```bash
git clone https://github.com/bangbang93/openbmclapi
cd openbmclapi
## 安装依赖
npm ci
## 编译
npm run build
## 运行
node dist/index.js
```
3. 如果你看到了 `CLUSTER_ID is not set` 的报错, 说明一切正常, 接下来 修改代码 使其运行在OpenMCIM

4. 修改 `dist/cluster.js` 文件, 找到

```js
const whiteListDomain = ['localhost', 'bangbang93.com'];
```

修改为

```js
const whiteListDomain = ['localhost', 'bangbang93.com','files.mcimirror.top'];
```

#### 设置参数

在项目根目录创建一个文件, 名为 `.env`

写入如下内容

```env
CLUSTER_ID=你的CLUSTER_ID
CLUSTER_SECRET=你的CLUSTER_SECRET
CLUSTER_PORT=对外访问端口
CLUSTER_BMCLAPI=https://files.mcimirror.top
```

CLUSTER_ID 和 CLUSTER_SECRET 请联系管理员获取

如果配置无误的话, 运行程序, 就会开始拉取文件, 拉取完成后就会开始等待服务器分发请求了

::: details 这是一个简短的修改部署视频

<AsciinemaPlayer src="https://cdn.akaere.online/asciinema.org/a/679565.cast" :options="{ theme: 'monokai' }" />

:::

## Node-OpenMcim

### 使用Docker

```bash
docker run -d \
-e CLUSTER_ID=${CLUSTER_ID} \
-e CLUSTER_SECRET=${CLUSTER_SECRET} \
-e CLUSTER_PUBLIC_PORT=${CLUSTER_PORT} \
-e TZ=Asia/Shanghai \
-v /data/mcim:/opt/mcim \
-p ${CLUSTER_PORT}:${CLUSTER_PORT} \
--restart unless-stop \
--name mcim \
zerowolf233/mcim
```

### 从源码安装

#### 环境

- Node.js 18 以上
- Windows/MacOS/Linux
- x86/arm 均可 (需支持Nodejs)

#### 设置环境

1. 去 <https://nodejs.org/zh-cn/> 下载LTS版本的nodejs并安装
2. Clone 并安装依赖

```bash
git clone https://github.com/ZeroWolf233/node-openmcim
cd node-openmcim 
## 安装依赖
npm ci
## 编译
npm run build
## 运行
node dist/index.js
```

3. 如果你看到了 `CLUSTER_ID is not set` 的报错, 说明一切正常, 该设置参数了

#### 设置参数

在项目根目录创建一个文件, 名为 `.env`

写入如下内容

```env
CLUSTER_ID=你的节点ID
CLUSTER_SECRET=你的节点密钥
CLUSTER_PUBLIC_PORT=你的对外开放端口（用户请求时访问）
CLUSTER_PORT=你的本地开放端口
CLUSTER_STORAGE=存储类型
CLUSTER_STORAGE_OPTIONS=存储配置项（请参考上方Alist配置）
```

如果配置无误的话, 运行程序, 就会开始拉取文件, 拉取完成后就会开始等待服务器分发请求了！

## Go-OpenMcim

> [!warning]
> 我并不建议你使用GO端上线，目前停止维护且BUG居多

##  反向代理节点

### Windows 部署

1. 前往 <https://www.pysio.tech/zh-CN/MCIM/> 下载最新的MCIM反向代理节点

2. 解压文件

3. 修改.env文件 填写如下内容

```env
CLUSTER_ID=你的节点ID
CLUSTER_SECRET=你的节点密钥
CLUSTER_PUBLIC_PORT=你的对外开放端口（用户请求时访问）
CLUSTER_PORT=你的本地开放端口
```

4. 运行`run.ps1` 上线

### Linux 部署

##### 环境

- Node.js 18 以上
- Windows/MacOS/Linux
- x86/arm 均可 (需支持Nodejs)

##### 部署

1. 前往 <https://www.pysio.tech/zh-CN/MCIM/> 下载最新的MCIM反向代理节点

2. 解压文件

3. 执行如下命令获取依赖包

```bash
npm install
```

4. 修改.env文件 填写如下内容

```env
CLUSTER_ID=你的节点ID
CLUSTER_SECRET=你的节点密钥
CLUSTER_PUBLIC_PORT=你的对外开放端口（用户请求时访问）
CLUSTER_PORT=你的本地开放端口
```

5. 运行`node dist/index.js`上线

## 特别鸣谢

<VPCard
  title="bangbang93"
  desc="OpenBmclapi 作者"
  logo="https://cdn.akaere.online/https://avatars.githubusercontent.com/u/3430784"
  link="https://github.com/bangbang93"
  background="rgba(236, 244, 250)"
/>
<VPCard
  title="z0z0r4"
  desc="Mcmod Info Mirror作者"
  logo="https://cdn.akaere.online/https://avatars.githubusercontent.com/u/78744121"
  link="https://github.com/z0z0r4"
  background="rgba(236, 244, 250)"
/>
<VPCard
  title="𝞐𝞙𝞘𝞚𝞛𝞝"
  desc="Go-OpenMcim 修改版作者"
  logo="https://cdn.akaere.online/https://avatars.githubusercontent.com/u/162766791"
  link="https://github.com/WetemCloud"
  background="rgba(236, 244, 250)"
/>
<VPCard
  title="ZeroWolf"
  desc="Node-OpenMcim 作者"
  logo="https://cdn.akaere.online/https://avatars.githubusercontent.com/u/142653035"
  link="https://github.com/ZeroWolf233"
  background="rgba(236, 244, 250)"
/>
<VPCard
  title="SaltWood_233"
  desc="Open93AtHome 作者"
  logo="https://cdn.akaere.online/https://avatars.githubusercontent.com/u/105980161"
  link="https://github.com/SALTWOOD"
  background="rgba(236, 244, 250)"
/>