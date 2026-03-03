import { GraphQLClient } from '../src/client/graphqlClient';
import {
    GET_COMPANY_INFO,
    GET_LAUNCH_BY_ID,
    GET_ROCKETS_WITH_ENGINES
} from '../src/graphql/queries/spacex.queries';

import {
    GraphQLResponse,
    CompanyData,
    LaunchData,
    RocketData
} from '../src/types/spacex.types';

describe('GraphQL API Testing - Enterprise Architecture', () => {

    it('should fetch specific company data successfully', async () => {
        // 1. Send query using the centralized client
        const response = await GraphQLClient.sendQuery(GET_COMPANY_INFO);
        expect(response.status).toBe(200);

        // 2. Strongly typed payload casting provides autocomplete and IDE safety
        const payload: GraphQLResponse<{ company: CompanyData }> = response.body;

        // 3. Assertions
        expect(payload.data.company.name).toBe('SpaceX');
        expect(payload.data.company.ceo).toBe('Elon Musk');
        expect(payload.data.company).toHaveProperty('valuation');

        // Ensure no hidden GraphQL processing errors occurred
        expect(payload.errors).toBeUndefined();
    });

    it('should handle querying a non-existent ID gracefully', async () => {
        // This query requires a "variables" object parameter
        const variables = { id: "fake-id-12345" };

        const response = await GraphQLClient.sendQuery(GET_LAUNCH_BY_ID, variables);

        // HTTP status is still 200 OK because the server processed the request
        expect(response.status).toBe(200);

        const payload: GraphQLResponse<{ launch: LaunchData | null }> = response.body;

        // The data resolver safely returns null instead of crashing
        expect(payload.data.launch).toBeNull();
    });

    it('should validate deeply nested data structures', async () => {
        const variables = { limit: 1 };

        const response = await GraphQLClient.sendQuery(GET_ROCKETS_WITH_ENGINES, variables);

        expect(response.status).toBe(200);

        const payload: GraphQLResponse<{ rockets: RocketData[] }> = response.body;

        expect(payload.errors).toBeUndefined();
        expect(payload.data.rockets.length).toBeGreaterThan(0);

        const firstRocket = payload.data.rockets[0];

        // Validating the deeply nested structure resolved correctly based on our TypeScript interface
        expect(firstRocket?.engines?.type).toBeDefined();
        expect(firstRocket?.engines?.thrust_sea_level?.kN).toBeGreaterThan(0);
    });
});
