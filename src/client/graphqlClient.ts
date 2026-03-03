import request from 'supertest';
import { ENV } from '../../config/env';

export class GraphQLClient {
    /**
     * Reusable GraphQL HTTP Client.
     * Prevents duplication of setting headers, constructing the base URL, 
     * and configuring expected JSON responses.
     */
    static async sendQuery(query: string, variables?: any) {
        return request(ENV.GRAPHQL_BASE_URL)
            .post('/')
            .set('Content-Type', 'application/json')
            .send({ query, variables });
    }
}
