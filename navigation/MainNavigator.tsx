import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import AddNoteScreen from '../screens/AddNoteScreen';
import NoteDetailsScreen from '../screens/NoteDetailsScreen';
import EditNoteScreen from '../screens/EditNoteScreen';
import AboutScreen from '../screens/AboutScreen';

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
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

         if (route.name === 'NotesTab') {
          iconName = focused ? 'document-text' : 'document-text-outline';
        } else if (route.name === 'AboutTab') {
          iconName = focused ? 'person' : 'person-outline';
        }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="NotesTab" component={HomeStack} options={{ title: 'Notes' }} />
      <Tab.Screen name="AboutTab" component={AboutScreen} options={{ title: 'About' }} />
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
