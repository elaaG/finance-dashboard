#!/bin/bash

# Login to Azure
az login

# Set variables
RESOURCE_GROUP="finance-dashboard-rg"
LOCATION="eastus"
APP_NAME="finance-dashboard"
DB_SERVER="finance-dashboard-db"

echo "🚀 Starting Azure deployment..."

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create PostgreSQL server
az postgres flexible-server create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER \
  --location $LOCATION \
  --admin-user $DB_USER \
  --admin-password $DB_PASSWORD \
  --sku-name Standard_B1ms \
  --storage-size 32 \
  --version 13

# Create database
az postgres flexible-server db create \
  --resource-group $RESOURCE_GROUP \
  --server-name $DB_SERVER \
  --database-name $DB_NAME

# Allow Azure services to connect
az postgres flexible-server firewall-rule create \
  --resource-group $RESOURCE_GROUP \
  --name $DB_SERVER \
  --rule-name allow-azure \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Create App Service plan
az appservice plan create \
  --name "${APP_NAME}-plan" \
  --resource-group $RESOURCE_GROUP \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group $RESOURCE_GROUP \
  --plan "${APP_NAME}-plan" \
  --name $APP_NAME \
  --runtime "NODE:18-lts"

# Configure environment variables
az webapp config appsettings set \
  --resource-group $RESOURCE_GROUP \
  --name $APP_NAME \
  --settings \
    DATABASE_URL=$DATABASE_URL \
    NEXTAUTH_URL="https://$APP_NAME.azurewebsites.net" \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    NODE_ENV="production"

echo "✅ Deployment completed! Your app is available at: https://$APP_NAME.azurewebsites.net"