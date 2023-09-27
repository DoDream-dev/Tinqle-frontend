import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NoteBox() {
  return (
      <View style={styles.entire}>
          <Text>NoteBox</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 16,
  },
});