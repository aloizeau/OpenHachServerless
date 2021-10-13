const { v4: uuidv4 } = require('uuid');
const { checkUser, checkProduct } = require('./checker')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const body = { ...req.body, id: uuidv4(), timestamp:new Date().toISOString() };
    const { userId, productId } = body;

    if (!await checkUser(userId)) {
        context.res = {
            status: 404, /* Defaults to 200 */
            body: "User not existing"
        };
        return;
    }
    if (!await checkProduct(productId)) {
        context.res = {
            status: 404, /* Defaults to 200 */
            body: "Product not existing"
        };
        return;
    }

    const resultAsString = JSON.stringify(body)
    context.bindings.outputDocument = resultAsString
    context.res = {
        status: 201, /* Defaults to 200 */
        body: resultAsString
    };
}