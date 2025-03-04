
cd /var/www/html/nxt-projects/nxt-projects-backend

# Git
git checkout dev
git pull origin dev
 


# Build and deploy
# npm run build

# restart pm2
pm2 restart projects-api
