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
            context.bindings.outputSbTopic.push(pub)
        }
        context.done()
    });
};