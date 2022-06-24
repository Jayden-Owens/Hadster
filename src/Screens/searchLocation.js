import axios from 'axios';
import React, {useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SearchBox} from '../Components/searchBox';
import {getLocation, getLocationfromAddress} from '../services';
import geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';
import BackButton from '../Components/Customelements/back';
const SearchLocation = props => {
  console.log(props);

  const [locations, setlocations] = useState([]);
  const [selectedLocation, setselectedLocation] = useState('');
  const handleChangeLocation = async enter => {
    let res = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${enter}&types=(cities)&region=us&type=geocode&key=AIzaSyDZ3lYp0eQMuc3rTiTnfzNl8hiuk1eeg4c`,
    );
    console.log('ya rha response ', res);
    if (res.status == 200) {
      let results = [...res.data.predictions];
      console.log(results);
      setlocations([...results]);
    }
  };
  const handleLocationSelect = async value => {
    let res = await getLocationfromAddress(value);
    console.log(res);
    if (res.status == 200) {
      let data = res.data.results[0].address_components.find(element => {
        return element.types[0] == 'administrative_area_level_1';
      });
      console.log(data);

      let loc = {
        formatted_address: res.data.results[0].formatted_address,
        state: data,
        location: res.data.results[0].geometry.location,
      };
      setselectedLocation(loc);
      props.route.params.getLocation(loc);
      props.navigation.goBack();
    }
  };
  let config = {
    skipPermissionRequests: false,
    authorizationLevel: 'always',
  };

  const currentLocationCall = () => {
    console.log('asasd');
    geolocation.setRNConfiguration(config);
    geolocation.getCurrentPosition(
      async info => {
        // setcurrentLocation({ latitude: info.coords.latitude, longitude: info.coords.longitude })

        let res = await getLocation({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });

        console.log('yaha sa aya response ', {
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
        if (res?.status == 200 && res?.data?.status == 'OK') {
          let data = res.data.results[0].address_components.find(element => {
            return element.types[0] == 'administrative_area_level_1';
          });

          // setfarmattedAddress(res.data.results[0].formatted_address)
          setselectedLocation({
            location: {lat: info.coords.latitude, lng: info.coords.longitude},
            formatted_address: res.data.results[0].formatted_address,
            state: data,
          });
          props.route.params.getLocation({
            location: {lat: info.coords.latitude, lng: info.coords.longitude},
            formatted_address: res.data.results[0].formatted_address,
            state: data,
          });
          props.navigation.goBack();
        }
      },
      err => {
        console.log('a e msla', err);
        if (err.code == 2) {
          Alert.alert('Turn on GPS', 'press Ok after turning it on ', [
            // {
            //     text: "Cancel",
            //     onPress: () => console.log("Cancel Pressed"),
            //     style: "cancel"
            // },
            {
              text: 'OK',
              onPress: () => {
                console.log('OK Pressed');
              },
            },
          ]);
          // call()
        } else if (err.code == 1) {
          console.log('asdasdasdasdasdasd');
          try {
            request(
              Platform.select({
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
              }),
            ).then(res => {
              if (res == 'granted') {
                console.log('grantted ');
                currentLocationCall();
              } else {
                // console.log("Location is not enabled");
              }
            });
          } catch (error) {
            console.log('location set error:', error);
          }
        } else if (err.code == 3) {
          Alert.alert('Unable to Access', 'Add location from search');
        }
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  return (
    <SafeAreaView style={{flex: 1, padding: 10}}>
      <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
        <View>
          <BackButton />
        </View>
        <View style={{flex: 1}}>
          <SearchBox icon="location" onChangeText={handleChangeLocation} />
        </View>
      </View>

      <View>
        <TouchableOpacity
          onPress={currentLocationCall}
          style={{flexDirection: 'row', alignItems: 'center', padding: 15}}>
          <Image
            source={require('../Assets/Images/location.png')}
            style={{width: 25, height: 25, marginRight: 5}}
          />
          <Text>Current Location...</Text>
        </TouchableOpacity>
        {[...locations].map((data, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 15,
                borderTopWidth: 1,
              }}
              onPress={() => handleLocationSelect(data.description)}>
              <Image
                source={require('../Assets/Images/marker.png')}
                style={{width: 25, height: 25, marginRight: 5}}
              />

              <Text style={{fontSize: 16}}>{data.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default SearchLocation;

const styles = StyleSheet.create({});
