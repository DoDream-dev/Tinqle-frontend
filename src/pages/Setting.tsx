import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Setting() {
  return (
    <View style={styles.entire}>
      <Text>Setting</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center'
  },
});