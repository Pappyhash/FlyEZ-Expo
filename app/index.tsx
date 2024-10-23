
// import amplifyconfig from '../src/amplifyconfiguration.json';
// Amplify.configure(amplifyconfig);

// import React from 'react';
// import { Button } from 'react-native';
// import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
// import { Amplify } from 'aws-amplify';
// import config from'../src/amplifyconfiguration.json';

// Amplify.configure(config);

// function SignOutButton() {
//   const { signOut } = useAuthenticator();
//   return <Button title="Sign Out" onPress={signOut} />;
// }

// export default function Index() {
//   return (
    // <Authenticator.Provider>
    //   <Authenticator>
    //     <SignOutButton />
    //   </Authenticator>
    // </Authenticator.Provider>
//   );
// }

// React Imports
import React, { useEffect } from "react";
import { Button, View, StyleSheet, SafeAreaView } from "react-native";
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Amplify Config Imports
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react-native";
import amplifyconfig from '../src/amplifyconfiguration.json';

// API Imports
import { generateClient } from 'aws-amplify/api';
import { getAirlineList, getAirportList } from "../src/graphql/queries";

// Local File Imports
import {airports} from '../src/model/airportModel'
import {airlines} from '../src/model/airlineModel'
import { AirlineModel, AirportModel } from '../src/API';
import TripsScreen from "../src/screens/TripsScreen";
import NewTripScreen from "../src/screens/NewTripScreen";
import FlightDetailsScreen from "../src/screens/FlightDetailsScreen";


Amplify.configure(amplifyconfig);

const SignOutButton = () => {
  const { signOut } = useAuthenticator();

  return (
    <View style={styles.signOutButton}>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

const NavStack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();
const BottomTab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <BottomTab.Navigator
      initialRouteName="Home">
        <BottomTab.Screen
          name="Trips"
          component={TripsNavigator}
          options={{
            headerShown: false,
            tabBarLabel: 'Trips',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="airplane" color={color} size={size} />
            ),
          }}
        />
      <BottomTab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
    </BottomTab.Navigator>
  )
}

function TripsNavigator({navigation, route}) {
  React.useLayoutEffect(() => {

    const routeName = getFocusedRouteNameFromRoute(route);
    if (routeName == "NewConnection"){
      navigation.setOptions({tabBarStyle: {display: 'none'}});
    } else {
      navigation.setOptions({tabBarStyle: {display: 'flex'}});
    }
  })

  return (
    <NavStack.Navigator>
      <TopTab.Screen 
        name="TripsScreen" 
        component={TripsScreen as any}
        options={{title: 'Trips'}}
      />
      <NavStack.Screen 
        name="NewTripScreen" 
        component={NewTripScreen as any}
        options={{title: 'Add New Trip'}}
      />
      <NavStack.Screen
        name="FlightDetailsScreen"
        component={FlightDetailsScreen as any}
        options={{title: 'Flight Details'}}
      />
    </NavStack.Navigator>
  )
}

function Settings() {
  const { signOut } = useAuthenticator();
  return <Button title="Sign Out" onPress={signOut} />;
}

const client = generateClient();

async function fetchAirports () {
  try {
      const queryResponse = await client.graphql({ query: getAirportList });
      const airportList: AirportModel[] = [];

      if (queryResponse.data.getAirportList) {
          queryResponse.data.getAirportList.forEach((airport) => {
              if (airport) { 
                  airports.push(airport);
              }
          });
      }
  } catch(error) {
      console.error('error', error);
  }
}

async function fetchAirlines () {
  try {
      const queryResponse = await client.graphql({ query: getAirlineList });
      const airlineList: AirlineModel[] = [];

      if (queryResponse.data.getAirlineList) {
          queryResponse.data.getAirlineList.forEach((airline) => {
              if (airline) { 
                  airlines.push(airline);
              }
          });
      }
  } catch(error) {
      console.error('error', error);
  }
}
export default function Index() {

  useEffect(() => {
    fetchAirlines();
    fetchAirports();
}, []);

  return (
      <Authenticator.Provider>
        <Authenticator>
          <BottomTabs/>
        </Authenticator>
      </Authenticator.Provider>
  );
};

const styles = StyleSheet.create({
  signOutButton: {
    alignSelf: "flex-end",
  },
});
