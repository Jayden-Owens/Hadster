import React, { forwardRef } from 'react'
import { View, StyleSheet, TextInput, Text, Image } from 'react-native'
import Icon from '../Assets/Images/searchIcon.png'
import { colors } from '../Constant'
export const SearchBox = forwardRef(({ onChangeText, icon, ...props }, ref) => {
    return (
        <View style={styles.inputContainer}>

            {
                icon && icon == 'location' ?
                    <Image resizeMode={'contain'} source={require("../Assets/Images/marker.png")} style={{ width: 20, height: 20 }} />
                    :
                    <Image resizeMode={'contain'} source={Icon} style={{ width: 15, height: 15 }} />

            }
            <TextInput  ref={ref} placeholderTextColor={"#ccc"} onChangeText={onChangeText} style={styles.input}  {...props} />
        </View>

    )
})
const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: colors.white,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 10
    },
    input: {
        color: '#000',
        fontSize: 16,
        flex: 1
    }

})
