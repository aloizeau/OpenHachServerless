import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('GetRating function processed a request.');

    let rating = context.bindings.inputDocument;

    if (rating.length === 0) {
        context.res = {
            status: 404,
            body: "No rating"
        };
        return;
    }

    context.res = {
        status: 200,
        body: rating[0],
        headers: {
            'Content-Type': 'application/json'
        }
    };

};

export default httpTrigger;