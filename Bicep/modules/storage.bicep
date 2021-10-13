param name string
param location string = resourceGroup().location

@allowed([
  'Standard_LRS'
  'Standard_GRS'
])
param sku string
param kind string = 'StorageV2'

resource stg 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: name
  location: location
  kind: kind
  sku: {
    name: sku
  }
  properties: {
    minimumTlsVersion: 'TLS1_2'
  }
}

output storageAccountConnectionString string = 'DefaultEndpointsProtocol=https;AccountName=${name};AccountKey=${listKeys(resourceId(resourceGroup().name, 'Microsoft.Storage/storageAccounts', name), '2019-04-01').keys[0].value};EndpointSuffix=${environment().suffixes.storage}'
output storageAccountName string = stg.name
