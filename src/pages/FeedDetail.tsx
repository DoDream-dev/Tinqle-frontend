import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FeedDetail() {
    return (
        <View style={styles.entire}>
            <Text>FeedDetail</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    entire: {
        flex: 1,
        alignItems: 'center'
    },
});