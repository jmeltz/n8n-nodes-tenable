import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { tenableApiRequest, validateJSON } from './GenericFunctions';

export class TenableOne implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tenable One',
		name: 'tenableOne',
		icon: 'file:tenable.png',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Tenable One Exposure Management API',
		defaults: {
			name: 'Tenable One',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'tenableApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Attack Path',
						value: 'attackPath',
					},
					{
						name: 'Exposure View',
						value: 'exposureView',
					},
					{
						name: 'Inventory',
						value: 'inventory',
					},
					{
						name: 'Inventory Export',
						value: 'inventoryExport',
					},
					{
						name: 'Tag',
						value: 'tag',
					},
				],
				default: 'inventory',
			},

			// ----------------------------------
			//         Attack Path
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['attackPath'],
					},
				},
				options: [
					{
						name: 'Search Attack Paths',
						value: 'searchAttackPaths',
						description: 'Search for top attack paths',
						action: 'Search attack paths',
					},
					{
						name: 'Search Attack Techniques',
						value: 'searchAttackTechniques',
						description: 'Search for top attack techniques',
						action: 'Search attack techniques',
					},
				],
				default: 'searchAttackPaths',
			},

			// ----------------------------------
			//         Exposure View
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['exposureView'],
					},
				},
				options: [
					{
						name: 'Get Card',
						value: 'getCard',
						description: 'Get a specific exposure view card',
						action: 'Get a card',
					},
					{
						name: 'Get Cards',
						value: 'getCards',
						description: 'Get all exposure view cards',
						action: 'Get all cards',
					},
				],
				default: 'getCards',
			},

			// ----------------------------------
			//         Inventory
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['inventory'],
					},
				},
				options: [
					{
						name: 'Get Asset Properties',
						value: 'getAssetProperties',
						description: 'Get available asset properties for filtering',
						action: 'Get asset properties',
					},
					{
						name: 'Get Finding Properties',
						value: 'getFindingProperties',
						description: 'Get available finding properties for filtering',
						action: 'Get finding properties',
					},
					{
						name: 'Get Software Properties',
						value: 'getSoftwareProperties',
						description: 'Get available software properties for filtering',
						action: 'Get software properties',
					},
					{
						name: 'Search Assets',
						value: 'searchAssets',
						description: 'Search for assets',
						action: 'Search assets',
					},
					{
						name: 'Search Findings',
						value: 'searchFindings',
						description: 'Search for findings',
						action: 'Search findings',
					},
					{
						name: 'Search Software',
						value: 'searchSoftware',
						description: 'Search for software',
						action: 'Search software',
					},
				],
				default: 'searchAssets',
			},

			// ----------------------------------
			//         Inventory Export
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['inventoryExport'],
					},
				},
				options: [
					{
						name: 'Download Chunk',
						value: 'downloadChunk',
						description: 'Download an export chunk',
						action: 'Download an export chunk',
					},
					{
						name: 'Get Export Status',
						value: 'getExportStatus',
						description: 'Get status of a specific export',
						action: 'Get export status',
					},
					{
						name: 'Get Status',
						value: 'getStatus',
						description: 'Get status of asset or finding exports',
						action: 'Get status',
					},
					{
						name: 'Start Assets Export',
						value: 'startAssetsExport',
						description: 'Start an assets export',
						action: 'Start an assets export',
					},
					{
						name: 'Start Findings Export',
						value: 'startFindingsExport',
						description: 'Start a findings export',
						action: 'Start a findings export',
					},
				],
				default: 'startAssetsExport',
			},

			// ----------------------------------
			//         Tag
			// ----------------------------------
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['tag'],
					},
				},
				options: [
					{
						name: 'Get Properties',
						value: 'getProperties',
						description: 'Get available tag properties for filtering',
						action: 'Get tag properties',
					},
					{
						name: 'Search',
						value: 'search',
						description: 'Search for tags',
						action: 'Search tags',
					},
				],
				default: 'search',
			},

			// ----------------------------------
			//         Fields
			// ----------------------------------

			// Card ID for Exposure View
			{
				displayName: 'Card ID',
				name: 'cardId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['exposureView'],
						operation: ['getCard'],
					},
				},
				default: '',
				description: 'The ID of the exposure view card',
			},

			// Search Query Mode
			{
				displayName: 'Query Mode',
				name: 'queryMode',
				type: 'options',
				options: [
					{ name: 'Simple', value: 'simple' },
					{ name: 'Advanced', value: 'advanced' },
				],
				displayOptions: {
					show: {
						resource: ['inventory', 'tag'],
						operation: ['searchAssets', 'searchFindings', 'searchSoftware', 'search'],
					},
				},
				default: 'simple',
				description: 'The search mode to use',
			},

			// Search Query Text
			{
				displayName: 'Search Query',
				name: 'queryText',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['inventory', 'tag'],
						operation: ['searchAssets', 'searchFindings', 'searchSoftware', 'search'],
					},
				},
				default: '',
				description: 'The search query text. For simple mode: asset name or ID. For advanced mode: query string (e.g., "Assets HAS sources = CLOUD").',
			},

			// Search Filters
			{
				displayName: 'Filters (JSON)',
				name: 'filters',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['inventory', 'tag', 'attackPath'],
						operation: [
							'searchAssets',
							'searchFindings',
							'searchSoftware',
							'search',
							'searchAttackPaths',
							'searchAttackTechniques',
						],
					},
				},
				default: '',
				description: 'JSON array of filter objects. Each filter has "property", "operator", and "value" fields.',
			},

			// Pagination Options
			{
				displayName: 'Options',
				name: 'searchOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				displayOptions: {
					show: {
						resource: ['inventory', 'tag', 'attackPath'],
						operation: [
							'searchAssets',
							'searchFindings',
							'searchSoftware',
							'search',
							'searchAttackPaths',
							'searchAttackTechniques',
						],
					},
				},
				options: [
					{
						displayName: 'Extra Properties',
						name: 'extra_properties',
						type: 'string',
						default: '',
						description: 'Comma-separated list of extra properties to include',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						typeOptions: {
							minValue: 1,
							maxValue: 1000,
						},
						default: 100,
						description: 'Max number of results to return',
					},
					{
						displayName: 'Offset',
						name: 'offset',
						type: 'number',
						default: 0,
						description: 'Starting record to retrieve',
					},
					{
						displayName: 'Sort',
						name: 'sort',
						type: 'string',
						default: '',
						description: 'Sort results by property:direction (e.g., "aes:desc")',
					},
				],
			},

			// Export fields
			{
				displayName: 'Export Format',
				name: 'exportFormat',
				type: 'options',
				options: [
					{ name: 'JSON', value: 'json' },
					{ name: 'CSV', value: 'csv' },
				],
				displayOptions: {
					show: {
						resource: ['inventoryExport'],
						operation: ['startAssetsExport', 'startFindingsExport'],
					},
				},
				default: 'json',
				description: 'The format for the export',
			},

			// Export Query
			{
				displayName: 'Query (JSON)',
				name: 'exportQuery',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['inventoryExport'],
						operation: ['startAssetsExport', 'startFindingsExport'],
					},
				},
				default: '',
				description: 'JSON object with mode and text for the export query',
			},

			// Export Filters
			{
				displayName: 'Filters (JSON)',
				name: 'exportFilters',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['inventoryExport'],
						operation: ['startAssetsExport', 'startFindingsExport'],
					},
				},
				default: '',
				description: 'JSON array of filter objects for the export',
			},

			// Export Status Type
			{
				displayName: 'Export Type',
				name: 'exportStatusType',
				type: 'options',
				options: [
					{ name: 'Assets', value: 'assets' },
					{ name: 'Findings', value: 'findings' },
				],
				required: true,
				displayOptions: {
					show: {
						resource: ['inventoryExport'],
						operation: ['getStatus'],
					},
				},
				default: 'assets',
				description: 'The type of export to check status for',
			},

			// Export ID
			{
				displayName: 'Export ID',
				name: 'exportId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['inventoryExport'],
						operation: ['getExportStatus', 'downloadChunk'],
					},
				},
				default: '',
				description: 'The ID of the export',
			},

			// Chunk ID
			{
				displayName: 'Chunk ID',
				name: 'chunkId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['inventoryExport'],
						operation: ['downloadChunk'],
					},
				},
				default: '',
				description: 'The ID of the chunk to download',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[] = {};

				// ----------------------------------
				//         Attack Path Operations
				// ----------------------------------
				if (resource === 'attackPath') {
					const body: IDataObject = {};
					const options = this.getNodeParameter('searchOptions', i) as IDataObject;

					const filtersJson = String(this.getNodeParameter('filters', i) || '');
					if (filtersJson) {
						const filters = validateJSON(filtersJson);
						if (filters) {
							body.filters = filters;
						}
					}

					const qs: IDataObject = {};
					if (options.limit) qs.limit = options.limit;
					if (options.offset) qs.offset = options.offset;
					if (options.sort) qs.sort = options.sort;

					if (operation === 'searchAttackPaths') {
						responseData = (await tenableApiRequest.call(
							this,
							'POST',
							'/api/v1/t1/apa/top-attack-paths/search',
							body,
							qs,
						)) as IDataObject;
					}

					if (operation === 'searchAttackTechniques') {
						responseData = (await tenableApiRequest.call(
							this,
							'POST',
							'/api/v1/t1/apa/top-attack-techniques/search',
							body,
							qs,
						)) as IDataObject;
					}
				}

				// ----------------------------------
				//         Exposure View Operations
				// ----------------------------------
				if (resource === 'exposureView') {
					if (operation === 'getCards') {
						responseData = (await tenableApiRequest.call(
							this,
							'GET',
							'/api/v1/t1/exposure-view/cards',
						)) as IDataObject;
					}

					if (operation === 'getCard') {
						const cardId = this.getNodeParameter('cardId', i) as string;
						responseData = (await tenableApiRequest.call(
							this,
							'GET',
							`/api/v1/t1/exposure-view/cards/${cardId}`,
						)) as IDataObject;
					}
				}

				// ----------------------------------
				//         Inventory Operations
				// ----------------------------------
				if (resource === 'inventory') {
					if (operation === 'getAssetProperties') {
						responseData = (await tenableApiRequest.call(
							this,
							'GET',
							'/api/v1/t1/inventory/assets/properties',
						)) as IDataObject;
					}

					if (operation === 'getFindingProperties') {
						responseData = (await tenableApiRequest.call(
							this,
							'GET',
							'/api/v1/t1/inventory/findings/properties',
						)) as IDataObject;
					}

					if (operation === 'getSoftwareProperties') {
						responseData = (await tenableApiRequest.call(
							this,
							'GET',
							'/api/v1/t1/inventory/software/properties',
						)) as IDataObject;
					}

					if (
						operation === 'searchAssets' ||
						operation === 'searchFindings' ||
						operation === 'searchSoftware'
					) {
						const queryMode = this.getNodeParameter('queryMode', i) as string;
						const queryText = this.getNodeParameter('queryText', i) as string;
						const filtersJson = String(this.getNodeParameter('filters', i) || '');
						const options = this.getNodeParameter('searchOptions', i) as IDataObject;

						const body: IDataObject = {};

						if (queryText) {
							body.query = {
								mode: queryMode,
								text: queryText,
							};
						}

						if (filtersJson) {
							const filters = validateJSON(filtersJson);
							if (filters) {
								body.filters = filters;
							}
						}

						const qs: IDataObject = {};
						if (options.limit) qs.limit = options.limit;
						if (options.offset) qs.offset = options.offset;
						if (options.sort) qs.sort = options.sort;
						if (options.extra_properties) qs.extra_properties = options.extra_properties;

						let endpoint = '/api/v1/t1/inventory/assets/search';
						if (operation === 'searchFindings') {
							endpoint = '/api/v1/t1/inventory/findings/search';
						} else if (operation === 'searchSoftware') {
							endpoint = '/api/v1/t1/inventory/software/search';
						}

						responseData = (await tenableApiRequest.call(
							this,
							'POST',
							endpoint,
							body,
							qs,
						)) as IDataObject;
					}
				}

				// ----------------------------------
				//         Inventory Export Operations
				// ----------------------------------
				if (resource === 'inventoryExport') {
					if (operation === 'startAssetsExport' || operation === 'startFindingsExport') {
						const format = this.getNodeParameter('exportFormat', i) as string;
						const queryJson = this.getNodeParameter('exportQuery', i) as string;
						const filtersJson = this.getNodeParameter('exportFilters', i) as string;

						const body: IDataObject = {
							format,
						};

						if (queryJson) {
							const query = validateJSON(queryJson);
							if (query) {
								body.query = query;
							}
						}

						if (filtersJson) {
							const filters = validateJSON(filtersJson);
							if (filters) {
								body.filters = filters;
							}
						}

						const endpoint =
							operation === 'startAssetsExport'
								? '/api/v1/t1/inventory/export/assets'
								: '/api/v1/t1/inventory/export/findings';

						responseData = (await tenableApiRequest.call(
							this,
							'POST',
							endpoint,
							body,
						)) as IDataObject;
					}

					if (operation === 'getStatus') {
						const exportType = this.getNodeParameter('exportStatusType', i) as string;
						responseData = (await tenableApiRequest.call(
							this,
							'GET',
							`/api/v1/t1/inventory/export/${exportType}/status`,
						)) as IDataObject;
					}

					if (operation === 'getExportStatus') {
						const exportId = this.getNodeParameter('exportId', i) as string;
						responseData = (await tenableApiRequest.call(
							this,
							'GET',
							`/api/v1/t1/inventory/export/${exportId}/status`,
						)) as IDataObject;
					}

					if (operation === 'downloadChunk') {
						const exportId = this.getNodeParameter('exportId', i) as string;
						const chunkId = this.getNodeParameter('chunkId', i) as string;
						responseData = (await tenableApiRequest.call(
							this,
							'GET',
							`/api/v1/t1/inventory/export/${exportId}/download/${chunkId}`,
						)) as IDataObject;
					}
				}

				// ----------------------------------
				//         Tag Operations
				// ----------------------------------
				if (resource === 'tag') {
					if (operation === 'getProperties') {
						responseData = (await tenableApiRequest.call(
							this,
							'GET',
							'/api/v1/t1/tags/properties',
						)) as IDataObject;
					}

					if (operation === 'search') {
						const queryMode = this.getNodeParameter('queryMode', i) as string;
						const queryText = this.getNodeParameter('queryText', i) as string;
						const filtersJson = String(this.getNodeParameter('filters', i) || '');
						const options = this.getNodeParameter('searchOptions', i) as IDataObject;

						const body: IDataObject = {};

						if (queryText) {
							body.query = {
								mode: queryMode,
								text: queryText,
							};
						}

						if (filtersJson) {
							const filters = validateJSON(filtersJson);
							if (filters) {
								body.filters = filters;
							}
						}

						const qs: IDataObject = {};
						if (options.limit) qs.limit = options.limit;
						if (options.offset) qs.offset = options.offset;
						if (options.sort) qs.sort = options.sort;

						responseData = (await tenableApiRequest.call(
							this,
							'POST',
							'/api/v1/t1/tags/search',
							body,
							qs,
						)) as IDataObject;
					}
				}

				const dataArray = Array.isArray(responseData) ? responseData : [responseData];
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(dataArray),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
