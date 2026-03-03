import { GraphQLClient } from '../src/client/graphqlClient';
import { GET_UNDEFINED_FIELD, GET_MISSING_REQUIRED_ARG } from '../src/graphql/queries/spacex.queries';

describe('Schema & Validation Testing', () => {

    it('should reject querying a field that does not exist in the schema', async () => {
        const response = await GraphQLClient.sendQuery(GET_UNDEFINED_FIELD);

        // The API returns a 400 Bad Request because the query is structurally invalid 
        // before it even attempts to resolve data.
        expect(response.status).toBe(400);

        // Assert the "errors" array specifically caught the validation failure
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toContain('Cannot query field "fake_undefined_field_that_does_not_exist"');
    });

    it('should reject a query if a required argument is structurally missing', async () => {
        // We omit the ID arg the schema expects
        const response = await GraphQLClient.sendQuery(GET_MISSING_REQUIRED_ARG);

        // Validation error before execution
        expect(response.status).toBe(400);

        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toContain('Field "launch" argument "id" of type "ID!" is required');
    });

    it('should gracefully reject type-mismatch arguments (Type Safety)', async () => {
        // The SpaceX past launches query explicitly expects an INT limit. 
        // We will purposely send a STRING.
        const query = `
            query GetPastLaunches($limit: Int) {
                launchesPast(limit: $limit) {
                    mission_name
                }
            }
        `;
        const variables = { limit: "this-is-a-string-not-an-int" };

        const response = await GraphQLClient.sendQuery(query, variables);

        // Unlike REST which might 400 immediately, GraphQL gracefully parses the request
        // realizes the types are violated, and returns a 200 OK containing an errors array detailing the mismatch.
        expect(response.status).toBe(200);
        expect(response.body.errors).toBeDefined();
        // Assert GraphQL caught the Int vs String violation
        expect(response.body.errors[0].message).toContain('Int cannot represent non-integer value');
    });
});
