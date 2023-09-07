import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FeedList() {
    return (
        <View style={styles.entire}>
            <Text>FeedList</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    entire: {
        flex: 1,
        alignItems: 'center'
    },
});