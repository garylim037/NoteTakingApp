// screens/AddNoteScreen.tsx  ← REPLACE ENTIRE FILE

import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { createNote } from '../storage/noteStorage';

const categories = ['Study', 'Personal', 'Ideas'];

export default function AddNoteScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Study');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [saving, setSaving] = useState(false);

  const validate = (): boolean => {
    let valid = true;
    if (!title.trim()) {
      setTitleError('Title is required.'); valid = false;
    } else if (title.trim().length < 3) {
      setTitleError('Title must be at least 3 characters.'); valid = false;
    } else { setTitleError(''); }

    if (!content.trim()) {
      setContentError('Content cannot be empty.'); valid = false;
    } else if (content.trim().length < 5) {
      setContentError('Content must be at least 5 characters.'); valid = false;
    } else { setContentError(''); }

    return valid;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      await createNote(title, content, category);
      Alert.alert('Success', 'Note saved successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>New Note</Text>

      <Text style={styles.label}>Title *</Text>
      <TextInput
        style={[styles.input, titleError ? styles.inputError : null]}
        placeholder="Enter note title (min 3 characters)"
        value={title}
        onChangeText={text => { setTitle(text); if (titleError) setTitleError(''); }}
      />
      {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}

      <Text style={styles.label}>Content *</Text>
      <TextInput
        style={[styles.input, styles.textArea, contentError ? styles.inputError : null]}
        placeholder="Enter note content (min 5 characters)"
        value={content}
        onChangeText={text => { setContent(text); if (contentError) setContentError(''); }}
        multiline
      />
      {contentError ? <Text style={styles.errorText}>{contentError}</Text> : null}

      <Text style={styles.label}>Category</Text>
      <View style={styles.categoryContainer}>
        {categories.map(item => (
          <TouchableOpacity
            key={item}
            style={[styles.categoryChip, category === item && styles.activeCategoryChip]}
            onPress={() => setCategory(item)}
          >
            <Text style={[styles.categoryText, category === item && styles.activeCategoryText]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Note'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f4f8' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 16, color: '#222' },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 4 },
  input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 4, fontSize: 16, borderWidth: 1, borderColor: '#ddd' },
  inputError: { borderColor: '#e53935' },
  textArea: { height: 120, textAlignVertical: 'top' },
  errorText: { color: '#e53935', fontSize: 12, marginBottom: 8, marginLeft: 4 },
  categoryContainer: { flexDirection: 'row', marginBottom: 20, marginTop: 4 },
  categoryChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#fff', marginRight: 8, borderWidth: 1, borderColor: '#ddd' },
  activeCategoryChip: { backgroundColor: '#2196f3', borderColor: '#2196f3' },
  categoryText: { color: '#333' },
  activeCategoryText: { color: '#fff' },
  button: { backgroundColor: '#4a90e2', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  buttonDisabled: { backgroundColor: '#aaa' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelButton: { alignItems: 'center', paddingVertical: 10 },
  cancelText: { color: '#888', fontSize: 15 },
});