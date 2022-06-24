import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { colors } from '../Constant'

const OutlineButton = ({ children, onPress, icon }) => {
    return (
        <TouchableOpacity style={styles.wrapper} onPress={onPress}>
            {icon ? icon : null}
               <Text style={styles.text}>{(children).toUpperCase()}</Text>
        </TouchableOpacity>
    )
}

export default OutlineButton

const styles = StyleSheet.create({
    wrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row'
    },
    text: {

        fontSize: 17,
        fontWeight: 'bold'
    },
    space: {
        margin: 10
    }
})
