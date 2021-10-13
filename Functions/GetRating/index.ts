import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('GetRating function processed a request.');

    let ratings = context.bindings.inputDocument;

    if (ratings.length === 0) {
        context.res = {
            status: 404,
            body: "No ratings"
        };
        return;
    }
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: context.bindings.inputDocument,
        headers: {
            'Content-Type': 'application/json'
        }
    };

};

export default httpTrigger;