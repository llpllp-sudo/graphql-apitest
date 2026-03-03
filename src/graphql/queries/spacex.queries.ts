// ---- Original Queries ----
export const GET_COMPANY_INFO = `
  query GetCompanyInfo {
    company {
      name
      ceo
      valuation
    }
  }
`;

export const GET_LAUNCH_BY_ID = `
  query GetLaunchById($id: ID!) {
    launch(id: $id) {
      mission_name
      launch_date_utc
    }
  }
`;

export const GET_ROCKETS_WITH_ENGINES = `
  query GetRocketsWithEngines($limit: Int) {
    rockets(limit: $limit) {
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

// ---- Phase 3: Security & Validation Queries ----

export const GET_UNDEFINED_FIELD = `
    query GetUndefinedField {
        company {
            name
            fake_undefined_field_that_does_not_exist
        }
    }
`;

// Notice $id is INTIONIONALLY missing the '!' making it effectively "forgotten"
export const GET_MISSING_REQUIRED_ARG = `
    query GetLaunchMissingArg {
        launch { 
            mission_name
        }
    }
`;

// ---- Phase 3: Read (Queries) ----

export const GET_LAUNCHES_LIMITED = `
    query GetLaunchesLimited($limit: Int) {
        launchesPast(limit: $limit) {
            mission_name
            launch_year
        }
    }
`;

// ---- Phase 3: Writes (Mutations) ----

export const INSERT_USER_MUTATION = `
    mutation InsertUser($id: uuid!, $name: String!) {
        insert_users(objects: {id: $id, name: $name}) {
            returning {
                id
                name
                timestamp
            }
        }
    }
`;

// ---- Phase 3: Malicious Depth (Security) ----
// This is intentionally trying to crash the server through recursive relationships
export const MASSIVE_DEPTH_QUERY = `
  query MaliciousDepthQuery {
    rockets {
      name
      engines {
        type
      }
    }
    company {
      name
    }
    histories {
      title
      flight {
        mission_name
        rocket {
          rocket_name
        }
      }
    }
  }
`;
