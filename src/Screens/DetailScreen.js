import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Linking,
  ScrollView,
} from 'react-native';
import FilledButton from '../Components/filledButton';
import OutlineButton from '../Components/OutlineButton';
import {colors} from '../Constant';
import db from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/firestore';
import {useAuth} from '../Context/authContext';
const DetailScreen = ({route, navigation}) => {
  console.log(route);
  const {item} = route.params;
  const [itemcontent, setitem] = useState(item);
  const [showImage, setshowImage] = useState(item.files[0]);
  useEffect(() => {
    if (currentUser?.uid == item.Userid) {
      return;
    }
    db()
      .collection('ads')
      .doc(item.id || item.objectID)
      .set(
        {
          visits: firebase.FieldValue.increment(1),
        },
        {merge: true},
      );
  }, []);

  const {currentUser, isLoggedIn} = useAuth();
  console.log(currentUser);

  const checkFavourite = () => {
    let index = itemcontent?.favourite?.findIndex((value, i) => {
      return value == currentUser.uid;
    });

    if (index == -1) {
      return false;
    } else {
      return index;
    }
  };
  console.log(itemcontent);
  const addToFavourite = () => {
    let newItem = {...itemcontent};

    if (checkFavourite() !== 0 && !checkFavourite()) {
      if (Array.isArray(newItem.favourite)) {
        newItem.favourite.push(currentUser.uid);
      } else {
        newItem.favourite = [currentUser.uid];
      }

      db()
        .collection('ads')
        .doc(item.id || item.objectID)
        .update({
          favourite: newItem.favourite,
        });
      setitem(newItem);
    } else {
      newItem.favourite.splice(checkFavourite(), 1);

      db()
        .collection('ads')
        .doc(item.id || item.objectID)
        .update({
          favourite: newItem.favourite,
        });
      setitem(newItem);
    }
  };

  console.log(itemcontent);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../Assets/Images/back.png')}
            style={{width: 25, height: 25}}
          />
        </TouchableOpacity>
        {isLoggedIn && (
          <TouchableOpacity onPress={addToFavourite}>
            <Image
              source={
                checkFavourite() || checkFavourite() === 0
                  ? require('../Assets/Images/heartfilled.png')
                  : require('../Assets/Images/heart.png')
              }
              style={{width: 25, height: 25}}
            />
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={{paddingBottom: 100}}>
        <View
          style={{backgroundColor: '#F4F5F9', padding: 20, marginBottom: 10}}>
          <Image
            source={{uri: showImage}}
            resizeMode={'contain'}
            style={styles.Image}
          />
        </View>
        <View style={styles.thumbnailboxWrapper}>
          {Array.isArray(item.files) &&
            item.files?.map((val, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setshowImage(val);
                  }}>
                  <Image
                    source={{uri: val}}
                    resizeMode={'contain'}
                    style={styles.Imagethumnail}
                  />
                </TouchableOpacity>
              );
            })}
        </View>
        <View style={styles.primaryDetail}>
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.space} />
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../Assets/Images/marker.png')}
                style={{height: 20, width: 20}}
              />
              <Text style={{fontSize: 14, color: 'grey'}}>
                {item?.location?.state?.long_name}
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.heading}>For Sale</Text>
        <View style={{padding: 10}}>
          {Array.isArray(item.partsPricing) &&
            item?.partsPricing.map((value, i) => {
              return (
                <View
                  key={value.id}
                  style={{
                    flexDirection: 'row',
                    marginVertical: 5,
                    justifyContent: 'space-between',
                  }}>
                  <Text>
                    {i + 1}. {value.part.toUpperCase()}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: colors.primary,
                      fontSize: 16,
                    }}>
                    {'$'}
                    {value.price}
                  </Text>
                </View>
              );
            })}
        </View>
        <View style={styles.space} />
        <View style={styles.space} />
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../Assets/Images/brand.png')}
              style={{height: 25, width: 25}}
            />
            <Text style={{fontWeight: 'bold'}}>
              {item.brand?.toUpperCase()}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {item.condition == 'Used' ? (
              <Image
                source={require('../Assets/Images/used.png')}
                style={{height: 30, width: 30}}
              />
            ) : (
              <Image
                source={require('../Assets/Images/new.png')}
                style={{height: 25, width: 25}}
              />
            )}
            <Text style={{fontWeight: 'bold'}}>
              {item.condition?.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.space} />
        <View style={styles.details}>
          <Text style={styles.heading}>Details</Text>
          <Text style={{fontSize: 17}}>{item.description}</Text>
        </View>
      </ScrollView>

      <View style={styles.space} />
      {currentUser && currentUser?.uid == item.Userid ? (
        <View style={styles.bottomBox}>
          <View style={styles.flex1}>
            <OutlineButton
              onPress={() => {
                navigation.navigate('modifyads', {toupdate: true, item});
              }}>
              MODIFY
            </OutlineButton>
          </View>
          <View style={styles.space} />
          <View style={styles.flex1}>
            <FilledButton
              onPress={() => {
                db()
                  .collection('ads')
                  .doc(item.id || item.objectID)
                  .delete()
                  .then(() => {
                    navigation.goBack();
                  });
              }}>
              DELETE
            </FilledButton>
          </View>
        </View>
      ) : (
        <View style={styles.bottomBox}>
          <View style={styles.flex1}>
            <OutlineButton
              onPress={() => {
                Linking.openURL(`tel:${'03008501217'}`);
              }}>
              Call
            </OutlineButton>
          </View>
          <View style={styles.space} />
          <View style={styles.flex1}>
            <FilledButton
              onPress={() => {
                if (isLoggedIn) {
                  navigation.navigate('Chat', {
                    name: item.userDetail.name,
                    uid: item.Userid,
                    // status: typeof (item.status) == "string" ? item.status : item.status.toDate().toString()
                  });
                } else {
                  navigation.navigate('Siginin');
                }
              }}>
              Chat
            </FilledButton>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginVertical: 15,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
  },
  thumbnailboxWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  Image: {
    width: width - 80,
    height: 200,
    borderRadius: 5,
    overflow: 'hidden',
  },
  Imagethumnail: {
    width: 80,
    height: 40,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  primaryDetail: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  bottomBox: {
    position: 'absolute',
    bottom: 1,
    width: width,
    paddingHorizontal: 15,
    paddingVertical: 25,
    flexDirection: 'row',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 18,
  },
  space: {
    margin: 5,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  flex1: {
    flex: 1,
  },
});

export default DetailScreen;
