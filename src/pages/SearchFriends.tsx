import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SearchFriends() {
  return (
    <View style={styles.entire}>
      <Text>SearchFriends</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  entire: {
    flex: 1,
    alignItems: 'center'
  },
});