/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const addTrip = /* GraphQL */ `mutation AddTrip(
  $id: String
  $user: String
  $date: AWSDate
  $depArpt: String
  $arrArpt: String
) {
  addTrip(
    id: $id
    user: $user
    date: $date
    depArpt: $depArpt
    arrArpt: $arrArpt
  )
}
` as GeneratedMutation<
  APITypes.AddTripMutationVariables,
  APITypes.AddTripMutation
>;
export const addUserFlight = /* GraphQL */ `mutation AddUserFlight(
  $acid: String
  $date: AWSDate
  $depArpt: String
  $arrArpt: String
  $trip: String
  $flight_number: Int
) {
  addUserFlight(
    acid: $acid
    date: $date
    depArpt: $depArpt
    arrArpt: $arrArpt
    trip: $trip
    flight_number: $flight_number
  )
}
` as GeneratedMutation<
  APITypes.AddUserFlightMutationVariables,
  APITypes.AddUserFlightMutation
>;
export const deleteTrip = /* GraphQL */ `mutation DeleteTrip($trip: String) {
  deleteTrip(trip: $trip)
}
` as GeneratedMutation<
  APITypes.DeleteTripMutationVariables,
  APITypes.DeleteTripMutation
>;
