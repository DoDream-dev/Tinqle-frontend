import React, {useState, useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import icon from '../../icon.png';

interface NotificationProps {
  title: string;
  message: string;
}

const NotificationComponent: React.FC<NotificationProps> = ({
  title,
  message,
}) => {
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(true);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isSnackbarVisible) {
      translateY.value = withSpring(0, {mass: 0.1});
      opacity.value = withTiming(1, {
        duration: 50,
        easing: Easing.out(Easing.exp),
      });

      const timeout = setTimeout(() => {
        translateY.value = withSpring(-50);
        opacity.value = withTiming(
          0,
          {duration: 100, easing: Easing.in(Easing.exp)},
          () => {
            runOnJS(setIsSnackbarVisible)(false);
          },
        );
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isSnackbarVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{translateY: translateY.value}],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
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
    </Animated.View>
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
