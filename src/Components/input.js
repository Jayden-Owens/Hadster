import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {colors} from '../Constant';

const Input = ({
  icon,
  placeholder,
  multiline,
  numberOfLines,
  onChnageText,
  value,
  type,
}) => {
  return (
    <View style={styles.container}>
      {/* {icon ? icon:null } */}
      <TextInput
        secureTextEntry={type == 'password'}
        onChangeText={onChnageText}
        placeholderTextColor={'grey'}
        value={value}
        numberOfLines={numberOfLines}
        placeholder={placeholder}
        multiline={multiline ? true : false}
        style={{
          flex: 1,
          fontSize: 15,
          paddingHorizontal: 10,
          paddingVertical: 5,
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          color: 'black',
        }}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // paddingVertical:,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 0,
    // height:30
  },
});
