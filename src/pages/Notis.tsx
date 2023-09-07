import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Notis() {
    return (
        <View style={styles.entire}>
            <Text>Notis</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    entire: {
        flex: 1,
        alignItems: 'center'
    },
});