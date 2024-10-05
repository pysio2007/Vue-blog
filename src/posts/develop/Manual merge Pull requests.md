---
title: 本地手动合并Github上的Pull requests
date: 2024-09-26
icon: code-pull-request
category: develop
tag:
  - Git
  - 日常
---
首先 通过命令添加远程的仓库信息 

```bash
git remote add [远程仓库名称] [远程仓库地址] 
```
仓库添加成功后 通过 ``` git fetch [远程仓库名称] ``` 把仓库拉到本地

```bash
❯ git fetch pr2
remote: Enumerating objects: 26, done.
remote: Counting objects: 100% (26/26), done.
remote: Compressing objects: 100% (9/9), done.
remote: Total 18 (delta 8), reused 17 (delta 7), pack-reused 0 (from 0)
展开对象中: 100% (18/18), 3.26 KiB | 371.00 KiB/s, 完成.
来自 github.com:pysio2007/SkyBlock-CN-WIKI
 * [新分支]          main       -> pr2/main
```

最后通过 ```merge``` 或者 ```cherry-pick``` 合并整个分支或者某个具体的提交 

```bash
# 合并具体的 commitid
❯ git cherry-pick [Commitid]

# 合并具体的分支
❯ git merge [远程仓库名称]/[分支名称]
```

当我们合并完成之后，清理远程仓库的信息
```bash
git remote rm [远程仓库名称]
```