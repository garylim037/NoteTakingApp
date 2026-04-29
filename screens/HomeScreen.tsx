// screens/HomeScreen.tsx  ← REPLACE ENTIRE FILE

import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NoteCard from '../components/NoteCard';
import { getAllNotes, seedNotesIfEmpty, Note } from '../storage/noteStorage';

const categories = ['All', 'Study', 'Personal', 'Ideas'];

export default function HomeScreen({ navigation }: any) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const loadNotes = async () => {
    setLoading(true);
    await seedNotesIfEmpty();
    const saved = await getAllNotes();
    setNotes(saved);
    setLoading(false);
  };

  // Reloads every time screen comes into focus (after add/edit/delete)
  useFocusEffect(useCallback(() => { loadNotes(); }, []));

  const filteredNotes = notes.filter(note => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      note.content.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Notes</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search notes..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.categoryContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryChip, selectedCategory === category && styles.activeCategoryChip]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.activeCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2196f3" style={{ marginTop: 40 }} />
      ) : filteredNotes.length === 0 ? (
        <Text style={styles.emptyText}>No notes found. Add one!</Text>
      ) : (
        <FlatList
          data={filteredNotes}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <NoteCard
              title={item.title}
              content={item.content}
              category={item.category}
              updatedAt={item.updatedAt}
              onPress={() => navigation.navigate('NoteDetails', { note: item })}
            />
          )}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddNote')}>
        <Text style={styles.addButtonText}>+ ADD NEW NOTE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f4f8' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 16, color: '#222' },
  searchInput: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#ddd' },
  categoryContainer: { flexDirection: 'row', marginBottom: 16, flexWrap: 'wrap' },
  categoryChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, marginBottom: 4 },
  activeCategoryChip: { backgroundColor: '#2196f3' },
  categoryText: { color: '#333', fontWeight: '500' },
  activeCategoryText: { color: '#fff' },
  emptyText: { textAlign: 'center', marginTop: 60, color: '#999', fontSize: 16 },
  addButton: { backgroundColor: '#2196f3', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
});