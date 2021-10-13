param functionAppName string
param runtime string
param nodejsversion string
param storageAccountConnectionString string
param cosmosDbAccountConnectionString string
param appInsightsKey string
param timeZone string = 'Romance Standard Time'

resource functionAppResource 'Microsoft.Web/sites@2021-01-15' existing = {
  name: functionAppName
}

resource functionAppAppsettings 'Microsoft.Web/sites/config@2021-01-15' = {
  name: 'appsettings'
  parent: functionAppResource
  properties: {
    AzureWebJobsStorage: storageAccountConnectionString
    APPINSIGHTS_INSTRUMENTATIONKEY: appInsightsKey
    WEBSITE_CONTENTAZUREFILECONNECTIONSTRING: storageAccountConnectionString
    COSMOSDBACCOUNTCONNECTIONSTRING: cosmosDbAccountConnectionString
    WEBSITE_CONTENTSHARE: toLower(functionAppName)
    FUNCTIONS_EXTENSION_VERSION: '~3'
    FUNCTIONS_WORKER_RUNTIME: runtime
    WEBSITE_NODE_DEFAULT_VERSION: nodejsversion
    WEBSITE_TIME_ZONE: timeZone
    WEBSITE_RUN_FROM_PACKAGE: '1'
  }
}
