@description('Name of Application Insights resource.')
param name string

@description('The location where the app insights will reside in.')
param location string = resourceGroup().location

resource appIns 'Microsoft.Insights/components@2020-02-02' = {
  name: name
  kind: 'web'
  location: location
  properties: {
    Application_Type: 'web'
  }
}

output appInsightsKey string = appIns.properties.InstrumentationKey
