const { ServiceBusClient } = require("@azure/service-bus");

const connectionString = process.env.SERVICEBUS_CONNECTION_STRING;
const sbClient = new ServiceBusClient(connectionString);

module.exports = async function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);
    
    eventHubMessages.forEach((message, index) => {
        context.log(`Processed message ${message}`);
        context.bindings.outputDocument = {...message, id: message.header.salesNumber};
        if(header.receiptUrl !== null) {
            const pub = {
                "totalItems": message.details.length,
                "totalCost": message.header.totalCost,
                "salesNumber": message.header.salesNumber,
                "salesDate": message.header.dateTime,
                "storeLocation": message.header.locationId,
                "receiptUrl": message.header.receiptUrl
            }
            const sender = sbClient.createSender("receipts");
            await sender.sendMessages(pub);
        }
    });
};