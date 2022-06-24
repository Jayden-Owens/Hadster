import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../Constant';

export default function Avatar({style, src}) {
  return (
    <View style={[styles.container, style]}>
      <Image
        resizeMode={'contain'}
        source={src && src ? src : require('../../Assets/Images/Profile.png')}
        style={{
          overflow: 'hidden',
          width: style?.width || 100,
          height: style?.height || 100,
          borderRadius: 60,
          marginTop: 5,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 60,
    overflow: 'hidden',
    backgroundColor: colors.secondary,
  },
});
