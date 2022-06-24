import {useNavigation} from '@react-navigation/core';
import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.goBack();
      }}>
      <Image
        style={{width: 25, height: 25}}
        resizeMode={'contain'}
        source={require('../../Assets/Images/back.png')}
      />
    </TouchableOpacity>
  );
};

export default BackButton;
