import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Dimensions, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AirlineModel, AirportModel } from '../API';
import { getAirlineList, getAirportList } from '../graphql/queries';
import { generateClient } from 'aws-amplify/api';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FlightConnectionInterface, Trip } from '../model/Trip';
import uuid from 'react-native-uuid';

import {airports} from '../model/airportModel';
import {airlines} from '../model/airlineModel';

const {width} = Dimensions.get('window');
const client = generateClient();

const NewTripScreen = ({route, navigation}) => {

    const [trip, setTrip] = useState<Trip>(new Trip())
    const [departureDate, setDepartureDate] = useState("")
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    var today: Date = new Date();
    today.setDate(today.getDate() - 1);

    const arrivalAirportRef = useRef<SelectDropdown>(null);
    const departureAirportRef = useRef<SelectDropdown>(null);
    const airlineRef = useRef<SelectDropdown>(null);

    const [departureAirport, setDepartureAirport] = useState<AirportModel | null>(null);
    const [arrivalAirport, setArrivalAirport] = useState<AirportModel | null>(null);
    const [airline, setAirline] = useState<AirlineModel | null>(null);

    const [flightNumber, setFlightNumber] = useState("");

    const toggleDatePicker = () => {
        setShowPicker(!showPicker);
      }

    function onDateSelected(selectedDate: any) {
        setDate(selectedDate);
  
        console.log("Selected Date: " + selectedDate);
  
        toggleDatePicker();
        setDepartureDate(dayjs(selectedDate).format('MM/DD/YYYY'));
    }

    const AddConnection = async () => {

        const tripId: string = uuid.v4().toString();

        console.log("tripID: " + tripId);

        if (airline == null || arrivalAirport == null || departureAirport == null || flightNumber == "") {
            Alert.alert("Error", "Please fill out all fields");
            return;
        }

        const userFlight: FlightConnectionInterface = {
            airline: airline,
            arrArpt: arrivalAirport,
            depArpt: departureAirport,
            flightNumber: flightNumber,
            date: date,
        }

        const doesFlightExist = await trip.doesFlightExist(userFlight);

        if (!doesFlightExist) {
            Alert.alert("Error", airline.name + " flight " + flightNumber + " not found. Please check the information is correct and try again.");
            return;
        }

        if (!trip.addConnection(userFlight)) {
            return;
        }

        setDepartureAirport(null);
        setArrivalAirport(null);
        setAirline(null);
        if (departureAirport && departureAirportRef.current) {
            departureAirportRef.current.reset();
        }
        if (arrivalAirport && arrivalAirportRef.current) {
            arrivalAirportRef.current.reset();
        }
        if (airline && airlineRef.current) {
            airlineRef.current.reset();
        }
        setFlightNumber("");
        setDepartureDate("");
    }

    const AddFlight = async () => {

        console.log("Adding Flight...");

        await AddConnection().then((result) => {
        
            if (trip) {
            trip.submitTrip();
            }
        
        });

        navigation.navigate("TripsScreen")

    }

    if (airlines.length == 0 || airports.length == 0) {
        return (
            <View>
                <Text>Loading data...</Text>
            </View>
        )
    } else {
        return (
            <ScrollView>
                <View style={styleSheet.MainContainer}>
                    <KeyboardAvoidingView>
                        <Text style={styleSheet.label}>
                            Departure Date
                        </Text>
    
                        {showPicker && (
                        <DateTimePicker
                            mode="single"
                            date={date}
                            onChange={(params) => onDateSelected(params.date)}
                            minDate={today}
                        />
                        )}
    
                        {!showPicker && (
                            <View>
                            <Pressable
                                onPress={toggleDatePicker}
                            >
                                <TextInput
                                    style={styleSheet.input}
                                    placeholder="Departure Date"
                                    value={departureDate}
                                    placeholderTextColor="#11182744"
                                    editable={false}
                                    onPressIn={toggleDatePicker}
                                />
                            </Pressable>
                            </View>
                        )}
    
                        <View>
                            <Text style={styleSheet.label}>Departure Airport</Text>
                            <SelectDropdown
                            ref={departureAirportRef}
                            data={airports}
                            onSelect={(itemValue, itemIndex) => setDepartureAirport(itemValue)}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                <View style={dropdownStyle.dropdownButtonStyle}>
                                    {selectedItem && (
                                    <Icon name={selectedItem.icon} style={dropdownStyle.dropdownButtonIconStyle} />
                                    )}
                                    <Text style={dropdownStyle.dropdownButtonTxtStyle}>
                                    {(selectedItem && (selectedItem.city + ", " + selectedItem.state + " (" + selectedItem.IATA + ")")) || 'Select Departure Airport'}
                                    </Text>
                                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={dropdownStyle.dropdownButtonArrowStyle} />
                                </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (
                                <View style={{...dropdownStyle.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                    <Icon name={item.icon} style={dropdownStyle.dropdownItemIconStyle} />
                                    <Text style={dropdownStyle.dropdownItemTxtStyle}>{item.city + ", " + item.state + " (" + item.IATA + ")"}</Text>
                                </View>
                                );
                            }}
                            dropdownStyle={dropdownStyle.dropdown1DropdownStyle}
                            search
                            searchInputStyle={dropdownStyle.dropdown1searchInputStyleStyle}
                            searchPlaceHolder={'Search...'}
                            searchPlaceHolderColor={'darkgray'}
                            renderSearchInputLeftIcon={() => {
                                return <FontAwesome name="search" size={18} color={'#444'} />;
                            }}
                            />
    
                            <Text style={styleSheet.label}>Arrival Airport</Text>
    
                            <SelectDropdown
                            ref={arrivalAirportRef}
                            data={airports}
                            onSelect={(itemValue, itemIndex) => setArrivalAirport(itemValue)}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                <View style={dropdownStyle.dropdownButtonStyle}>
                                    {selectedItem && (
                                    <Icon name={selectedItem.icon} style={dropdownStyle.dropdownButtonIconStyle} />
                                    )}
                                    <Text style={dropdownStyle.dropdownButtonTxtStyle}>
                                    {(selectedItem && (selectedItem.city + ", " + selectedItem.state + " (" + selectedItem.IATA + ")")) || 'Select Arrival Airport'}
                                    </Text>
                                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={dropdownStyle.dropdownButtonArrowStyle} />
                                </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (
                                <View style={{...dropdownStyle.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                    <Icon name={item.icon} style={dropdownStyle.dropdownItemIconStyle} />
                                    <Text style={dropdownStyle.dropdownItemTxtStyle}>{item.city + ", " + item.state + " (" + item.IATA + ")"}</Text>
                                </View>
                                );
                            }}
                            search
                            searchInputStyle={dropdownStyle.dropdown1searchInputStyleStyle}
                            searchPlaceHolder={'Search...'}
                            searchPlaceHolderColor={'darkgray'}
                            renderSearchInputLeftIcon={() => {
                                return <FontAwesome name="search" size={18} color={'#444'} />;
                            }}
                            />
    
                            <Text style={styleSheet.label}>Airline</Text>
    
                            <SelectDropdown
                            ref={airlineRef}
                            data={airlines}
                            onSelect={(itemValue, itemIndex) => setAirline(itemValue)}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                <View style={dropdownStyle.dropdownButtonStyle}>
                                    {selectedItem && (
                                    <Icon name={selectedItem.icon} style={dropdownStyle.dropdownButtonIconStyle} />
                                    )}
                                    <Text style={dropdownStyle.dropdownButtonTxtStyle}>
                                    {(selectedItem && (selectedItem.name + " (" + selectedItem.IATA + ")")) || 'Select Airline'}
                                    </Text>
                                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={dropdownStyle.dropdownButtonArrowStyle} />
                                </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (
                                <View style={{...dropdownStyle.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
                                    <Icon name={item.icon} style={dropdownStyle.dropdownItemIconStyle} />
                                    <Text style={dropdownStyle.dropdownItemTxtStyle}>{item.name + " (" + item.IATA + ")"}</Text>
                                </View>
                                );
                            }}
                            search
                            searchInputStyle={dropdownStyle.dropdown1searchInputStyleStyle}
                            searchPlaceHolder={'Search...'}
                            searchPlaceHolderColor={'darkgray'}
                            renderSearchInputLeftIcon={() => {
                                return <FontAwesome name="search" size={18} color={'#444'} />;
                            }}
                            />
                        </View>
    
                        <Text
                            style={styleSheet.label}
                        >
                            Flight Number
                        </Text>
    
                        <TextInput
                                style={styleSheet.input}
                                placeholder="Flight Number"
                                value={flightNumber}
                                onChangeText={setFlightNumber}
                                placeholderTextColor="#11182744"
                                maxLength={4}
                                numberOfLines={1}
                                keyboardType='numeric'
                        />  
    
    
                        <Button 
                            title="Add Connection"
                            onPress={AddConnection}
                        />
    
                        <Button 
                            title="Submit"
                            onPress={AddFlight}
                        />
    
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        );
    }
}

const styleSheet = StyleSheet.create({

    header: {
      paddingLeft: 10,
    },
    label: {
      fontSize: 13,
      fontWeight: "500",
      marginBottom: 10,
      marginTop: 10,
      color: "#111827cc",
    },
    MainContainer: {
      paddingHorizontal: 10,
    },
  
    text: {
      fontSize: 25,
      color: 'red',
      padding: 3,
      marginBottom: 10,
      textAlign: 'center'
    },
    input: {
      backgroundColor: "transparent",
      height: 50,
      fontSize: 14,
      fontWeight: "500",
      color: "#111827cc",
      borderRadius: 50,
      borderWidth: 1.5,
      borderColor: "#11182711",
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    cancel_button: {
      height: 30,
      marginBottom: 30,
      textAlign: 'center',
    },
  
    // Style for iOS ONLY...
    datePicker: {
      height: 120,
      marginTop: -10,
    },
    pickerButton: {
      paddingHorizontal: 20,
    },
    button: {
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 50,
      marginTop: 10,
      marginBottom: 15,
      backgroundColor: "#075985",
    }
  
  });
  
  const dropdownStyle = StyleSheet.create({
    shadow: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 10,
    },
    header: {
      flexDirection: 'row',
      width,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F6F6F6',
    },
    headerTitle: {color: '#000', fontWeight: 'bold', fontSize: 16},
    saveAreaViewContainer: {flex: 1, backgroundColor: '#FFF'},
    viewContainer: {flex: 1, width, backgroundColor: '#FFF'},
    scrollViewContainer: {
      flexGrow: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: '10%',
      paddingBottom: '20%',
    },
  
    dropdown1BtnStyle: {
      width: '80%',
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#444',
    },
    dropdown1BtnTxtStyle: {color: '#444', textAlign: 'left'},
    dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
    dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
    dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
    dropdown1SelectedRowStyle: {backgroundColor: 'rgba(0,0,0,0.1)'},
    dropdown1searchInputStyleStyle: {
      backgroundColor: '#EFEFEF',
      borderRadius: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#444',
    },
  
    dropdown2BtnStyle: {
      width: '80%',
      height: 50,
      backgroundColor: '#444',
      borderRadius: 8,
    },
    dropdown2BtnTxtStyle: {
      color: '#FFF',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    dropdown2DropdownStyle: {
      backgroundColor: '#444',
      borderRadius: 12,
    },
    dropdown2RowStyle: {backgroundColor: '#444', borderBottomColor: '#C5C5C5'},
    dropdown2RowTxtStyle: {
      color: '#FFF',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    dropdown2SelectedRowStyle: {backgroundColor: 'rgba(255,255,255,0.2)'},
    dropdown2searchInputStyleStyle: {
      backgroundColor: '#444',
      borderBottomWidth: 1,
      borderBottomColor: '#FFF',
    },
  
    dropdown3BtnStyle: {
      width: '80%',
      height: 50,
      backgroundColor: '#FFF',
      paddingHorizontal: 0,
      borderWidth: 1,
      borderRadius: 8,
      borderColor: '#444',
    },
    dropdown3BtnChildStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 18,
    },
    dropdown3BtnImage: {width: 45, height: 45, resizeMode: 'cover'},
    dropdown3BtnTxt: {
      color: '#444',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 24,
      marginHorizontal: 12,
    },
    dropdown3DropdownStyle: {backgroundColor: 'slategray'},
    dropdown3RowStyle: {
      backgroundColor: 'slategray',
      borderBottomColor: '#444',
      height: 50,
    },
    dropdown3RowChildStyle: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingHorizontal: 18,
    },
    dropdownRowImage: {width: 45, height: 45, resizeMode: 'cover'},
    dropdown3RowTxt: {
      color: '#F1F1F1',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 24,
      marginHorizontal: 12,
    },
    dropdown3searchInputStyleStyle: {
      backgroundColor: 'slategray',
      borderBottomWidth: 1,
      borderBottomColor: '#FFF',
    },
    dropdownButtonStyle: {
        width: width-20,
        height: 50,
        backgroundColor: '#E9ECEF',
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
      },
      dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
      },
      dropdownButtonArrowStyle: {
        fontSize: 28,
      },
      dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
      dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
      },
      dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
      },
      dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
      },
      dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
      },
  });

export default NewTripScreen;