az login
az group create --location westeurope --resource-group <your-rg>
az deployment group create --resource-group <your-rg> --template-file main.bicep
