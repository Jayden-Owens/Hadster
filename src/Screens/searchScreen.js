import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {colors} from '../Constant';
import geolocation from 'react-native-geolocation-service';

import algoliasearch from 'algoliasearch';
import {
  InstantSearch,
  connectSearchBox,
  connectInfiniteHits,
} from 'react-instantsearch-native';
import {SearchBox} from '../Components/searchBox';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {getLocation, getLocationfromAddress} from '../services';
import {PERMISSIONS} from 'react-native-permissions';
import BackButton from '../Components/Customelements/back';

const searchClient = algoliasearch(
  '4YUPGRIJL8',
  'e4e1f356ffc25b45735c67cdc48a08d3',
);
const index = searchClient.initIndex('ads');
let config = {
  skipPermissionRequests: false,
  authorizationLevel: 'always',
};
const InfiniteHits = props => {
  const navigation = useNavigation();
  let data = props.hits;
  console.log(data);
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 10,
      }}>
      {data.map((item, i) => {
        return (
          <TouchableOpacity
            key={i}
            style={styles.itemContainer}
            onPress={() => {
              navigation.navigate('detailScreen', {item: item});
            }}>
            <Image
              resizeMode="cover"
              source={{uri: item.files[0]}}
              style={styles.images}
            />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontWeight: 'bold', flex: 1, fontSize: 15}}>
                {item?.title}
              </Text>
              <Text></Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../Assets/Images/marker.png')}
                style={{height: 15, width: 15}}
              />
              <Text style={{fontSize: 12, color: 'grey'}}>{'Faisalabad'}</Text>
            </View>

            <Text style={{fontSize: 10, fontWeight: 'bold', color: 'grey'}}>
              2 days ago
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const SearchBoxInner = props => {
  console.log(props);
  return (
    <View style={styles.background}>
      <SearchBox
        key={2}
        onFocus={() => props.setlocationfoces(true)}
        placeholder={'location...'}
        onChangeText={value => {
          props.handleChangeLocation(value);
        }}
      />
      <View style={{margin: 3}}></View>
      <SearchBox
        key={1}
        onFocus={() => props.setlocationfoces(false)}
        placeholder={'Search...'}
        onChangeText={value => {
          props.refine(value);
        }}
      />
    </View>
  );
};

// const ConnectedInfiniteHits = connectInfiniteHits(InfiniteHits)
// const ConnectedSearchBox = connectSearchBox(SearchBoxInner)

const Categories = () => {
  const [search, setsearch] = useState('');

  const [locationfoces, setlocationfoces] = useState(false);
  const [locations, setlocations] = useState([]);
  const searchInputref = useRef(null);
  const [selectedLocation, setselectedLocation] = useState('');
  const [locationinput, setlocationinput] = useState('');
  const [searchResults, setsearchResults] = useState([]);
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
          setselectedLocation({
            location: {lat: info.coords.latitude, lng: info.coords.longitude},
          });
          setlocationinput(res.data.results[0].formatted_address);
          searchInputref.current.focus();
          // setfarmattedAddress(res.data.results[0].formatted_address)
          // setselectedLocation({
          //     location: { lat: info.coords.latitude, lng: info.coords.longitude },
          //     formatted_address: res.data.results[0].formatted_address,
          //     state: data,

          // })
          // props.route.params.getLocation({
          //     location: { lat: info.coords.latitude, lng: info.coords.longitude },
          //     formatted_address: res.data.results[0].formatted_address,
          //     state: data,

          // })
          // props.navigation.goBack()
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
  console.log(locationfoces);
  const handleChangeLocation = async enter => {
    setlocationinput(enter);
    let res = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${enter}&types=(cities)&region=us&type=geocode&key=AIzaSyDZ3lYp0eQMuc3rTiTnfzNl8hiuk1eeg4c`,
    );
    console.log(res);
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

      let loc = {
        location: res.data.results[0].geometry.location,
      };
      setselectedLocation(loc);
      setlocationinput(value);
      searchInputref.current.focus();

      console.log(loc);
    }
  };
  useEffect(() => {
    currentLocationCall();
  }, []);
  const handleChange = text => {
    if (selectedLocation) {
      index
        .search(text, {
          aroundLatLng: `${selectedLocation.location.lat},${selectedLocation.location.lng}`,
        })
        .then(({hits}) => {
          setsearchResults(hits);
        });
    } else {
      index.search(text).then(({hits}) => {
        if (hits) {
          setsearchResults(hits);
        }
      });
    }
  };
  console.log(selectedLocation ? true : false, 'asdasdasd');
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          {/* <InstantSearch
                        searchClient={searchClient}
                        indexName="ads"

                    // onSearchStateChange={setsearch}
                    // searchState={search}
                    >

                        <ConnectedSearchBox handleChangeLocation={handleChangeLocation} setlocationfoces={setlocationfoces} />

                        {
                            !locationfoces ?
                                <ConnectedInfiniteHits />
                                : null}

                    </InstantSearch> */}
          <View style={styles.background}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View>
                <BackButton />
              </View>
              <View style={{flex: 1}}>
                <SearchBox
                  key={2}
                  onFocus={() => setlocationfoces(true)}
                  icon={'location'}
                  placeholder={'location...'}
                  value={locationinput}
                  onChangeText={value => {
                    handleChangeLocation(value);
                  }}
                />
              </View>
            </View>
            <View style={{margin: 3}}></View>
            <SearchBox
              ref={searchInputref}
              key={1}
              onFocus={() => setlocationfoces(false)}
              placeholder={'Search...'}
              onChangeText={value => {
                handleChange(value);
              }}
            />
          </View>
        </View>

        {locationfoces ? (
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
            {locations.map((data, i) => {
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
        ) : (
          <InfiniteHits hits={searchResults} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
const windowWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
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
  listItem: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputContainer: {
    backgroundColor: colors.white,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  background: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  itemContainer: {
    width: windowWidth / 2 - 30,
    // height: windowWidth / 3 - 30,

    borderRadius: 5,
    marginVertical: 10,
  },
  categoryWrapper: {
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    margin: 15,
    flexDirection: 'row',
  },
  headings: {
    marginLeft: 18,
    fontSize: 17,
    fontWeight: 'bold',
  },
  images: {
    width: windowWidth / 2 - 30,
    height: windowWidth / 2.7 - 30,
    borderRadius: 5,
  },
});

export default Categories;
