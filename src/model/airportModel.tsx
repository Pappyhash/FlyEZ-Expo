import { AirportModel } from '../API';

export var airports: AirportModel[] = []

export function getAirportByCode(code: string): AirportModel | null {

    if (code == null || code == undefined) {
        return null;
    }

    for (var airport of airports) {
        if (airport.ICAO == code || airport.IATA == code) {
            return airport;
        }
    }

    return null;
}