import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function tenableApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject | IDataObject[]> {
	const credentials = await this.getCredentials('tenableApi');

	const options: IHttpRequestOptions = {
		method,
		url: `${credentials.baseUrl}${endpoint}`,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
		},
		qs,
		body,
		json: true,
	};

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	if (Object.keys(qs).length === 0) {
		delete options.qs;
	}

	try {
		const response = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'tenableApi',
			options,
		);
		return response as IDataObject | IDataObject[];
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

export async function tenableApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	propertyName: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let responseData: IDataObject;
	let offset = 0;
	const limit = 100;

	do {
		qs.offset = offset;
		qs.limit = limit;

		responseData = (await tenableApiRequest.call(this, method, endpoint, body, qs)) as IDataObject;

		const items = responseData[propertyName] as IDataObject[];
		if (items) {
			returnData.push(...items);
		}

		offset += limit;
	} while (
		responseData[propertyName] &&
		(responseData[propertyName] as IDataObject[]).length === limit
	);

	return returnData;
}

export function validateJSON(json: string | undefined): IDataObject | undefined {
	if (json === undefined || json === '') {
		return undefined;
	}
	try {
		return JSON.parse(json) as IDataObject;
	} catch {
		return undefined;
	}
}
