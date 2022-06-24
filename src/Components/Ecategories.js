import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import { categories, colors } from '../Constant'
import db from '@react-native-firebase/firestore'
const windowWidth = Dimensions.get('window').width

const Ecategories = ({ route }) => {
    const navigation = useNavigation()



    return (
        <View>
            <Text style={styles.headings}>
                Categories
            </Text>

            <View style={styles.categoryWrapper}>
                {
                    categories.map((item, i) => {
                        return <TouchableOpacity onPress={() => { navigation.navigate('CategoriesList', { categoryName: item.value }) }} key={i} style={styles.container}>
                            <Image resizeMode={'contain'} style={{ width: 40, height: 40 }} source={item.image} />
                            <Text style={{ marginTop: 5, fontWeight: 'bold' }}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    })
                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        width: windowWidth / 3 - 30,
        height: windowWidth / 3 - 30,
        elevation: 5,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'

    },
    categoryWrapper: {
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        margin: 15,
        flexDirection: 'row'

    },
    headings: {
        marginLeft: 18,
        fontSize: 17,
        fontWeight: 'bold'
    }
})

export default Ecategories
