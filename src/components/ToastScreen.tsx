import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Animated, StyleSheet } from 'react-native';

type ToastScreenProps = {message:string, height: number, marginBottom:number, onClose:(value: React.SetStateAction<boolean>) => void};

const ToastScreen = ({message, height, marginBottom, onClose}:ToastScreenProps) => {
  const [isToastVisible, setIsToastVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current; 

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsToastVisible(true);
      onClose(true);
    }, 2000);
    Animated
      .timing(fadeAnim, {
        toValue: isToastVisible ? 1 : 0,
        duration: 500,
        useNativeDriver: true
      })
      .start(() => {
        setIsToastVisible(true);
      });
    return () => clearTimeout(timer);
  }, []);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1000000,
    alignItems: 'center',
    height: height,
    borderRadius: height,
    paddingHorizontal: 20,
    bottom: marginBottom,
    backgroundColor: "rgba(0, 0, 0, 0.7)"
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10,
  },
  toast: {
    position: 'absolute',
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: height,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    color: '#ffffff',
  },
});

  return (
    <>
      {isToastVisible && (
        <Animated.View
          style={styles.container}
        >
          <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
      )}
    </>
  );
};

export default ToastScreen;