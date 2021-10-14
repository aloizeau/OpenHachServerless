param name string = 'challenge8-team3'
param topicName string = 'receipts'
param location string = resourceGroup().location

resource sb 'Microsoft.ServiceBus/namespaces@2021-06-01-preview' = {
  name: name
  location: location
  sku: {
    name: 'Premium'
  }
  properties: {
    zoneRedundant: true
  }
  resource topic 'topics@2021-06-01-preview' = {
    name: topicName
    properties: {
      enableBatchedOperations: true
    }
    resource subge100 'subscriptions@2021-06-01-preview' = {
      name: 'subge100'
      properties: {
        
      }
      resource ge100 'rules@2021-06-01-preview' = {
        name: 'ge100'
        properties: {
          sqlFilter: {
            sqlExpression: 'totalCost >= 100'
          }
        }
      }
    }
    resource sublt100 'subscriptions@2021-06-01-preview' = {
      name: 'sublt100'
      properties: {
        
      }
      resource lt100 'rules@2021-06-01-preview' = {
        name: 'lt100'
        properties: {
          sqlFilter: {
            sqlExpression: 'totalCost < 100'
          }
        }
      }
    }
  }
}
