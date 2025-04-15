import React, { useEffect, useState } from "react";
import { FlatList, PixelRatio, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { getUserFlights } from "../graphql/queries";
import { FlightModel } from "../API";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAirportByCode } from "../model/airportModel";
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import calendar from 'dayjs/plugin/calendar';
import airportTimezone from 'airport-timezone';
import { formatInTimeZone } from 'date-fns-tz';
import { getTimeZone } from 'react-native-localize';
import { Trip } from "../model/Trip";

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(calendar)

const client = generateClient();

const FlightDetailsScreen = ({route, navigation}) => {

    const tripReference = route.params.trip;

    console.log("Trip ID: " + tripReference);

    const [userFlights, setUserFlights] = useState<FlightModel[]>([]);
    const [delayFlight, setDelayFlight] = useState<FlightModel>();

    useEffect(() => {
        const fetchData = async () => {
      
            const { userId } = await getCurrentUser();

            if (userId) {
                try {
                    const queryResponse = await client.graphql({ query: getUserFlights, variables: { trip: tripReference }});
                    const flightList: FlightModel[] = [];
        
                    if (queryResponse.data.getUserFlights) {
                        queryResponse.data.getUserFlights.forEach(flight => {
                            if (flight) { 
                                flightList.push(flight);
                            }
                        });
                    }
                    setUserFlights(flightList);
                } catch(error) {
                    console.error('error', error);
                }

            }
        }

        fetchData();
          
    }, []);

    const DeleteTrip = async () => {

        const userTrip = new Trip();

        await userTrip.deleteTrip(tripReference);

        navigation.navigate("TripsScreen")

    }

    function IsInFlight(flight: FlightModel) : string {

        const etaType = flight.etaType ? flight.etaType : "";
        const etdType = flight.etdType ? flight.etdType : "";

       if (etdType == "ACTUAL" && etaType !== "ACTUAL") {
            return "In Flight";
       } 

       return "";
    }

    function toTitleCase(str: string) : string {
        if (!str) {
            return ""
        }
        return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
    }

    function FlightScheduledDate (stringDate: string, airportCode: string) : string {
            
        if (stringDate == "") {
            return "No Date Found"
        }

        if (airportCode != "") {
            airportCode = airportCode.substring(1);
        }

        var airportTZ = airportTimezone.filter(function(airport){
            return airport.code === airportCode;
          })[0];

        if (airportTZ) {
            airportTZ = airportTZ.timezone;
        }

        const date = new Date(stringDate);

        const userDate = formatInTimeZone(date, airportTZ, "dd, MMMM yyyy HH:mm:ss zzz")

        return "Scheduled: " + userDate;
}

    function FlightDepartureDate (flight: FlightModel) : string {
            
        const stringDate = flight.etd ? flight.etd : "";
        var airportCode = flight.depArpt ? flight.depArpt : "";
        const flightType = flight.etdType ? flight.etdType : "";

        if (stringDate == "") {
            return "No Date Found"
        }

        if (airportCode != "") {
            airportCode = airportCode.substring(1);
        }

        var airportTZ = airportTimezone.filter(function(airport){
            return airport.code === airportCode;
            })[0];


        if (airportTZ) {
            airportTZ = airportTZ.timezone;
        }

        const date = new Date(stringDate);

        const userDate = toTitleCase(flightType) + ": " + formatInTimeZone(date, airportTZ, "MMMM dd yyyy HH:mm zzz")

        return userDate;
    }

    function FlightArrivalDate(flight: FlightModel) : string {

        const stringDate = flight.eta ? flight.eta : "";
        var airportCode = flight.arrArpt ? flight.arrArpt : "";
        const flightType = flight.etdType ? flight.etdType : "";

        if (stringDate == "") {
            return "No Date Found"
        }

        if (airportCode != "") {
            airportCode = airportCode.substring(1);
        }

        var airportTZ = airportTimezone.filter(function(airport){
            return airport.code === airportCode;
          })[0];

        if (airportTZ) {
            airportTZ = airportTZ.timezone;
        }

        console.log("Airport TZ: " + airportTZ);

        const date = new Date(stringDate);

        const userDate = toTitleCase(flightType) + ": " + formatInTimeZone(date, airportTZ, "MMMM dd yyyy HH:mm zzz")

        return userDate;
    }

    function getFlightDelayMessage() : string {
        
        if (delayFlight) {
            const arrArpt = getAirportByCode(delayFlight.arrArpt? delayFlight.arrArpt : "");
            const depArpt = getAirportByCode(delayFlight.depArpt? delayFlight.depArpt : "");

            console.log("Departure Airport: " + delayFlight.depArpt);
            console.log("Arrival Airport: " + delayFlight.arrArpt);

            return "Your flight from " + depArpt?.city + " to " + arrArpt?.city + " is delayed";
        } else {
            return "Uh oh! Looks like we couldn't find your flight"
        }
    }

    const DelayBox = () => {
        var delayTime = 100;

        if (userFlights.length < 2) return <View></View>
    
        for(var i = 0; i < userFlights.length-1; i++) {
        
            const flight = userFlights[i];
            const nextFlight = userFlights[i+1];
    
            const flightArrival = dayjs(flight.eta);
            const nextFlightDeparture = dayjs(nextFlight.etd);
    
            const diff = nextFlightDeparture.diff(flightArrival, 'minutes');
    
            if (diff < 30 && diff > 14) {
                delayTime = diff;
                setDelayFlight(flight);
                break;
            } else if (diff <= 14) {
                delayTime = diff;
                setDelayFlight(flight);
                break;
            }
        
        }
    
        if (delayTime > 30) {
            return GoodBox();
        } else if (delayTime > 14) {
            return WarningBox();
        } else {
            return DangerBox();
        }
    }

    const GoodBox = () => {
        return (
            <View style={[
                DelayBoxStyles.container, 
                DelayBoxStyles.goodBoxContainer
            ]}>
                <View style={[
                    DelayBoxStyles.containerBox
                ]}>
                    <Text style={DelayBoxStyles.goodText}>
                        All flights are on time
                    </Text>
                </View>
            </View>  
        )
    }

    const WarningBox = () => {
        return (
            <View style={[
                DelayBoxStyles.container, 
                DelayBoxStyles.warningBoxContainer
            ]}>
                <View style={[
                    DelayBoxStyles.containerBox
                ]}>
                    <Text style={DelayBoxStyles.dangerTextTile}>
                        Flight Delay
                    </Text>
                    <Text style={DelayBoxStyles.DangerTextMessage}>
                        {getFlightDelayMessage()}
                    </Text>
                    <Text style={DelayBoxStyles.DangerTextMessage}>
                        You may want to consider changing your connecting flight.
                    </Text>
                </View>
            </View>
        )
    }

    const DangerBox = () => {
        return (
            <View style={[
                DelayBoxStyles.container, 
                DelayBoxStyles.dangerBoxContainer
            ]}>
                <View style={[
                    DelayBoxStyles.containerBox
                ]}>
                    <Text style={DelayBoxStyles.dangerTextTile}>
                        Flight Delay
                    </Text>
                    <Text style={DelayBoxStyles.DangerTextMessage}>
                        {getFlightDelayMessage()}
                    </Text>
                    <Text style={DelayBoxStyles.DangerTextMessage}>
                        It is likely that you will miss your connecting flight due to this delay. We recommend you change flights if possible.
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View>
            <View style={timeLineStyles.container}>
                <FlatList 
                    contentContainerStyle={timeLineStyles.propertyListContainer}
                    ItemSeparatorComponent={({ item }) => (
                        <View style={timeLineStyles.separatorContainer}>
                            <View style={timeLineStyles.timelineContainer}>
                                <View style={timeLineStyles.timelineLine} />
                            </View>
                        </View>
                    )}
                    data={userFlights}
                    renderItem={({ item }) => (
                        <View>
                            <View style={timeLineStyles.classItem}>
                                <View style={timeLineStyles.classContent}>
                                    <View style={[
                                        timeLineStyles.card, 
                                        {
                                            backgroundColor: 'white',
                                            flexDirection: 'row'
                                        },
                                    ]}>
                                        <MaterialCommunityIcons name="airplane" size={30} />
                                        <View style={[
                                            timeLineStyles.cardDetailsContainer,
                                            {
                                                flexDirection: 'column'
                                            }
                                        ]}>
                                            <View style={[
                                                timeLineStyles.cardDetailsContainer,
                                                {
                                                    flexDirection: 'row'
                                                }
                                            ]}>
                                                <View style={{flex:4}}>
                                                <Text style={timeLineStyles.cardTitle}>{getAirportByCode(item.depArpt ? item.depArpt : "")?.city}</Text>
                                                </View>
                                               
                                                <View style={{flex:1}}>
                                                    <Text>{IsInFlight(item)}</Text>
                                                </View>
                                            </View>
                                            <Text style={timeLineStyles.cardTitle}>{FlightDepartureDate(item)}</Text>
                                            <Text style={timeLineStyles.cardDetails}>{FlightScheduledDate(item.schedDepart ? item.schedDepart : "", item.depArpt ? item.depArpt : "")}</Text>   
                                        </View>
                                        
                                    </View>
                                </View>
                            </View>
                            <View>
                                <View style={timeLineStyles.separatorContainer}>
                                    <View style={timeLineStyles.timelineContainer}>
                                        <View style={timeLineStyles.timelineLineFlight} />
                                    </View>
                                </View>
                            </View>
                            <View style={timeLineStyles.classItem}>
                            <View style={timeLineStyles.classContent}>
                                <View style={[
                                    timeLineStyles.card, 
                                    {
                                        backgroundColor: 'white',
                                        flexDirection: 'row'
                                    },
                                ]}>
                                    <MaterialCommunityIcons name="airplane" size={30} />
                                    <View style={[
                                        timeLineStyles.cardDetailsContainer,
                                        {
                                            flexDirection: 'column'
                                        }
                                    ]}>
                                        <Text style={timeLineStyles.cardTitle}>{getAirportByCode(item.arrArpt ? item.arrArpt : "")?.city}</Text>
                                        <Text style={timeLineStyles.cardTitle}>{FlightArrivalDate(item)}</Text>
                                        <Text style={timeLineStyles.cardDetails}>{FlightScheduledDate(item.schedArrive ? item.schedArrive : "", item.arrArpt ? item.arrArpt : "")}</Text>
                                        
                                    </View>
                                    
                                </View>
                            </View>
                        </View>
                    </View>
                    )} 
                />
            </View>
            <DelayBox/>
        </View>
        
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    deleteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
        borderRadius: 20,
        padding: 10,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    topRightElement: {
        position: 'absolute',
        top: 0,
        right: 0,
      },
      topLeftElement: {
        position: 'absolute',
        top: 0,
        left: 0,
      },
});

const DelayBoxStyles = StyleSheet.create({
    container: {
        height: '20%',
        borderStyle: 'solid',
        borderWidth: 3
    },
    containerBox: {
        flex:1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: 10,
    },
    goodBoxContainer: {
        borderColor: 'green',
        backgroundColor: 'lightgreen',
    },
    goodText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
    warningBoxContainer: {
        borderColor: 'yellow',
        backgroundColor: 'lightyellow'
    },
    dangerBoxContainer: {
        borderColor: 'darkred',
        backgroundColor: 'red'
    },
    dangerTextTile: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
    DangerTextMessage: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black'
    },
})

const timeLineStyles = StyleSheet.create({
    container: {
        height: '80%',
        paddingTop: 60,
    },
    card: {
        flex:1,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        padding: 5
    },
    classItem: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timelineContainer: {
        width: 30,
        alignItems: 'center',
    },
    separatorContainer:{
        alignItems:'center',
        justifyContent:'center',
    },
    timelineLine: {
        flex: 1,
        width: 8,
        height:60,
        backgroundColor: 'green',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    timelineLineFlight: {
        flex: 1,
        width: 8,
        height:20,
        backgroundColor: 'black',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    classContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardDetailsContainer: {
        flex: 1,
    },
    cardDetails: {
        fontSize: 12,
    },
    propertyListContainer:{
        paddingHorizontal:20,
    },
  });

export default FlightDetailsScreen;