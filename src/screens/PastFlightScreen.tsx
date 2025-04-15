import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useIsFocused } from '@react-navigation/native';
import { TripsModel } from '../API';
import { getCurrentUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { getPastUserTrips } from '../graphql/queries';

const client = generateClient();

const PastFlightScreen = ({route, navigation}) => {

    const [userTrips, setUserTrips] = useState<TripsModel[]>([]);

    const isFocused = useIsFocused();

    useEffect(() => {


        const fetchData = async () => {
      
            const { userId } = await getCurrentUser();

            if (userId) {
                try {
                    const queryResponse = await client.graphql({ query: getPastUserTrips, variables: { user: userId }});
                    const tripList: TripsModel[] = [];
        
                    if (queryResponse.data.getPastUserTrips) {
                        queryResponse.data.getPastUserTrips.forEach(trip => {
                            if (trip) { 
                                tripList.push(trip);
                            }
                        });
                    }
                    setUserTrips(tripList);
                } catch(error) {
                    console.error('error', error);
                }

            }

        }
          

        if (isFocused) {
        console.log("Fetching Current Flights...");
        fetchData();
        }

        return () => {
            console.log("Cleaning up Current Flights...");
            setUserTrips([]);
      }

    }, [isFocused]);

    return (
        <View>
            <FlatList 
                contentContainerStyle={styles.propertyListContainer}
                data={userTrips}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card} onPress={() => {navigation.navigate('FlightDetailsScreen', { trip: item.id})}}>
                        <View style={styles.cardBody}>
                            <Text style={styles.price}>Origin: {
                                item ? item.depArpt : "Unknown"
                            }</Text>
                            <Text style={styles.price}>Destination: {item ? item.arrArpt : "Unknown"}</Text>
                            <Text style={styles.address}>Date: {item.date}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                
                />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop:60,
    },
    searchInputContainer:{
      paddingHorizontal:20,
    },
    searchInput: {
      height: 40,
      borderWidth: 1,
      borderColor:'#dcdcdc',
      backgroundColor:'#fff',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    },
    propertyListContainer:{
      paddingHorizontal:20,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 5,
      marginTop:10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    image: {
      height: 150,
      marginBottom: 10,
      borderTopLeftRadius:5,
      borderTopRightRadius:5,
    },
    cardBody: {
      marginBottom: 10,
      padding: 10,
    },
    price: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5
    },
    address: {
      fontSize: 16,
      marginBottom: 5
    },
    squareMeters: {
      fontSize: 14,
      marginBottom: 5,
      color: '#666'
    },
    cardFooter: {
      padding: 10,
      flexDirection: 'row',
      borderTopWidth:1,
      borderTopColor:'#dcdcdc',
      justifyContent: 'space-between',
    },
    beds: {
      fontSize: 14,
      color:'#ffa500',
      fontWeight: 'bold'
    },
    baths: {
      fontSize: 14,
      color:'#ffa500',
      fontWeight: 'bold'
    },
    parking: {
      fontSize: 14,
      color:'#ffa500',
      fontWeight: 'bold'
    }
  });

export default PastFlightScreen;