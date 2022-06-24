import React from 'react'
import { useEffect } from 'react'
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import { colors } from '../Constant'
import db from '@react-native-firebase/firestore'
import { doc } from 'prettier'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
const windowWidth = Dimensions.get('window').width

const CategoriesList = ({ route }) => {
    let navigation = useNavigation()
    const [state, setstate] = useState([])
    useEffect(() => {
        const call = async () => {

            let res = await db().collection("ads").where('category', '==', route?.params?.categoryName).get()

            let result = res.docs.map(doc => { return { ...doc.data(), id: doc.id } })
            setstate(result)
            console.log(result)

        }


        call()



    }, [])
    const calculateTime = (date) => {

        const diffDays = Math.round(Math.abs((new Date(date.toDate()) - new Date()) / (1000 * 60 * 60 * 24)))

        if (diffDays == 0) {

            return 'Today'
        } else {
            return diffDays + ' days ago'
        }

    }
    console.log(route.params.categoryName)


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ height: 55, backgroundColor: 'white', elevation: 10, alignItems: 'center', paddingHorizontal: 10, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../Assets/Images/back.png')} style={{ width: 25, height: 25, }} />
                </TouchableOpacity>
                <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 17 }}>{route.params.categoryName}</Text>

            </View>

            {(state.length > 0) ?
                <View style={styles.categoryWrapper}>
                    {
                        state.map((item, i) => {
                            return <TouchableOpacity key={i} style={styles.container} onPress={() => { navigation.navigate('detailScreen', { item: item }) }}>

                                <Image resizeMode='cover' source={{ uri: item.files[0] }} style={styles.images} />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontWeight: 'bold', flex: 1, fontSize: 15 }}>
                                        {item?.title}
                                    </Text>
                                    <Text>

                                    </Text>


                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={require('../Assets/Images/marker.png')} style={{ height: 15, width: 15 }} />
                                    <Text style={{ fontSize: 12, color: 'grey' }}>{item.location.state.long_name}</Text>
                                </View>
                                {
                                    item.createdAt
                                    &&


                                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: 'grey' }}>{calculateTime(item.createdAt)}</Text>
                                }


                            </TouchableOpacity>
                        })
                    }
                </View>
                :
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Image source={require('../Assets/Images/empty.png')} style={{ width: 150, height: 150 }} />
                    <Text>NO DATA</Text>

                </View>
            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {

        width: windowWidth / 2 - 30,
        // height: windowWidth / 3 - 30,

        borderRadius: 5,
        marginVertical: 10

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
    },
    images: {
        width: windowWidth / 2 - 30,
        height: windowWidth / 2.7 - 30,
        borderRadius: 5
    }
})

export default CategoriesList
