/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {

  StyleSheet,
  TouchableOpacity,
  View, Text
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Explorer from './src/Screens/Explorer';
import { colors } from './src/Constant';



const CustomButton = ({ children, onPress }) => {
  return (<View style={styles.CustomButton} onPress={onPress}>

    {children}
  </View>

  )
}
const MyTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View
      style={{
        height: 60,
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
        overflow:'visible'
      }}
    >
      {
        state.routes.map((route, index) => {
          console.log(route)
          const isFocused = state.index === index;
          const { options } = descriptors[route.key]
          return (<>
            {
              index === 0 && (
                <View>
                  {
                    isFocused ?
                      <Text>{route.name}</Text> :
                      <Text>{route.name}</Text>
                  }
                </View>
              )
            }
            {
              index === 1 && (
                <View>
                  {
                    isFocused ?
                      <Text>{route.name}</Text> :
                      <Text>{route.name}</Text>
                  }
                </View>
              )
            }
            {
              index === 2 && (
                <View style={{overflow:'visible'}}>
                  {
                    isFocused ?
                      <Text>{route.name}</Text> :
                      <CustomButton />
                  }
                </View>
              )
            }
            {
              index === 3 && (
                <View>
                  {
                    isFocused ?
                      <Text>{route.name}</Text> :
                      <Text>{route.name}</Text>
                  }
                </View>
              )
            }
            {
              index === 4 && (
                <View>
                  {
                    isFocused ?
                      <Text>{route.name}</Text> :
                      <Text>{route.name}</Text>
                  }
                </View>
              )
            }

          </>)
        })
      }
    </View>

  )

}

const HomeTabs = createBottomTabNavigator()

const TabScreens = () => {
  return (
    <HomeTabs.Navigator tabBarOptions={{tabStyle:{overflow:'visible'}}} sceneContainerStyle={{display:'flex',position:'absolute',overflow:'visible'}} tabBar={(props) => { return <MyTabBar {...props} /> }}  >
      <HomeTabs.Screen name='Home' component={Explorer} />
      <HomeTabs.Screen name='Categories' component={Explorer} />
      <HomeTabs.Screen  name="CreateAds" component={Explorer} />
      <HomeTabs.Screen name="myAds" component={Explorer} />
      <HomeTabs.Screen name="Chat" component={Explorer} />

    </HomeTabs.Navigator>
  )
}


const HomeDrawer = createDrawerNavigator()

const UserScreens = () => {

  return (
    <HomeDrawer.Navigator sceneContainerStyle={{overflow:'visible'}} drawerStyle={{overflow:'visible'}}>
      <HomeDrawer.Screen name="Explore" component={TabScreens} />
    </HomeDrawer.Navigator>
  )
}


const Mainstack = createStackNavigator()

const Main = () => {
  return (
    <Mainstack.Navigator screenOptions={{ headerShown: false , }}>
      <Mainstack.Screen name={'Home'} component={TabScreens} />

    </Mainstack.Navigator>

  )
}

const App = () => {


  return (
    <NavigationContainer>

      <Main />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  CustomButton: {
    bottom: 18,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.6,
    elevation: 8,


  }
});

export default App;
