import React from 'react';
import {
  RefreshControl,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
// import { SearchBox } from '../Components/searchBar'
import {colors} from '../Constant';
import menuIcon from '../Assets/Images/menu.png';
import {SearchBox} from '../Components/searchBox';
// import Ecategories from '../Components/Ecategories'
import ErecentAds from '../Components/ErecentAds';
import Ecategories from '../Components/Ecategories';
import {useAuth} from '../Context/authContext';
import FilledButton from '../Components/filledButton';
import DrawerMenu from '../Components/Customelements/drawerMenu';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Explorer = ({navigation}) => {
  const {logout} = useAuth();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DrawerMenu />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.headerSection}>
          <TouchableOpacity
            onPress={() => {
              navigation.openDrawer();
            }}>
            <Image
              resizeMode={'contain'}
              source={menuIcon}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
          <View style={styles.space} />
          <Text style={styles.welcome}>Welcome!</Text>
          <View style={styles.space} />
          <Text style={styles.text}> What are you looking for?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('searchScreen');
            }}>
            <SearchBox
              placeholder={'Search Here'}
              disabled={true}
              editable={false}
            />
          </TouchableOpacity>
          <View style={styles.space} />
        </View>
        {/* <FilledButton onPress={logout}>logout</FilledButton> */}
        <View style={styles.space} />
        <View style={styles.space} />

        <Ecategories refreshing={refreshing} />
        <ErecentAds refreshing={refreshing} />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: colors.primary,
    padding: 15,
  },
  welcome: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
  },
  space: {
    margin: 10,
  },
  text: {
    color: colors.white,
    margin: 8,
    fontSize: 16,
  },
});
export default Explorer;
