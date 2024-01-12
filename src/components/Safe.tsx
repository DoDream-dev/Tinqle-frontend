import React, {ReactNode} from 'react';
import {Dimensions, SafeAreaView, ViewStyle} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {StatusBar, Platform} from 'react-native';

// export const StatusBarHeight =
//   Platform.OS === 'ios' ? -30 : StatusBar.currentHeight;
export const StatusBarHeight =
  Platform.OS === 'ios' ? getStatusBarHeight(true) : StatusBar.currentHeight;

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
