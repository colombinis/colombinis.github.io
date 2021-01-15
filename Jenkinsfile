pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh '''echo "Paso 1"
cat /etc/os-release'''
      }
    }

    stage('Test') {
      steps {
        sh '''echo "Paso Test"
cat /etc/os-release'''
      }
    }

    stage('Deploy') {
      steps {
        sh '''echo "Paso Deploy"
cat /etc/os-release'''
      }
    }

  }
}