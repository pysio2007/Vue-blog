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

## 使用OpenBmclapi

::: tip 
我更建议你使用已经修改过的 Node-OpenMcim 执行上线 
:::

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

## 使用Go-OpenMcim

## 使用Node-OpenMcim

## 使用反向代理节点

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