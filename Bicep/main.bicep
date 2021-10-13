param location string = resourceGroup().location

//param appNamePrefix string = 'oh${uniqueString(resourceGroup().id)}'
param appNamePrefix string = 'ohratingteam3'


var appInsightName = '${appNamePrefix}-appinsight'
var aspName = '${appNamePrefix}-asp'
var funcName = '${appNamePrefix}-func'
var stoName = '${appNamePrefix}sto'
var keyVaultName = '${appNamePrefix}-kv'
var cosmosAccountName = '${appNamePrefix}-cdb'

var cosmosDbName = 'ratings'
var cosmosContainerName = 'ratings'

var aspSku = 'Y1'
var funcNodeVersion = '~14'
var funcRuntime = 'node'
var corsallowedOrigins = [
  'https://softserverless-rating.trafficmanager.net'
]


module appIns 'modules/appinsight.bicep' = {
  name: appInsightName
  params: {
    name: appInsightName
    location: location
  }
}

module sto 'modules/storage.bicep' = {
  name: stoName
  params: {
    name: stoName
    location: location
    sku: 'Standard_LRS'
  }
}

module kv 'modules/keyvault.bicep' = {
  name: keyVaultName
  params: {
    name: keyVaultName
    sku: 'standard'
  }
}

module asp 'modules/appserviceplan.bicep' = {
  name: aspName
  params: {
    name: aspName
    location: location
    sku: aspSku
  }
}

resource storageSecret 'Microsoft.KeyVault/vaults/secrets@2019-09-01' = {
  name: '${keyVaultName}/storageConnectionString'
  properties: {
    value: sto.outputs.storageAccountConnectionString
  }
  dependsOn: [
    kv
  ]
}


module func 'modules/function.bicep' = {
  name: funcName
  params: {
    functionAppName: funcName
    location: location
    planName: asp.outputs.id
    corsallowedOrigins: corsallowedOrigins
  }
}


module storageRoleAssignement 'modules/storageAccountBlobDataOwnerUserRoleAssignment.bicep' = {
  name: 'storageRoleAssignement'
  params: {
    storageAccountName: sto.outputs.storageAccountName
    functionAppName: func.outputs.prodFunctionAppName
  }
}

module keyVaultRoleAssignement 'modules/keyVaultSecretUserRoleAssignment.bicep' = {
  name: 'keyVaultRoleAssignement'
  params: {
    keyVaultName: kv.outputs.keyVaultName
    functionAppName: func.outputs.prodFunctionAppName
  }
}

module cosmosDb 'modules/cosmosdb.bicep' = {
  name: cosmosAccountName
  params: {
    accountName: cosmosAccountName
    dbName: cosmosDbName
    containerName: cosmosContainerName
  }
}

resource cosmosDbSecret 'Microsoft.KeyVault/vaults/secrets@2019-09-01' = {
  name: '${keyVaultName}/cosmosDbConnectionString'
  properties: {
    value: cosmosDb.outputs.cosmosDbConnectionString
  }
  dependsOn: [
    kv
  ]
}

module funcAppSettings 'modules/functionAppSettings.bicep' = {
  name: '${funcName}-funcAppSettings'
  params: {
    functionAppName: func.outputs.prodFunctionAppName
    nodejsversion: funcNodeVersion
    runtime: funcRuntime
    storageAccountConnectionString: '@Microsoft.KeyVault(SecretUri=${storageSecret.properties.secretUri}/)'
    cosmosDbAccountConnectionString: '@Microsoft.KeyVault(SecretUri=${cosmosDbSecret.properties.secretUri}/)'
    appInsightsKey: appIns.outputs.appInsightsKey
  }
}
