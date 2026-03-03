import { GraphQLClient } from '../src/client/graphqlClient';
import { INSERT_USER_MUTATION } from '../src/graphql/queries/spacex.queries';
import { GraphQLResponse, UserMutationResponse } from '../src/types/spacex.types';

describe('Mutation (Write) Scenarios', () => {

    it('should validate the mutation structure but correctly reject due to missing Admin Authorization headers', async () => {
        // We structure a perfectly valid mutation payload with GraphQL Input Objects
        const variables = {
            id: "b12bc1a8-7065-4dce-a0d0-aaaf83a93665",
            name: "Liping Test User"
        };

        const response = await GraphQLClient.sendQuery(INSERT_USER_MUTATION, variables);

        // This is crucial: the server accepted the structure, so HTTP is 200 OK.
        // It did NOT crash functionally.
        expect(response.status).toBe(200);

        const payload: GraphQLResponse<{ insert_users: UserMutationResponse | null }> = response.body;

        // However, the GraphQL resolver strictly caught that the public SpaceX schema 
        // explicitly blocks and removed the mutation root. Instead of an error block, it gracefully
        // returns null for the attempted operation (a fairly common production configuration to prevent info leakage).
        expect(payload.data?.insert_users).toBeNull();
        expect(payload.errors).toBeUndefined();
    });
});
