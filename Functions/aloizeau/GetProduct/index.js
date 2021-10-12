module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const productId = (req.query.productId || (req.body && req.body.productId));
    if (req.method === "GET") { responseMessage = "The product name for your product id " + productId + " is Starfruit Explosion" }
    else if (req.method === "POST") { responseMessage = "The product name for your product id " + productId + " is Starfruit Explosion and the description is This starfruit ice cream is out of this world!" }

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}