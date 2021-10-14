const { ServiceBusClient } = require("@azure/service-bus");
const connectionString = "Endpoint=sb://challenge8-team3.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=w86Q6Q1BdRjCoxYIeMib2pXvqkcIft4l0U7mGTi772g=";
const topicName = "receipts";

module.exports = async function (context, eventHubMessages) {
    context.log(`JavaScript eventhub trigger function called for message array ${eventHubMessages}`);
    
    context.bindings.outputDocument = [];
    const messages = [];
    
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
            // const msg = {
            //     body: pub,
            //     applicationProperties: [
            //         {totalCost: pub.totalCost}
            //     ],
            //     contentType: "application/json"
            // }
            messages.push(pub);
        }
    });

    // context.done();
    if(messages.length > 0) {
    const sbClient = new ServiceBusClient(connectionString);
    const sender = sbClient.createSender(topicName);
	try {
		// Tries to send all messages in a single batch.
		// Will fail if the messages cannot fit in a batch.
		// await sender.sendMessages(messages);

		// create a batch object
		let batch = await sender.createMessageBatch(); 
		for (let i = 0; i < messages.length; i++) {
			// for each message in the arry			
            const msg = {
                body: messages[i],
                contentType: "application/json"
              };
			// try to add the message to the batch
			if (!batch.tryAddMessage(msg)) {			
				// if it fails to add the message to the current batch
				// send the current batch as it is full
				await sender.sendMessages(batch);

				// then, create a new batch 
				batch = await sender.createMessageBatch();

				// now, add the message failed to be added to the previous batch to this batch
				if (!batch.tryAddMessage(msg)) {
					// if it still can't be added to the batch, the message is probably too big to fit in a batch
					throw new Error("Message too big to fit in a batch");
				}
			}
		}

		// Send the last created batch of messages to the topic
		await sender.sendMessages(batch);

		console.log(`Sent a batch of messages to the topic: ${topicName}`);

		// Close the sender
		await sender.close();
	} finally {
		await sbClient.close();
	}
}

};
