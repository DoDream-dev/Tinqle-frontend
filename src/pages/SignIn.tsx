import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SignIn() {
    return (
        <View style={styles.entire}>
            <Text>I Love You</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    entire: {
        flex: 1,
        alignItems: 'center',
    },
});