/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type AirportModel = {
  __typename: "AirportModel",
  ICAO?: string | null,
  IATA?: string | null,
  city?: string | null,
  state?: string | null,
};

export type AirlineModel = {
  __typename: "AirlineModel",
  ICAO?: string | null,
  IATA?: string | null,
  name?: string | null,
  country?: string | null,
};

export type FlightModel = {
  __typename: "FlightModel",
  acid?: string | null,
  date?: string | null,
  arrArpt?: string | null,
  depArpt?: string | null,
  schedDepart?: string | null,
  schedArrive?: string | null,
  eta?: string | null,
  etaType?: string | null,
  etd?: string | null,
  etdType?: string | null,
  airline?: string | null,
};

export type TripsModel = {
  __typename: "TripsModel",
  id?: string | null,
  user?: string | null,
  date?: string | null,
  depArpt?: string | null,
  arrArpt?: string | null,
};

export type AddTripMutationVariables = {
  id?: string | null,
  user?: string | null,
  date?: string | null,
  depArpt?: string | null,
  arrArpt?: string | null,
};

export type AddTripMutation = {
  addTrip?: string | null,
};

export type AddUserFlightMutationVariables = {
  acid?: string | null,
  date?: string | null,
  depArpt?: string | null,
  arrArpt?: string | null,
  trip?: string | null,
  flight_number?: number | null,
};

export type AddUserFlightMutation = {
  addUserFlight?: string | null,
};

export type DeleteTripMutationVariables = {
  trip?: string | null,
};

export type DeleteTripMutation = {
  deleteTrip?: string | null,
};

export type GetAirportByICAOQueryVariables = {
  ICAO: string,
};

export type GetAirportByICAOQuery = {
  getAirportByICAO?:  Array< {
    __typename: "AirportModel",
    ICAO?: string | null,
    IATA?: string | null,
    city?: string | null,
    state?: string | null,
  } | null > | null,
};

export type GetAirlineByIATAQueryVariables = {
  IATA: string,
};

export type GetAirlineByIATAQuery = {
  getAirlineByIATA?:  Array< {
    __typename: "AirlineModel",
    ICAO?: string | null,
    IATA?: string | null,
    name?: string | null,
    country?: string | null,
  } | null > | null,
};

export type GetAirportByCityStateQueryVariables = {
  city?: string | null,
  state?: string | null,
};

export type GetAirportByCityStateQuery = {
  getAirportByCityState?:  Array< {
    __typename: "AirportModel",
    ICAO?: string | null,
    IATA?: string | null,
    city?: string | null,
    state?: string | null,
  } | null > | null,
};

export type GetAirportListQueryVariables = {
};

export type GetAirportListQuery = {
  getAirportList?:  Array< {
    __typename: "AirportModel",
    ICAO?: string | null,
    IATA?: string | null,
    city?: string | null,
    state?: string | null,
  } | null > | null,
};

export type GetAirlineListQueryVariables = {
};

export type GetAirlineListQuery = {
  getAirlineList?:  Array< {
    __typename: "AirlineModel",
    ICAO?: string | null,
    IATA?: string | null,
    name?: string | null,
    country?: string | null,
  } | null > | null,
};

export type DoesFlightExistQueryVariables = {
  acid: string,
  date: string,
};

export type DoesFlightExistQuery = {
  doesFlightExist?:  Array< {
    __typename: "FlightModel",
    acid?: string | null,
    date?: string | null,
    arrArpt?: string | null,
    depArpt?: string | null,
    schedDepart?: string | null,
    schedArrive?: string | null,
    eta?: string | null,
    etaType?: string | null,
    etd?: string | null,
    etdType?: string | null,
    airline?: string | null,
  } | null > | null,
};

export type GetCurrentUserTripsQueryVariables = {
  user: string,
};

export type GetCurrentUserTripsQuery = {
  getCurrentUserTrips?:  Array< {
    __typename: "TripsModel",
    id?: string | null,
    user?: string | null,
    date?: string | null,
    depArpt?: string | null,
    arrArpt?: string | null,
  } | null > | null,
};

export type GetPastUserTripsQueryVariables = {
  user: string,
};

export type GetPastUserTripsQuery = {
  getPastUserTrips?:  Array< {
    __typename: "TripsModel",
    id?: string | null,
    user?: string | null,
    date?: string | null,
    depArpt?: string | null,
    arrArpt?: string | null,
  } | null > | null,
};

export type GetUserFlightsQueryVariables = {
  trip: string,
};

export type GetUserFlightsQuery = {
  getUserFlights?:  Array< {
    __typename: "FlightModel",
    acid?: string | null,
    date?: string | null,
    arrArpt?: string | null,
    depArpt?: string | null,
    schedDepart?: string | null,
    schedArrive?: string | null,
    eta?: string | null,
    etaType?: string | null,
    etd?: string | null,
    etdType?: string | null,
    airline?: string | null,
  } | null > | null,
};
