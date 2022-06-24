import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native'
import { useAuth } from '../Context/authContext'
import db from '@react-native-firebase/firestore'
import { colors } from '../Constant'
import Empty from '../Components/Customelements/empty'
const MyFavourites = ({ navigation }) => {
    const { currentUser, isLoggedIn } = useAuth()
    const [data, setdata] = useState([])

    useEffect(() => {
        if (isLoggedIn) {

            db().collection('ads').where('favourite', 'array-contains', currentUser?.uid).onSnapshot((snapshot) => {

                let res = snapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } })
                console.log(res)
                setdata(res)
            })

        }



    }, [isLoggedIn])


    const Item = ({ data }) => {
        return (
            <TouchableOpacity onPress={() => { navigation.navigate('detailScreen', { item: data }) }} style={styles.item} >
                <View>
                    <Image source={{ uri: data.files[0] }} style={{ width: 70, height: 70, borderRadius: 5 }} />
                </View>
                <View style={styles.innerDetail}>
                    <Text numberOfLines={1} style={styles.title}>
                        {data.title}
                    </Text>


                    <View style={{ flexDirection: 'row', margin: 5 }}>

                        <View style={{ backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 5 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>
                                Active
                            </Text>
                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }
    return (
        <SafeAreaView style={styles.container}>

            {
                data.length > 0 ?
                    <FlatList data={data} keyExtractor={item => item.id} renderItem={({ item, index }) => {

                        return <Item data={item} key={index} />



                    }} />
                    :
                    <Empty />
            }

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.white
    },
    item: {
        padding: 10,
        flexDirection: 'row',
        borderBottomColor: colors.grey,
        borderBottomWidth: 1
    },
    innerDetail: {
        marginHorizontal: 10,

    },
    title: {
        fontWeight: 'bold',
        fontSize: 17
    },
    stats: {
        flexDirection: 'row',
        marginTop: 10
    },
    space: {
        margin: 10
    }

})

export default MyFavourites
