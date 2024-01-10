import React, {ReactNode} from 'react';
import {Dimensions, SafeAreaView, ViewStyle} from 'react-native';

export const windowWidth: number = Dimensions.get('window').width;
export const windowHeight: number = Dimensions.get('window').height;

interface SafeProps {
  children: ReactNode;
  color?: string;
}

export const Safe: React.FC<SafeProps> = ({
  children,
  color = 'transparent',
}) => {
  const safeAreaViewStyle: ViewStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: color,
  };

  return <SafeAreaView style={safeAreaViewStyle}>{children}</SafeAreaView>;
};
