import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Note Taking App</Text>
      <Text style={styles.subtitle}>Wireless Application Development - CO2</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>App Description</Text>
        <Text style={styles.text}>
          This app allows users to create, view, search, and organize notes using a clean and user-friendly mobile interface.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>CO2 Features</Text>
        <Text style={styles.text}>• User-friendly screens and layouts</Text>
        <Text style={styles.text}>• Reusable custom components</Text>
        <Text style={styles.text}>• Stack navigation</Text>
        <Text style={styles.text}>• Bottom tab navigation</Text>
        <Text style={styles.text}>• Search bar and category filters</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Screens Included</Text>
        <Text style={styles.text}>• Home Screen</Text>
        <Text style={styles.text}>• Add Note Screen</Text>
        <Text style={styles.text}>• Note Details Screen</Text>
        <Text style={styles.text}>• Profile Screen</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Navigation Used</Text>
        <Text style={styles.text}>
          Stack Navigator is used for moving between Home, Add Note, and Note Details screens. Bottom Tab Navigator is used to switch between Notes and Profile sections.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f4f8',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: '#444',
    lineHeight: 23,
  },
});