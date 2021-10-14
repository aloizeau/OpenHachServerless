module.exports = async function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);
    
    context.bindings.outputDocument = [];
    context.bindings.outputSbTopic = [];
    
    eventHubMessages.forEach((message, index) => {
        context.log(`Processed message ${JSON.stringify(message)}`);
        
        context.bindings.outputDocument.push({...message, id: message.header.salesNumber});
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
            context.bindings.outputSbTopic.push(msg);
        }
    });

    context.done();
};
