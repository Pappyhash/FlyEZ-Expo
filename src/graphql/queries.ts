/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getAirportByICAO = /* GraphQL */ `query GetAirportByICAO($ICAO: String!) {
  getAirportByICAO(ICAO: $ICAO) {
    ICAO
    IATA
    city
    state
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAirportByICAOQueryVariables,
  APITypes.GetAirportByICAOQuery
>;
export const getAirlineByIATA = /* GraphQL */ `query GetAirlineByIATA($IATA: String!) {
  getAirlineByIATA(IATA: $IATA) {
    ICAO
    IATA
    name
    country
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAirlineByIATAQueryVariables,
  APITypes.GetAirlineByIATAQuery
>;
export const getAirportByCityState = /* GraphQL */ `query GetAirportByCityState($city: String, $state: String) {
  getAirportByCityState(city: $city, state: $state) {
    ICAO
    IATA
    city
    state
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAirportByCityStateQueryVariables,
  APITypes.GetAirportByCityStateQuery
>;
export const getAirportList = /* GraphQL */ `query GetAirportList {
  getAirportList {
    ICAO
    IATA
    city
    state
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAirportListQueryVariables,
  APITypes.GetAirportListQuery
>;
export const getAirlineList = /* GraphQL */ `query GetAirlineList {
  getAirlineList {
    ICAO
    IATA
    name
    country
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAirlineListQueryVariables,
  APITypes.GetAirlineListQuery
>;
export const doesFlightExist = /* GraphQL */ `query DoesFlightExist($acid: String!, $date: AWSDate!) {
  doesFlightExist(acid: $acid, date: $date) {
    acid
    date
    arrArpt
    depArpt
    schedDepart
    schedArrive
    eta
    etaType
    etd
    etdType
    airline
    __typename
  }
}
` as GeneratedQuery<
  APITypes.DoesFlightExistQueryVariables,
  APITypes.DoesFlightExistQuery
>;
export const getCurrentUserTrips = /* GraphQL */ `query GetCurrentUserTrips($user: String!) {
  getCurrentUserTrips(user: $user) {
    id
    user
    date
    depArpt
    arrArpt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCurrentUserTripsQueryVariables,
  APITypes.GetCurrentUserTripsQuery
>;
export const getPastUserTrips = /* GraphQL */ `query GetPastUserTrips($user: String!) {
  getPastUserTrips(user: $user) {
    id
    user
    date
    depArpt
    arrArpt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPastUserTripsQueryVariables,
  APITypes.GetPastUserTripsQuery
>;
export const getUserFlights = /* GraphQL */ `query GetUserFlights($trip: String!) {
  getUserFlights(trip: $trip) {
    acid
    date
    arrArpt
    depArpt
    schedDepart
    schedArrive
    eta
    etaType
    etd
    etdType
    airline
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserFlightsQueryVariables,
  APITypes.GetUserFlightsQuery
>;
