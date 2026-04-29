// screens/NoteDetailsScreen.tsx  ← REPLACE ENTIRE FILE

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { deleteNote, Note } from '../storage/noteStorage';

export default function NoteDetailsScreen({ route, navigation }: any) {
  const { note }: { note: Note } = route.params;

  const formatDate = (iso: string) => new Date(iso).toLocaleString();

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      `Are you sure you want to delete "${note.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            const success = await deleteNote(note.id);
            if (success) {
              Alert.alert('Deleted', 'Note deleted successfully.', [
                { text: 'OK', onPress: () => navigation.navigate('HomeMain') },
              ]);
            } else {
              Alert.alert('Error', 'Could not find the note to delete.');
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.category}>{note.category || 'General'}</Text>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.content}>{note.content}</Text>
        <View style={styles.timestamps}>
          <Text style={styles.timestampText}>Created: {formatDate(note.createdAt)}</Text>
          <Text style={styles.timestampText}>Updated: {formatDate(note.updatedAt)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditNote', { note })}>
        <Text style={styles.buttonText}>✏️  Edit Note</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.buttonText}>🗑️  Delete Note</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f4f8' },
  card: { backgroundColor: '#fff', padding: 18, borderRadius: 14, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  category: { alignSelf: 'flex-start', backgroundColor: '#e3f2fd', color: '#2196f3', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginBottom: 12, fontWeight: '600', fontSize: 13 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12, color: '#222' },
  content: { fontSize: 16, color: '#444', lineHeight: 24, marginBottom: 18 },
  timestamps: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 12, gap: 4 },
  timestampText: { fontSize: 12, color: '#999' },
  editButton: { backgroundColor: '#43a047', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  deleteButton: { backgroundColor: '#e53935', padding: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  backButton: { marginTop: 14, alignItems: 'center', paddingVertical: 6 },
  backText: { color: '#777', fontWeight: '600', fontSize: 15 },
});