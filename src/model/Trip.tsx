import dayjs from 'dayjs'
import { Alert } from 'react-native';
import { AirlineModel, AirportModel, TripsModel } from '../API';
import { generateClient } from 'aws-amplify/api';
import { doesFlightExist } from '../graphql/queries';
import { getCurrentUser } from 'aws-amplify/auth';
import uuid from 'react-native-uuid'
import { addTrip, addUserFlight, deleteTrip } from '../graphql/mutations';

export interface FlightConnectionInterface {
    date: Date;
    airline: AirlineModel;
    arrArpt: AirportModel;
    depArpt: AirportModel;
    flightNumber: string;
}

const client = generateClient();

export class Trip {
    static deleteTrip(tripReference: any) {
        throw new Error("Method not implemented.");
    }
    connections: FlightConnectionInterface[] = [];

    private getDepArpt(): string {
        if (this.connections.length >= 1) {
            return this.connections[0].depArpt.ICAO? this.connections[0].depArpt.ICAO : "";
        }

        return "";
    }

    private getArrArpt(): string {
        const lastFlightPosition = this.connections.length-1;
        if (lastFlightPosition >= 0) {
            return (this.connections[lastFlightPosition].arrArpt.ICAO || "");
        }

        return "";
    }

    private getDate(): Date | null {
        if (this.connections.length >= 1) {
            return this.connections[0].date;
        }

        return null;
    }

    public async addConnection(connection: FlightConnectionInterface): Promise<boolean> {
        const previousConnection = this.connections[Trip.length]
        
        if (this.connections.length > 0) {
            if (previousConnection.arrArpt != connection.depArpt) {
                Alert.alert("Error", "Departure airport must match arrival airport of previous flight");
                return false;
            }
        }

        if (this.validateConnection(connection)) {
            this.connections.push(connection);
        }

        return true;
    }

    public validateConnection(connection: FlightConnectionInterface): Boolean {
        if (this.isAnyValueEmpty(connection)) {
            return false;
        }

        if (connection.arrArpt == connection.depArpt) {
            return false;
        }

        return true;
    }

    public async submitTrip(): Promise<void> {

        if (this.connections.length == 0) {
            return;
        }

        const { username, userId, signInDetails } = await getCurrentUser();
        

        if (userId) {

            const tripDate = this.getDate();
            const tripDepArpt = this.getDepArpt();
            const tripArrArpt = this.getArrArpt();
            const tripId: string = uuid.v4().toString();

            console.log(tripId)
            
            const trip: TripsModel = { 
                __typename: "TripsModel",
                id: tripId,
                user: userId,
            }

            if (tripDate != null) {
                trip.date = this.convertDateToString(tripDate);
            }
            trip.depArpt = tripDepArpt;
            trip.arrArpt = tripArrArpt;


            await this.addTrip(trip);

            var flightCount = 0;
            for (var i = 0; i < this.connections.length; i++) {
                flightCount++;

                const connectionDate = this.getConnectionDate(this.connections[i]);
                const acid = this.getAcid(this.connections[i]);
                const depArpt = this.connections[i].depArpt.ICAO || "";
                const arrArpt = this.connections[i].arrArpt.ICAO || "";

                await this.addUserFlight(acid, connectionDate, depArpt, arrArpt, tripId, flightCount)

            }
        }
        
    }

    private async addTrip(trip: TripsModel) {
        try {
            console.log("ID: " + trip.id);
            await client.graphql({ query: addTrip, variables: { id: trip.id, user: trip.user, date: trip.date, depArpt: trip.depArpt, arrArpt: trip.arrArpt } });
        } catch (error) {
            console.error('error:', error);
          }
    }

    private async addUserFlight(acid: string, date: string, depArpt: string, arrArpt: string, trip: string, flight_number: number) {
        try {
            await client.graphql({ query: addUserFlight , variables: { acid: acid, date: date, depArpt: depArpt, arrArpt: arrArpt, trip: trip, flight_number: flight_number } });
        } catch (error) {
            console.error('error:', error);
          }
    }

    private getConnectionDate(connection: FlightConnectionInterface): string {
    
        return dayjs(connection.date).format("YYYY-MM-DD");
    
    }

    private convertDateToString(date: Date): string {
        return dayjs(date).format("YYYY-MM-DD");
    }

    private getAcid(connection: FlightConnectionInterface): string {
    
        return connection.airline.ICAO + connection.flightNumber;

    }

    private getFlightReference(connection: FlightConnectionInterface): String {
    
        return connection.depArpt.ICAO + "-" + connection.arrArpt.ICAO;

    }

    private isAnyValueEmpty(connection: FlightConnectionInterface): Boolean {
        if (!this.isAirlineModelValid(connection.airline)) {
            return true;
        }

        if (!this.isAirportModelValid(connection.arrArpt)) {
            return true;
        }

        if (!this.isAirportModelValid(connection.depArpt)) {
            return true;
        }

        if (this.isStringEmpty(connection.flightNumber)) {
            return true;
        }

        return false;
    }

    private isAirportModelValid(checkAirportModel: AirportModel) {
        if (checkAirportModel.__typename == "AirportModel") {
            return true;
        }
        
        return false;
    }

    private isAirlineModelValid(checkAirlineModel: AirlineModel) {
        if (checkAirlineModel.__typename == "AirlineModel") {
            return true;
        }
        
        return false;
    }

    private isStringEmpty(checkString: string): Boolean {
        if (typeof checkString!='undefined' && checkString) {
            return false;
        }

        return true;
    }

    public async doesFlightExist(connection: FlightConnectionInterface): Promise<Boolean> {

        const acid = this.getAcid(connection);
        const date = this.getConnectionDate(connection);

        try {
            const queryResponse = await client.graphql({ query: doesFlightExist, variables: { acid: acid, date: date }, authMode: "apiKey" });
            const flightArray = queryResponse.data.doesFlightExist
            if (flightArray?.length == 1) {
                return true;
            }
        } catch (error) {
            console.error('error:', error);
        }

        return false;
    }

    public async deleteTrip(tripId: string): Promise<void> {

        if (tripId == null || tripId == undefined) {
            return;
        }

        console.log("Deleting trip: " + tripId);

        try {
            await client.graphql({ query: deleteTrip, variables: { trip: tripId } });
        } catch (error) {
            console.error('error:', error);
          }
    }

}