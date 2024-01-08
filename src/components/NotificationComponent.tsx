import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withTiming,
//   Easing,
//   runOnJS,
// } from 'react-native-reanimated';

interface NotificationProps {
  title: string;
  message: string;
  icon: number;
}

const NotificationComponent: React.FC<NotificationProps> = ({
  title,
  message,
  icon,
}) => {
  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.icon} />
      <View style={styles.textContainer}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.now}>now</Text>
        </View>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 9,
    borderRadius: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    margin: 8,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginRight: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222222',
  },
  message: {
    fontSize: 15,
    fontWeight: 'normal',
    color: '#222222',
  },
  now: {
    fontWeight: 'normal',
    color: '#3F3F3F',
  },
});

export default NotificationComponent;
