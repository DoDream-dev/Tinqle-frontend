import React, {useState} from 'react';
import {TouchableOpacity, Animated, StyleProp, ViewStyle} from 'react-native';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  disabledStyle?: StyleProp<ViewStyle>;
}

const usePressAnimation = (
  initialValue = 1,
  toValue = 0.97,
): {
  scaleValue: Animated.Value;
  handlePressIn: () => void;
  handlePressOut: () => void;
} => {
  const [scaleValue] = useState(new Animated.Value(initialValue));

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: toValue,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: initialValue,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return {
    scaleValue,
    handlePressIn,
    handlePressOut,
  };
};

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onPress,
  onLongPress,
  style,
  disabled = false,
  disabledStyle,
}) => {
  const {scaleValue, handlePressIn, handlePressOut} = usePressAnimation();
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  return (
    <AnimatedTouchableOpacity
      onLongPress={onLongPress}
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      style={[
        // {transform: [{scale: scaleValue}]},
        style,
        disabled ? disabledStyle : {}, // Add gray style when disabled.
      ]}>
      {children}
    </AnimatedTouchableOpacity>
  );
};

export default AnimatedButton;
