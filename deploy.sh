
#!/bin/bash

DEPLOY_SERVER=$DEPLOY_SERVER

echo "Deploying to ${DEPLOY_SERVER}"
ssh ubuntu@${DEPLOY_SERVER} 'bash' < ./server.sh
