const { ServiceBusClient } = require("@azure/service-bus");

const connectionString = "Endpoint=sb://challenge8-team3.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=w86Q6Q1BdRjCoxYIeMib2pXvqkcIft4l0U7mGTi772g="
const topicName = "receipts";

module.exports = async function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);
    
    const sbClient = new ServiceBusClient(connectionString);
    const sender = sbClient.createSender(topicName);

    context.bindings.outputDocument = [];
    context.bindings.outputSbTopic = [];

    eventHubMessages.forEach((message, index) => {
        context.log(`Processed message ${JSON.stringify(message)}`);
        
        context.bindings.outputDocument.push({...message, id: message.header.salesNumber});
        try {
        if(message.header.receiptUrl !== null) {
            const pub = {
                "totalItems": message.details.length,
                "totalCost": parseFloat(message.header.totalCost),
                "salesNumber": message.header.salesNumber,
                "salesDate": message.header.dateTime,
                "storeLocation": message.header.locationId,
                "receiptUrl": message.header.receiptUrl
            }
            const msg = {
                body: JSON.stringify(pub),
                applicationProperties: {
                    totalCost: pub.totalCost
                }
            }
            await sender.sendMessages(msg);
        }
        }
        finally {
            await sender.close();
            await sbClient.close();
        }
    });

    context.done();
};
