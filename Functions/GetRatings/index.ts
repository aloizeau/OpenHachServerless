import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('GetRatings function processed a request.');
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: context.bindings.inputDocument,
        headers: {
            'Content-Type': 'application/json'
        }
    };

};

export default httpTrigger;