// navigation/MainNavigator.tsx  ← REPLACE ENTIRE FILE

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import AddNoteScreen from '../screens/AddNoteScreen';
import NoteDetailsScreen from '../screens/NoteDetailsScreen';
import EditNoteScreen from '../screens/EditNoteScreen';      // ← NEW
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddNote" component={AddNoteScreen} options={{ title: 'Add Note' }} />
      <Stack.Screen name="NoteDetails" component={NoteDetailsScreen} options={{ title: 'Note Details' }} />
      <Stack.Screen name="EditNote" component={EditNoteScreen} options={{ title: 'Edit Note' }} />
    </Stack.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="NotesTab" component={HomeStack} options={{ title: 'Notes' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}