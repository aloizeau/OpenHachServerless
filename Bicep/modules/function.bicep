param location string = resourceGroup().location
param functionAppName string
param planName string


resource functionAppResource 'Microsoft.Web/sites@2021-01-15' = {
  name: functionAppName
  identity: {
    type: 'SystemAssigned'
  }
  location: location
  kind: 'functionapp'
  properties: {
    serverFarmId: planName
    siteConfig: {
      minTlsVersion: '1.2'
      scmMinTlsVersion: '1.2'
    }
  }
}

output prodFunctionAppName string = functionAppResource.name
output productionTenantId string = functionAppResource.identity.tenantId
output productionPrincipalId string = functionAppResource.identity.principalId
