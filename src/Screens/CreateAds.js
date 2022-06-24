import React, {useCallback, useEffect} from 'react';
import {useState} from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ToLogin from '../Components/ToLogin';
import {useAuth} from '../Context/authContext';
import Input from '../Components/input';
import {colors} from '../Constant';
import FilledButton from '../Components/filledButton';
import Dropdown from '../Components/DropDown';
import * as ImagePicker from 'react-native-image-picker';
import db from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Error from '../Components/Customelements/error';
import {useFocusEffect} from '@react-navigation/core';

const CreateAds = ({navigation, route}) => {
  const {isLoggedIn, currentUser} = useAuth();
  const [partsPricing, setRoutine] = useState([]);
  const [images, setimages] = useState([]);
  const [title, settitle] = useState('');
  const [brand, setbrand] = useState('');
  const [description, setdescription] = useState('');
  const [condition, setcondition] = useState('New');
  const [ContactNo, setContactNo] = useState('');
  const [category, setcategory] = useState('Auto');
  const [location, setlocation] = useState('');
  const [loading, setloading] = useState(false);
  const [err, seterr] = useState({});
  useEffect(() => {
    let {params} = route;
    if (params?.toupdate == true) {
      let item = params.item;
      setRoutine(item.partsPricing || []);
      settitle(item.title);
      setimages(
        item.files?.map(item => {
          return {url: item, new: false};
        }),
      );
      setContactNo(item.ContactNo);
      setbrand(item.brand);
      setcategory(item.category);
      setdescription(item.description);
      setlocation(item.location);
      setcondition(item.condition);
    }
  }, []);
  const uploadImage = async path => {
    let randomName = Math.floor(Math.random() * 10000000) + 'asdasdasd';
    let res = await storage()
      .ref(randomName)
      .putFile(path)
      .then(async snapshot => {
        let res = await storage()
          .ref('/' + randomName)
          .getDownloadURL()
          .then(url => {
            //from url you can fetched the uploaded image easily
            return url;
          })
          .catch(e => console.log('getting downloadURL of image error => ', e));

        //You can check the image is now uploaded in the storage bucket
        return res;
      })
      .catch(e => console.log('uploading image error => ', e));

    return res;
  };
  const handleSubmit = async () => {
    if (images.length == 0) {
      seterr({id: 1, message: 'Add atleast one file!'});
      return;
    } else if (title == '') {
      seterr({id: 2, message: 'please add title!'});
      return;
    } else if (description == '') {
      seterr({id: 3, message: 'description is required!  '});
      return;
    } else if (brand == '') {
      seterr({id: 4, message: 'add brand name e.g ferrari'});
      return;
    } else if (ContactNo == '' || isNaN(ContactNo)) {
      seterr({id: 5, message: 'please enter a correct phone number'});
      return;
    } else if (location == '') {
      seterr({id: 7, message: 'please select a location '});
      return;
    }
    setloading(true);

    let {params} = route;
    if (params?.toupdate == true) {
      let files = [];
      files = await Promise.all(
        images.map(async item => {
          if (item.new == true) {
            let res = await uploadImage(item.url);
            return res;
          } else {
            return item.url;
          }
        }),
      );

      let obj = {
        title,
        brand,
        description,
        condition,
        ContactNo,
        category,
        partsPricing,
        Userid: currentUser.uid,
        live: true,
        updatedAt: db.FieldValue.serverTimestamp(),
        files: files,
        location,
        _geoloc: location.location,
        userDetail: {name: currentUser.displayName},
      };
      console.log(obj);
      console.log(params.item.id);
      const res = await db()
        .collection('ads')
        .doc(params.item.id)
        .set(obj, {merge: true})
        .catch(err => {
          return {err: true};
        });
      if (res.err) {
        setloading(false);
        seterr({id: 7, message: 'something went Wrong'});
      } else {
        setloading(false);
        reset();
        navigation.goBack();
      }
    } else {
      try {
        let files = [];
        files = await Promise.all(
          images.map(async item => {
            let res = await uploadImage(item.url);
            return res;
          }),
        );
        console.log(files);
        let obj = {
          title,
          brand,
          description,
          condition,
          ContactNo,
          category,
          partsPricing,
          Userid: currentUser.uid,
          live: true,
          createdAt: db.FieldValue.serverTimestamp(),
          files: files,
          location,
          _geoloc: location.location,
          userDetail: {name: currentUser.displayName},
        };
        console.log(obj);

        const res = await db().collection('ads').add(obj);

        console.log('Added document with ID: ', res.id);

        setloading(false);
        reset();
        navigation.goBack();
      } catch (error) {
        setloading(false);
        console.log(error);
        seterr({id: 7, message: 'something went Wrong'});
      }
    }
  };
  const [getlocation, setgetlocation] = useState(false);
  if (!isLoggedIn) {
    return <ToLogin />;
  }
  const reset = () => {
    setRoutine([]);
    settitle('');
    setimages([]);
    setContactNo('');
    setbrand('');
    setcategory('Auto');
    setdescription('');
    setlocation('');
    setcondition('New');
    seterr({});
  };
  //   useFocusEffect(
  //     useCallback(() => {
  //       if (!getlocation) {
  //         return () => {
  //           reset();
  //         };
  //       }
  //     }, []),
  //   );

  const chooseFile = () => {
    let options = {
      title: 'Select Image',

      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let uri = response?.assets[0]?.uri;
        // You can also display the image using data:
        // let source = {
        //   uri: 'data:image/jpeg;base64,' + response.data
        // };
        let uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        console.log(uploadUri);

        setimages(old => [...old, {url: uploadUri, new: true}]);
      }
    });
  };

  const locationhandler = value => {
    setlocation(value);
    setgetlocation(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.imagesWrapper}>
          {images.map((item, i) => {
            return (
              <ImageBackground
                resizeMode={'contain'}
                source={{uri: item.url}}
                key={i}
                style={[styles.imageButton, {backgroundColor: colors.grey}]}>
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    let newi = [...images];
                    newi.splice(i, 1);
                    setimages(newi);
                  }}
                  style={{
                    backgroundColor: 'red',
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    position: 'absolute',
                    right: 1,
                    top: 1,
                    marginTop: -8,
                    marginRight: -8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: 'white'}}>X</Text>
                </TouchableOpacity>
              </ImageBackground>
            );
          })}
          <View>
            <TouchableOpacity onPress={chooseFile} style={styles.imageButton}>
              <Image
                source={require('../Assets/Images/camera.png')}
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
          </View>
        </View>
        {err.id == 1 && <Error message={err.message} />}

        <View>
          <Text style={styles.label}>Title</Text>
          <Input onChnageText={settitle} value={title} placeholder={''} />
          {err.id == 2 && <Error message={err.message} />}
        </View>
        <View>
          <Text style={styles.label}>Description</Text>
          <Input
            numberOfLines={4}
            placeholder={''}
            onChnageText={setdescription}
            value={description}
            multiline={true}
          />
          {err.id == 3 && <Error message={err.message} />}
        </View>
        <View>
          <Text style={styles.label}>Category</Text>
          <Dropdown
            onChangeText={setcategory}
            value={category}
            options={[
              'Auto',
              'Bikes',
              'UTV/ATV',
              'Jetski',
              'Snowmobile',
              'Others',
            ]}
          />
        </View>
        <View>
          <Text style={styles.label}>Brand</Text>
          <Input onChnageText={setbrand} value={brand} />
          {/* <Dropdown onChangeText={setbrand} value={brand} options={['honda', 'suzuki']} */}
          {/* /> */}
          {err.id == 4 && <Error message={err.message} />}
        </View>
        <View>
          <Text style={styles.label}>Condition</Text>
          <Dropdown
            onChangeText={setcondition}
            value={condition}
            options={['New', 'Used']}
          />
        </View>
        <View>
          <Text style={styles.label}>Contact Number</Text>
          <Input
            onChnageText={setContactNo}
            value={ContactNo}
            placeholder={''}
          />
          {err.id == 5 && <Error message={err.message} />}
        </View>
        <View style={styles.space} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.label}>Parts to sell</Text>
          <TouchableOpacity
            onPress={() => {
              setRoutine(old => [
                ...old,
                {id: Math.floor(Math.random() * 10000000000000000)},
              ]);
            }}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../Assets/Images/addoutlined.png')}
            />
          </TouchableOpacity>
        </View>
        {partsPricing?.map((item, i) => {
          return (
            <View style={{marginVertical: 5}} key={i}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{flex: 1}}>
                  <View>
                    <Input
                      placeholder={'part'}
                      value={item.part}
                      onChnageText={value => {
                        let newarr = [...partsPricing];
                        let nitem = {...item, part: value};
                        newarr.splice(i, 1, nitem);
                        setRoutine(newarr);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.space} />

                <View style={{flex: 1}}>
                  <Input
                    placeholder={'price'}
                    value={item.price}
                    onChnageText={value => {
                      let newarr = [...partsPricing];
                      let nitem = {...item, price: value};
                      console.log(nitem);
                      newarr.splice(i, 1, nitem);
                      setRoutine(newarr);
                    }}
                  />
                </View>
              </View>
            </View>
          );
        })}
        {err.id == 6 && <Error message={err.message} />}
        <View style={styles.space} />

        <TouchableOpacity
          style={{
            flexDirection: 'row',
            // paddingVertical:,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 10,
          }}
          onPress={() => {
            navigation.setOptions({getLocation: locationhandler});
            setgetlocation(true);

            navigation.navigate('searchlocation', {
              getLocation: locationhandler,
            });
          }}>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>
            {location ? location.state.long_name : 'Select Location....'}
          </Text>
        </TouchableOpacity>
        {err.id == 7 && <Error message={err.message} />}
        <View style={styles.space} />
        <View style={styles.space} />
        <FilledButton onPress={handleSubmit} loading={loading}>
          Submit
        </FilledButton>
        <View style={styles.space} />
        <View style={styles.space} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAds;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.white,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginVertical: 10,
  },
  imageButton: {
    width: 80,
    height: 80,
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  space: {
    margin: 5,
  },
  imagesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
