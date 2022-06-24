import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

const Empty = ({text = 'No Data'}) => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Image
        source={require('../../Assets/Images/empty.png')}
        style={{width: 150, height: 150}}
      />
      <Text style={{fontWeight: 'bold'}}>{text}</Text>
    </View>
  );
};

export default Empty;

const styles = StyleSheet.create({});
