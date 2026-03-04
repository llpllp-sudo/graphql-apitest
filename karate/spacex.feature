Feature: SpaceX GraphQL API Tests
  Verify the core queries of the SpaceX GraphQL API

Background:
  * url 'https://spacex-production.up.railway.app/graphql'

Scenario: Verify basic company information query
  * text query =
  """
  query {
    company {
      name
      founder
      founded
      employees
    }
  }
  """
  And request { query: '#(query)' }
  When method POST
  Then status 200
  And match response.data.company.name == 'SpaceY'
  And match response.data.company.founder == 'Elon Musk'
  And match response.data.company.founded == 2002
  And match response.data.company.employees == '#number'

Scenario: Verify error handling for invalid fields
  * text query =
  """
  query {
    company {
      invalidField
    }
  }
  """
  Given request { query: '#(query)' }
  When method POST
  Then status 400
  # Note: A malformed schema might return 400 Bad Request directly
  And match response.errors[0].message contains 'Cannot query field'

Scenario: Verify rockets query fetching an array of items
  * text query =
  """
  query {
    rockets {
      id
      name
      active
    }
  }
  """
  Given request { query: '#(query)' }
  When method POST
  Then status 200
  And match response.data.rockets == '#[]'
  And match response.data.rockets[0].id == '#string'
  And match response.data.rockets[0].name == '#string'
  And match response.data.rockets[0].active == '#boolean'
