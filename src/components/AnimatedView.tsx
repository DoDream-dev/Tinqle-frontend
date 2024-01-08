import React, {ReactChild, useEffect, useState} from 'react';
import {Animated, Easing, View} from 'react-native';

export function FadeDownView({
  duration,
  children,
}: {
  duration?: number;
  children: ReactChild;
}) {
  const value = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(value, {
      toValue: 1,
      duration: duration || 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: value,
        transform: [
          {
            translateY: value.interpolate({
              inputRange: [0, 1],
              outputRange: [-24, 0],
            }),
          },
        ],
      }}>
      {children}
    </Animated.View>
  );
}
