param name string
param location string = resourceGroup().location
@allowed([
  'Y1'
  'EP1'
  'EP2'
  'EP3'  
])
@description('The name of the SKU to use when creating the Azure Functions plan. Common SKUs include Y1 (consumption) and EP1, EP2, and EP3 (premium).')
param sku string = 'EP1'

var kind = sku ==  'Y1' ?  'functionapp' : 'elastic'


resource asp 'Microsoft.Web/serverfarms@2021-01-15' = {
  name: name
  location: location
  kind: kind
  sku: {
    name: sku
  }
}

output id string = asp.id
