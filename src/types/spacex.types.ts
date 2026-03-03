// Explicit Error Typing for robust assertion validation
export interface GraphQLError {
    message: string;
    locations?: { line: number, column: number }[];
    path?: string[];
    extensions?: any;
}

export interface GraphQLResponse<T> {
    data: T;
    errors?: GraphQLError[];
}

/**
 * Domain-Specific TypeScript Typings for the SpaceX API
 */

export interface CompanyData {
    name: string;
    ceo: string;
    valuation: number;
}

export interface LaunchData {
    mission_name: string;
    launch_date_utc: string;
}

export interface ThrustSeaLevel {
    kN: number;
}

export interface EngineData {
    type: string;
    thrust_sea_level: ThrustSeaLevel;
}

export interface RocketData {
    name: string;
    active: boolean;
    engines: EngineData;
}

export interface PastLaunchData {
    mission_name: string;
    launch_year: string;
}

export interface UserMutationResponse {
    returning: {
        id: string;
        name: string;
        timestamp: string;
    }[]
}
