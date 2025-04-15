import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CurrentFlightsScreen from './CurrentFlightsScreen';
import PastFlightScreen from './PastFlightScreen';

const TopTab = createMaterialTopTabNavigator();

const TripsScreen = ({navigation}) => {
  return (
    <TopTab.Navigator>
      <TopTab.Screen 
      name="Upcoming Trips" 
      component={CurrentFlightsScreen}
      options={
        {title: 'Upcoming Trips'}
      } />
      <TopTab.Screen 
      name="Past Trips" 
      component={PastFlightScreen}
      options={
        {title: 'Past Trips'}
      } />
    </TopTab.Navigator>
  );
};
export default TripsScreen;
