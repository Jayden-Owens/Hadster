import React, { useState } from 'react'
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native'
import { colors } from '../Constants'
import { Picker } from '@react-native-picker/picker';

export default function DropDown({ onChangeText, value, options = [], ...props }) {
    return (
        <View style={styles.inputContainer}>

            <Picker
                style={{ width: '100%' }}
                selectedValue={value}
                onValueChange={(itemValue, itemIndex) =>
                    onChangeText(itemValue)
                }
            >
                {
                    options.map((item, i) => {
                        return <Picker.Item label={item} key={i} value={item} />
                    })
                }

            </Picker>


        </View>

    )
}
const styles = StyleSheet.create({
    inputContainer: {
       
        minHeight: 50,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        borderWidth:1,
        borderColor:'#ccc',
        borderRadius:4,
    },
    input: {
       color:'black',
        fontSize: 14,
        flex: 1
    }

})
