import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { colors } from '../../Constant'

const Error = ({ message }) => {
    return (
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <View>
                <Image style={styles.icon} source={require('../../Assets/Images/error.png')} />
            </View>
            <Text style={styles.errorText}>{message}</Text>
        </View>
    )
}

export default Error

const styles = StyleSheet.create({
    errorText: {
        color: colors.red
    },
    icon: {
        width: 15,
        height: 15
    }
})
