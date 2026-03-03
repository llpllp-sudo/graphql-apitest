

# Hands-On Project: Mastering GraphQL API Testing for Acorns SDET Role

**Target Audience:** Liping Liu (Bridging the gap from REST to GraphQL)
**Target Role:** Quality Assurance Engineer II (Banking) at Acorns
**Goal:** Build practical, demonstrable experience writing automated tests for a GraphQL API using TypeScript, aligning perfectly with Acorns' Tech Stack.

---

## Part 1: Context - The "Why" of GraphQL

In your interview, Acorns will want to know that you understand *why* they use GraphQL and how testing it differs fundamentally from REST.

**REST vs. GraphQL Paradigm Shift:**
*   **REST:** Multiple endpoints (`/users`, `/accounts`, `/transactions`). You test each endpoint's status codes (200, 404, 500) and strict JSON responses.
*   **GraphQL:** A *single* endpoint (usually `/graphql`). The client dictates exactly what data it wants. It almost always returns an HTTP 200 status code, even if there are data errors!

**Key Testing Challenges to Speak To:**
1.  **Partial Failures:** A query might ask for a `User` and their `BankingActivity`. The `User` data might resolve perfectly, but the `BankingActivity` service might fail. The overall response is still a 200 OK, but the JSON contains a `"data"` object *and* an `"errors"` array. You must test for these partial failures.
2.  **Deeply Nested Queries:** Malicious or poorly designed queries can request data so deep it crashes the server. (e.g., User -> Accounts -> Transactions -> User -> Accounts...). You must test query depth limits.
3.  **Mutations vs. Queries:** Queries fetch data (like GET). Mutations change data (like POST/PUT/DELETE).

---

## Part 2: The Hands-On Environment Setup

We will use the **SpaceX GraphQL API** (it's free, public, and requires no auth) to simulate a complex, nested data structure similar to what a banking app might have. We will use **TypeScript** and **Jest** (industry standard, highly relevant to Acorns).

### 1. Initialize the Project
Open your terminal and create a new directory:
```bash
mkdir graphql-automation-acorns
cd graphql-automation-acorns
npm init -y
```

### 2. Install Dependencies
Install TypeScript, Jest (for the test framework), Supertest (for making HTTP calls), and their type definitions:
```bash
npm install --save-dev typescript jest ts-jest @types/jest supertest @types/supertest
```

### 3. Configure TypeScript and Jest
Initialize the TS config:
```bash
npx tsc --init
```
Initialize the Jest config:
```bash
npx ts-jest config:init
```

Update your `package.json` to have a test script:
```json
"scripts": {
  "test": "jest"
}
```

---

## Part 3: Writing the Tests (The "Code" Portion)

Create a folder named `__tests__` and a file inside it named `spacex.graphql.test.ts`.

### Test 1: A Basic Query (The "Happy Path")
*Scenario: We want to fetch company information, but ONLY the specific fields we need.*

```typescript
import request from 'supertest';

const GRAPHQL_URL = 'https://spacex-production.up.railway.app/';

describe('GraphQL API Testing - SpaceX', () => {

    it('should fetch specific company data successfully', async () => {
        // 1. Define the exact shape of the data we want
        const query = `
          query {
            company {
              name
              ceo
              valuation
            }
          }
        `;

        // 2. Send the request to the single /graphql endpoint
        const response = await request(GRAPHQL_URL)
            .post('/')
            .send({ query });

        // 3. Assertions
        expect(response.status).toBe(200);
        
        // In GraphQL, the payload is always wrapped in a "data" object
        const data = response.body.data.company;
        
        expect(data.name).toBe('SpaceX');
        expect(data.ceo).toBe('Elon Musk');
        expect(data).toHaveProperty('valuation');
        
        // Ensure no hidden errors occurred
        expect(response.body.errors).toBeUndefined();
    });
});
```

### Test 2: Testing Partial/Expected Errors
*Scenario: What happens when we query for an ID that doesn't exist? In REST, this is a 404. In GraphQL, it's often a 200 with an error object.*

```typescript
    it('should handle querying a non-existent ID gracefully', async () => {
        // Querying a launch that doesn't exist
        const query = `
          query {
            launch(id: "fake-id-12345") {
              mission_name
              launch_date_utc
            }
          }
        `;

        const response = await request(GRAPHQL_URL)
            .post('/')
            .send({ query });

        // Notice: The HTTP status is STILL 200!
        expect(response.status).toBe(200);

        // But the data payload for 'launch' should be null
        expect(response.body.data.launch).toBeNull();
    });
```

### Test 3: Complex Nested Data (The banking equivalent of loading a dashboard)
*Scenario: Testing that the resolvers can handle multiple relationships (e.g., A rocket, and that rocket's specific engines).*

```typescript
    it('should validate deeply nested data structures', async () => {
        const query = `
          query {
            rockets(limit: 1) {
              name
              active
              engines {
                type
                thrust_sea_level {
                  kN
                }
              }
            }
          }
        `;

        const response = await request(GRAPHQL_URL)
            .post('/')
            .send({ query });

        expect(response.status).toBe(200);
        expect(response.body.errors).toBeUndefined();

        const rockets = response.body.data.rockets;
        expect(rockets.length).toBeGreaterThan(0);
        
        // Validate the nested engine data resolved correctly
        expect(rockets[0].engines).toHaveProperty('type');
        expect(rockets[0].engines.thrust_sea_level.kN).toBeGreaterThan(0);
    });
```

---

## Part 4: Run the Tests
In your terminal, run:
```bash
npm test
```

## Part 5: Interview Talking Points (How to frame this experience)

When Acorns asks about your API framework/TypeScript experience, you can now confidently say:

> *"At Visa, I spearheaded our heavy backend REST automation using Java and RestAssured. However, knowing Acorns heavily utilizes TypeScript and GraphQL, I wanted to ensure I was strictly aligned with your paradigm. I recently spent time architecting a TypeScript/Jest framework targeting GraphQL endpoints. It really reinforced my approach to testing partial failures where the HTTP status remains 200 but the 'errors' array populates, and ensuring query depth validations are in place—which is critical for financial apps to prevent resource exhaustion."*

### Why this works:
1. **It's proactive.** You identified a gap and immediately built a POC to close it.
2. **It uses their language.** You are speaking in `TypeScript`, `Jest`, `Partial Failures`, and `Mutations`.
3. **It bridges your past.** It seamlessly connects your massive Visa API experience to their specific implementation.
