// components/NoteCard.tsx  ← REPLACE ENTIRE FILE

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type NoteCardProps = {
  title: string;
  content: string;
  category?: string;
  updatedAt?: string;
  onPress?: () => void;
};

const categoryColors: Record<string, string> = {
  Study: '#e8f5e9',
  Personal: '#fff3e0',
  Ideas: '#f3e5f5',
};

const categoryTextColors: Record<string, string> = {
  Study: '#388e3c',
  Personal: '#e65100',
  Ideas: '#7b1fa2',
};

export default function NoteCard({ title, content, category = 'General', updatedAt, onPress }: NoteCardProps) {
  const bgColor = categoryColors[category] || '#e3f2fd';
  const textColor = categoryTextColors[category] || '#1565c0';

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString() : '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>

      {/* Category badge */}
      <View style={[styles.badge, { backgroundColor: bgColor }]}>
        <Text style={[styles.badgeText, { color: textColor }]}>{category}</Text>
      </View>

      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <Text style={styles.content} numberOfLines={2}>{content}</Text>

      {/* Last updated date */}
      {updatedAt ? (
        <Text style={styles.date}>Updated: {formatDate(updatedAt)}</Text>
      ) : null}

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  content: {
    fontSize: 14,
    color: '#555',
  },
  date: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'right',
  },
});