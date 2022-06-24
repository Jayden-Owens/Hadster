import React from 'react'
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'
// import { SearchBox } from '../Components/searchBar'
import { categories, colors } from '../Constant'
import menuIcon from '../Assets/Images/menu.png'
import { SearchBox } from '../Components/searchBox'

const Categories = ({navigation}) => {
    const  isOdd=(num)=> { return num % 2;}
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>

                <View style={styles.headerSection}>
                    {/* <View >

                        <Image resizeMode={'contain'} source={menuIcon} style={{ width: 30, height: 30 }} />
                    </View> */}
                    <View style={styles.space} />
                    <Text style={styles.welcome}>
                        Categories
                    </Text>
                    {/* <View style={styles.space} />
                    <Text style={styles.text}>
                        Find Category 
                    </Text> */}

                    {/* <SearchBox placeholder={'Search Category'} /> */}
                    <View style={styles.space} />

                </View>
                
                <View>
                    {categories.map((item,i)=>{
                        return  <TouchableOpacity onPress={() => { navigation.navigate('CategoriesList', { categoryName: item.value }) }} key={i}  style={[styles.listItem,{backgroundColor:isOdd(i)==0?colors.white:colors.grey}]} key={i} >
                            <Image resizeMode="contain" style={{ width: 35, height: 35 }}  source={item.image}/>
                            <Text style={{fontSize:15,fontWeight:'bold',marginLeft:10}}>
                                {item.name}
                            </Text>
                            </TouchableOpacity>
                    })}
                    
                </View>
                 
               
            </ScrollView>

        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:colors.white
    },
    headerSection: {
        backgroundColor: colors.primary,
        padding: 15
    },
    welcome: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',

    },
    space: {
        margin: 10
    },
    text:{
        color:colors.white,
        margin:8,
        fontSize:16

    },
    listItem:{
        padding:20,
        alignItems:'center',
        flexDirection:'row'
    }


})
export default Categories
