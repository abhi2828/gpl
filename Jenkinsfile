pipeline {

    agent any
    
    stages{
        
        stage ('Checkout'){
            steps{
                checkout scm
                sh 'git --version'
                sh 'docker -v'
                sh 'echo "Branch name: ${GIT_BRANCH}"'
            }
        }

        stage ('Declare Variables'){
            steps {
                script{
                    switch(env.GIT_BRANCH) {
                        case 'origin/feature/ci-cd-pipeline':
                            env.DEPLOY_ENV = "dev"
                            break
                        case 'origin/development':
                            env.DEPLOY_ENV = "dev"
                            break
                        case 'origin/qa':
                            env.DEPLOY_ENV = "qa"
                            break
                        case 'origin/uat':
                            env.DEPLOY_ENV = "uat"
                            break
                        case 'origin/main':
                            env.DEPLOY_ENV = "prod"
                            break
                        default:
                            env.DEPLOY_ENV = "dev"
                            break 
                    }
                }
                sh 'echo "${DEPLOY_ENV}"'
            }
        }

        stage ('Build'){
            steps{
                sh 'docker-compose -f docker-compose.${DEPLOY_ENV}.yml build'
            }
        }

        stage ('Publish'){
            steps{
                withDockerRegistry([credentialsId: "gpl-alchemy-${DEPLOY_ENV}-docker-creds", url: '']) {
                    sh 'echo "Publishing image.."'
                    sh 'DEPLOY_ENV=${DEPLOY_ENV} docker-compose -f docker-compose.${DEPLOY_ENV}.yml push'
                }     
            }  
        }

        stage ('Deploy'){
            environment {
                REMOTE_HOST = credentials("gpl-alchemy-${DEPLOY_ENV}-remote-host")
                REMOTE_USER = credentials("gpl-alchemy-${DEPLOY_ENV}-remote-user")
                RWD = "deployments/gpl-alchemy/${DEPLOY_ENV}/frontend"
            }
            steps {
                sshagent(["gpl-alchemy-${DEPLOY_ENV}-remote-server-ssh-creds"]) {

                    // Check SSH Connection
                    sh 'ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} "ls"'
                    sh 'ssh ${REMOTE_USER}@${REMOTE_HOST} "rm -rf ${RWD}"'
                    sh 'ssh ${REMOTE_USER}@${REMOTE_HOST} "mkdir ${RWD}"'

                    // Docker login to pull images from docker hub
                    withCredentials([usernamePassword(credentialsId: "gpl-alchemy-${DEPLOY_ENV}-docker-creds", usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh 'ssh ${REMOTE_USER}@${REMOTE_HOST} "echo ${PASSWORD} | docker login --username ${USERNAME} --password-stdin"'
                    }

                    // Transfer required files on server
                    sh 'scp -r docker-compose.${DEPLOY_ENV}.yml ${REMOTE_USER}@${REMOTE_HOST}:${RWD}/'

                    // Deploy application with docker compose
                    sh 'ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${RWD}/ && DEPLOY_ENV=${DEPLOY_ENV} docker-compose -f docker-compose.${DEPLOY_ENV}.yml pull"'
                    sh 'ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${RWD}/ && DEPLOY_ENV=${DEPLOY_ENV} docker-compose -f docker-compose.${DEPLOY_ENV}.yml -p gpl-alchemy-fe-${DEPLOY_ENV} down"'
                    sh 'ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${RWD}/ && DEPLOY_ENV=${DEPLOY_ENV} docker-compose -f docker-compose.${DEPLOY_ENV}.yml -p gpl-alchemy-fe-${DEPLOY_ENV} up --no-build -d"'
                }
            }       
        }
    }
}
