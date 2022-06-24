/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';

import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Explorer from './src/Screens/Explorer';
import {colors} from './src/Constant';
import MyAds from './src/Screens/Myads';
import image from './src/Assets/Images/homef.png';
import CreateAds from './src/Screens/CreateAds';
import {AuthProvider, useAuth} from './src/Context/authContext';
import Signin from './src/Screens/Signin';
import Categories from './src/Screens/Categories';
import DetailScreen from './src/Screens/DetailScreen';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Chat from './src/Screens/Chat';
import ChatScreen from './src/Screens/ChatScreen';
import CategoriesList from './src/Screens/CategoriesList';
import SearchScreen from './src/Screens/searchScreen';
import SearchLocation from './src/Screens/searchLocation';
import ToLogin from './src/Components/ToLogin';
import Signup from './src/Screens/Signup';
import MyFavourites from './src/Screens/myFavrouites';
import FilledButton from './src/Components/filledButton';
import Avatar from './src/Components/Customelements/avatar';
let icons = {
  home: {
    focused: require('./src/Assets/Images/homef.png'),
    unfocused: require('./src/Assets/Images/home.png'),
  },
  chat: {
    focused: require('./src/Assets/Images/chatf.png'),
    unfocused: require('./src/Assets/Images/chat.png'),
  },
  plus: require('./src/Assets/Images/plus.png'),
  menu: {
    focused: require('./src/Assets/Images/menuf.png'),
    unfocused: require('./src/Assets/Images/menuu.png'),
  },
  ads: {
    focused: require('./src/Assets/Images/adsf.png'),
    unfocused: require('./src/Assets/Images/adsu.png'),
  },
};

const AdsTab = createMaterialTopTabNavigator();

function AdsTabs() {
  const {isLoggedIn} = useAuth();

  if (!isLoggedIn) {
    return <ToLogin />;
  }
  return (
    <AdsTab.Navigator>
      <AdsTab.Screen
        name="MyAds"
        options={{title: () => <Text> My Ads</Text>}}
        component={MyAds}
      />
      <AdsTab.Screen
        name="Favorites"
        options={{title: () => <Text> Favorites</Text>}}
        component={MyFavourites}
      />
    </AdsTab.Navigator>
  );
}

const CustomButton = ({children, onPress}) => {
  return (
    <TouchableOpacity style={styles.CustomButton} onPress={onPress}>
      <View style={styles.innerPlus}>{children}</View>
    </TouchableOpacity>
  );
};
const Icon = ({source}) => (
  <Image source={source} resizeMode={'contain'} style={{width: 25}} />
);
const HomeDrawer = createDrawerNavigator();

const UserScreens = () => {
  const {logout, currentUser, isLoggedIn} = useAuth();
  console.log(currentUser);
  const CustomDrawerContent = props => {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        {isLoggedIn ? (
          <View style={{flex: 1, padding: 20}}>
            <View style={{alignItems: 'center', flex: 1}}>
              {currentUser?.photoURL ? (
                <Image
                  source={{uri: currentUser?.photoURL}}
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 80,
                    backgroundColor: colors.grey,
                    marginBottom: 10,
                  }}
                />
              ) : (
                <Avatar
                  style={{
                    height: 80,
                    width: 80,
                    borderRadius: 80,
                    backgroundColor: colors.grey,
                    marginBottom: 10,
                  }}
                />
              )}

              <Text style={{fontWeight: 'bold', fontSize: 18}}>
                {currentUser?.displayName}
              </Text>
            </View>
            {/* <DrawerContentScrollView  {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView> */}
            <View>
              <FilledButton onPress={() => logout()}> LOGOUT</FilledButton>
            </View>
          </View>
        ) : (
          <ToLogin />
        )}
      </SafeAreaView>
    );
  };
  return (
    <HomeDrawer.Navigator
      drawerContent={props => CustomDrawerContent(props)}
      sceneContainerStyle={{overflow: 'visible'}}>
      <HomeDrawer.Screen name="Explore" component={Explorer} />
    </HomeDrawer.Navigator>
  );
};
const HomeTabs = createBottomTabNavigator();

const TabScreens = () => {
  return (
    <HomeTabs.Navigator
      sceneContainerStyle={{overflow: 'visible'}}
      tabBarOptions={{style: {height: 60}, showLabel: false}}>
      <HomeTabs.Screen
        options={{
          title: 'Ads',
          tabBarIcon: ({focused}) =>
            focused ? (
              <Icon source={icons.home.focused} />
            ) : (
              <Icon source={icons.home.unfocused} />
            ),
        }}
        name="Home"
        component={UserScreens}
      />
      <HomeTabs.Screen
        name="Categories"
        options={{
          title: 'Ads',
          tabBarIcon: ({focused}) =>
            focused ? (
              <Icon source={icons.menu.focused} />
            ) : (
              <Icon source={icons.menu.unfocused} />
            ),
        }}
        component={Categories}
      />
      <HomeTabs.Screen
        key={0}
        options={{
          tabBarLabel: '',
          tabBarButton: props => {
            return <CustomButton {...props} />;
          },
          tabBarIcon: ({focused}) => <Icon source={icons.plus} />,
        }}
        name="CreateAds"
        component={CreateAds}
      />

      <HomeTabs.Screen
        options={{
          title: 'Ads',
          tabBarIcon: ({focused}) =>
            focused ? (
              <Icon source={icons.ads.focused} />
            ) : (
              <Icon source={icons.ads.unfocused} />
            ),
        }}
        name="myAd"
        component={AdsTabs}
      />

      <HomeTabs.Screen
        options={{
          title: 'Chat',
          tabBarIcon: ({focused}) =>
            focused ? (
              <Icon source={icons.chat.focused} />
            ) : (
              <Icon source={icons.chat.unfocused} />
            ),
        }}
        name="Chats"
        component={Chat}
      />
    </HomeTabs.Navigator>
  );
};

const Mainstack = createStackNavigator();

const Main = () => {
  let {currentUser} = useAuth();
  return (
    <Mainstack.Navigator screenOptions={{headerShown: false}}>
      <Mainstack.Screen name={'Home'} component={TabScreens} />
      <Mainstack.Screen name={'detailScreen'} component={DetailScreen} />
      <Mainstack.Screen name={'Chat'} component={ChatScreen} />
      <Mainstack.Screen name={'CategoriesList'} component={CategoriesList} />
      <Mainstack.Screen name={'searchScreen'} component={SearchScreen} />
      <Mainstack.Screen name={'searchlocation'} component={SearchLocation} />
      <Mainstack.Screen key={1} name={'modifyads'} component={CreateAds} />

      {!currentUser && (
        <>
          <Mainstack.Screen name={'Siginin'} component={Signin} />
          <Mainstack.Screen name={'Siginup'} component={Signup} />
        </>
      )}
    </Mainstack.Navigator>
  );
};

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 5000);
  }, []);
  return (
    <NavigationContainer>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  CustomButton: {
    backgroundColor: colors.white,
    height: 60,
    width: 60,
    borderRadius: 35,
    marginTop: -20,

    zIndex: 10,

    alignItems: 'center',
    justifyContent: 'center',
  },
  innerPlus: {
    backgroundColor: colors.primary,
    height: 50,
    width: 50,
    borderRadius: 40,
  },
});

export default App;
