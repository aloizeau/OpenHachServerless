module.exports = async function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);
    
    context.bindings.outputDocument = [];
    const messages = [];
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
            messages.push(pub);
        }
    });

    for (let i = 0; i < messages.length; i++) {
        // for each message in the array			
        const msg = {
            body: messages[i],  
            applicationProperties:
             {
                 totalCost: messages[i]["totalCost"]
             },
            contentType: "application/json"
          };
        context.bindings.outputSbTopic.push(msg);
    }

    context.done();
};
