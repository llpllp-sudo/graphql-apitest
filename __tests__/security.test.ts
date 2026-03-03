import { GraphQLClient } from '../src/client/graphqlClient';
import { MASSIVE_DEPTH_QUERY } from '../src/graphql/queries/spacex.queries';

describe('Error Handling and Security Scenarios', () => {

    // Changing standard Jest runtime timeout because depth limiting analysis might take longer to reject
    jest.setTimeout(15000);

    it('should prevent server crashes despite malicious or infinitely deep relational queries (Depth Limiting)', async () => {
        // We intentionally fire a query seeking Rockets -> Engines -> Companies -> Deep Historical Flight Relational Trees
        // A poorly configured API would freeze attempting to resolve this infinite table join.
        const response = await GraphQLClient.sendQuery(MASSIVE_DEPTH_QUERY);

        // Standard HTTP expectation
        expect(response.status).toBe(200);

        // We expect the payload to either correctly resolve without crashing, OR
        // gracefully block us with a "Max Depth Reached" error. The SpaceX API handles this gracefully.

        expect(response.body).toBeDefined();
        // Ensuring it didn't throw an unhandled internal 500 error due to resource exhaustion
    });

    it('should allow partial successes on list queries where one relation fails but others succeed', async () => {
        // We will query two histories. One with a valid ID, one with a fake ID.
        // Unlike REST (which might fail the whole /histories array call), GraphQL should resolve the good one and null the bad one.
        const query = `
            query PartialSuccess {
                company {
                    name
                }
                bad_flight: launch(id: "fake-999") {
                    mission_name
                }
            }
        `;

        const response = await GraphQLClient.sendQuery(query);

        expect(response.status).toBe(200);

        const payload = response.body;

        // Ensure the errors array populated denoting the bad fake-999 ID request failed downstream
        expect(payload.errors).toBeDefined();

        // But the good entity (company) fully resolved across the API boundary anyway!
        expect(payload?.data?.company?.name).toBe('SpaceX');

        // The bad entity gracefully nulled out locally, without crashing the 'company' data return!
        expect(payload?.data?.bad_flight).toBeNull();
    });
});
