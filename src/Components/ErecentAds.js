import React from 'react';
import {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colors} from '../Constant';
import db from '@react-native-firebase/firestore';
import {doc} from 'prettier';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
const windowWidth = Dimensions.get('window').width;

const ErecentAds = () => {
  let navigation = useNavigation();
  const [state, setstate] = useState([]);
  useEffect(() => {
    const call = async () => {
      db()
        .collection('ads')
        .orderBy('createdAt', 'desc')
        .limit(20)
        .onSnapshot(
          res => {
            if (res) {
              let result = res.docs.map(doc => {
                return {...doc.data(), id: doc.id};
              });
              setstate(result);
            }
          },
          err => {
            console.log(err);
          },
        );
    };

    call();
  }, []);

  const calculateTime = date => {
    const diffDays = Math.round(
      Math.abs((new Date(date.toDate()) - new Date()) / (1000 * 60 * 60 * 24)),
    );

    if (diffDays == 0) {
      return 'Today';
    } else {
      return diffDays + ' days ago';
    }
  };

  return (
    <View>
      <Text style={styles.headings}>Recent Ads</Text>
      <View style={styles.categoryWrapper}>
        {state.map((item, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={styles.container}
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
                <Text style={{fontSize: 12, color: 'grey'}}>
                  {item.location.state.long_name}
                </Text>
              </View>
              {item.createdAt ? (
                <Text style={{fontSize: 10, fontWeight: 'bold', color: 'grey'}}>
                  {calculateTime(item.createdAt)}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
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

export default ErecentAds;
