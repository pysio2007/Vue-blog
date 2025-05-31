---
title: Manually Merge Pull Requests from GitHub Locally
date: 2024-09-26
icon: fa-light fa-code-pull-request
category: develop
tag:
  - Git
  - Daily
---
First, add remote repository information using the command 

```bash
git remote add [remote repository name] [remote repository address] 
```
After successfully adding the repository, use ``` git fetch [remote repository name] ``` to pull the repository locally

```bash
❯ git fetch pr2
remote: Enumerating objects: 26, done.
remote: Counting objects: 100% (26/26), done.
remote: Compressing objects: 100% (9/9), done.
remote: Total 18 (delta 8), reused 17 (delta 7), pack-reused 0 (from 0)
Unpacking objects: 100% (18/18), 3.26 KiB | 371.00 KiB/s, done.
From github.com:pysio2007/SkyBlock-CN-WIKI
 * [new branch]      main       -> pr2/main
```

Finally, use ```merge``` or ```cherry-pick``` to merge the entire branch or a specific commit 

```bash
# Merge specific commit ID
❯ git cherry-pick [Commitid]

# Merge specific branch
❯ git merge [remote repository name]/[branch name]
```

After we finish merging, clean up the remote repository information
```bash
git remote rm [remote repository name]
``` 