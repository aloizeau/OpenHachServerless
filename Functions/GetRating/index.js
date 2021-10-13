module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const ratings = context.bindings.inputDocument;

    if (ratings.length === 0) {
        context.res = {
            status: 404,
            body: "Rating does not exist"
        };
        return;
    }

    context.res = {
        status: 200, /* Defaults to 200 */
        body: ratings[0],
        headers: {
            'Content-Type': 'application/json'
        }
    };
}