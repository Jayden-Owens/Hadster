import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MenuDrawer from 'react-native-side-drawer'
const DrawerMenu = () => {
    const [open, setopen] = useState(false)
    return (
        <View>
            <MenuDrawer
                open={open}
                drawerContent={<View><Text>asdasdasdasd</Text></View>}
                drawerPercentage={45}
                animationTime={250}
                overlay={true}
                opacity={0.4}
            >
                
            </MenuDrawer>
        </View>
    )
}

export default DrawerMenu

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
      zIndex: 0
    },
    animatedBox: {
      flex: 1,
      backgroundColor: "#38C8EC",
      padding: 10
    },
    body: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F04812'
    }
  })
  