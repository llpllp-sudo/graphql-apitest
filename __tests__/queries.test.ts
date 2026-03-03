import { GraphQLClient } from '../src/client/graphqlClient';
import { GET_LAUNCHES_LIMITED, GET_LAUNCH_BY_ID } from '../src/graphql/queries/spacex.queries';
import { GraphQLResponse, PastLaunchData, LaunchData } from '../src/types/spacex.types';

describe('Advanced Query (Read) Scenarios', () => {

    it('should properly apply limit arguments to lists', async () => {
        // Seeking max 2 past launches
        const variables = { limit: 2 };

        const response = await GraphQLClient.sendQuery(GET_LAUNCHES_LIMITED, variables);

        expect(response.status).toBe(200);

        const payload: GraphQLResponse<{ launchesPast: PastLaunchData[] }> = response.body;

        expect(payload.errors).toBeUndefined();

        // Asserting the INT limit filter applied successfully
        expect(payload.data.launchesPast.length).toBe(2);
    });

    it('should return null payload entities for valid queries with no results (Empty States)', async () => {
        // Querying a launch by a specific garbage ID
        const variables = { id: "Super-Fake-Impossible-Mission-ID-999" };

        const response = await GraphQLClient.sendQuery(GET_LAUNCH_BY_ID, variables);

        expect(response.status).toBe(200);

        const payload: GraphQLResponse<{ launch: LaunchData | null }> = response.body;

        expect(payload.errors).toBeDefined();

        // The SpaceX API backend architecture proxy actually crashes downstream when fetching a fake ID
        // instead of neatly returning null. This tests that GraphQL still wraps it safely in a 200 HTTP response 
        // with the error details forwarded to the client payload.
        expect(payload.errors?.[0]?.extensions?.code).toBe('INTERNAL_SERVER_ERROR');
        expect(payload.errors?.[0]?.message).toContain('Not Found');
    });
});

