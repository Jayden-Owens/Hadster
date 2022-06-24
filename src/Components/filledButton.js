import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../Constant';

const FilledButton = ({children, onPress, loading}) => {
  return (
    <TouchableOpacity
      disabled={loading}
      onPress={onPress}
      style={styles.wrapper}>
      {loading && (
        <>
          <ActivityIndicator color="white" />
          <View style={styles.space} />
        </>
      )}
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

export default FilledButton;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    color: colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
  space: {
    margin: 10,
  },
});
