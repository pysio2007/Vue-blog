pipeline {
  agent {
    docker {
      image 'node:latest'
    }
  }
  stages {
    stage('Preflight') {
      steps {
        echo sh(returnStdout: true, script: 'env')
        sh 'node -v'
        sh 'npm -v' // 也打印 npm 版本
      }
    }
    stage('Install') {
      steps {
        sh 'git log --reverse -1'
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run docs:build'
      }
    }
    stage('Archive') {
      steps {
        sh "zip -r docs.zip src/.vuepress/dist/*"
        archiveArtifacts artifacts: 'docs.zip', fingerprint: true
      }
    }
  }
}
