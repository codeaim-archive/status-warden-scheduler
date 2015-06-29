# Set and persist enviroment variables

export API_ROOT_URL=$1 && echo "export API_ROOT_URL=$API_ROOT_URL" >> ~/.profile
export DATABASE_CONNECTION_STRING=$2 && echo "export DATABASE_CONNECTION_STRING=$DATABASE_CONNECTION_STRING" >> ~/.profile
export ENVIRONMENT=$3 && echo "export ENVIRONMENT=$ENVIRONMENT" >> ~/.profile
export ROOT_ADMIN_DISPLAY_NAME=$4 && echo "export ROOT_ADMIN_DISPLAY_NAME=$ROOT_ADMIN_DISPLAY_NAME" >> ~/.profile
export ROOT_ADMIN_EMAIL_ADDRESS=$5 && echo "export ROOT_ADMIN_EMAIL_ADDRESS=$ROOT_ADMIN_EMAIL_ADDRESS" >> ~/.profile
export ROOT_ADMIN_PASSWORD=$6 && echo "export ROOT_ADMIN_PASSWORD=$ROOT_ADMIN_PASSWORD" >> ~/.profile
export SCHEDULER_DEBUG_PORT=$7 && echo "export SCHEDULER_DEBUG_PORT=$SCHEDULER_DEBUG_PORT" >> ~/.profile
export SCHEDULER_DEBUG_WEB_PORT=$8 && echo "export SCHEDULER_DEBUG_WEB_PORT=$SCHEDULER_DEBUG_WEB_PORT" >> ~/.profile


# Install node.js & npm

sudo apt-get install -y curl build-essential
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install -y nodejs

# Copy service to box

if [ "$ENVIRONMENT" == "production" ]
then
    sudo mkdir -p /data/scheduler /data/scheduler/job

    sudo cp /vagrant/package.json /data/scheduler/package.json

    sudo cp /vagrant/config.js /data/scheduler/config.js
    sudo cp /vagrant/logger.js /data/scheduler/logger.js
    sudo cp /vagrant/main.js /data/scheduler/main.js

    sudo cp -r /vagrant/job/* /data/scheduler/job
fi

#Install required packages

sudo npm install pm2 -g # Service host
sudo npm install bunyan -g # Logging provider

if [ "$ENVIRONMENT" == "development" ]
then
    sudo npm install node-inspector -g
fi

if [ "$ENVIRONMENT" == "development" ]
then
    cd /vagrant
fi

if [ "$ENVIRONMENT" == "production" ]
then
    cd /data/scheduler
fi

sudo npm install

# Start script based on environment, generate init.d script and restart service

if [ "$ENVIRONMENT" == "development" ]
then
    node-inspector --web-port=$SCHEDULER_DEBUG_WEB_PORT --debug-port=$SCHEDULER_DEBUG_PORT &
    pm2 start main.js --node-args="--debug=$SCHEDULER_DEBUG_PORT --trace-deprecation" --watch
fi

if [ "$ENVIRONMENT" == "production" ]
then
    pm2 start main.js
fi

sudo env PATH=$PATH:/usr/bin pm2 startup ubuntu -u vagrant
sudo pm2 save
