import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../Constant';

const ToLogin = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Siginin');
        }}
        style={styles.button}>
        <Text style={styles.text}>Sign In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ToLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    backgroundColor: colors.primary,
    height: 50,
    paddingHorizontal: 40,
    borderRadius: 5,
    justifyContent: 'center',
  },
});
