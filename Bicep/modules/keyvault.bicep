param name string
param location string = resourceGroup().location

param tenantId string = subscription().tenantId

@allowed([
  'premium'
  'standard'
])
@description('Specifies whether the key vault is a standard vault or a premium vault.')
param sku string

resource kv 'Microsoft.KeyVault/vaults@2021-06-01-preview' = {
  name: name
  location: location
  properties: {
    enabledForDeployment: false
    enabledForTemplateDeployment: false
    enabledForDiskEncryption: false
    enableRbacAuthorization: true
    tenantId: tenantId
    accessPolicies: [ ]
    sku: {
      name: sku
      family: 'A'
    }
  }
}

output keyVaultName string = kv.name

