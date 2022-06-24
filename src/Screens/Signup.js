import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Error from '../Components/Customelements/error';
import FilledButton from '../Components/filledButton';
import Input from '../Components/input';
import OutlineButton from '../Components/OutlineButton';
import {colors, validateEmail} from '../Constant';
import {useAuth} from '../Context/authContext';

const Signup = ({navigation}) => {
  const {onGoogleButtonPress, signup} = useAuth();
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [loading, setloading] = useState(false);
  const [err, seterr] = useState([]);
  const handleSubmit = async () => {
    if (name == '') {
      seterr({
        id: 1,
        message: 'name is required !',
      });
      return;
    } else if (!validateEmail(email)) {
      seterr({
        id: 2,
        message: 'email is incorrect !',
      });
      return;
    } else if (password == '' || password.length < 8) {
      seterr({
        id: 3,
        message: 'password should have atleast 8 characters !',
      });
      return;
    }
    setloading(true);
    let res = await signup(email, password, name);
    console.log('res', res);
    if (res.err) {
      seterr({id: 0, message: res?.err?.userInfo?.message});
    }
    setloading(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Welcome</Text>
      <Text style={styles.heading}>Back</Text>
      {/* <View style={styles.space}/> */}
      <Text>Enter login details</Text>
      <View style={styles.space} />
      <Input value={name} onChnageText={setname} placeholder={'Name'} />
      {err.id == 1 && <Error message={err.message} />}
      <View style={styles.space} />
      <Input value={email} onChnageText={setemail} placeholder={'Email'} />
      {err.id == 2 && <Error message={err.message} />}
      <View style={styles.space} />
      <Input
        type={'password'}
        value={password}
        onChnageText={setpassword}
        placeholder={'Password'}
      />
      {err.id == 3 && <Error message={err.message} />}
      <View style={styles.space} />
      <FilledButton loading={loading} onPress={handleSubmit}>
        Sign Up
      </FilledButton>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => navigation.navigate('Siginin')}>
          <Text style={{color: colors.primary, marginVertical: 10}}>
            Already have a account?
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.space} />
      <OutlineButton
        icon={
          <Image
            resizeMode={'contain'}
            style={{height: 25, width: 25, marginRight: 5}}
            source={require('../Assets/Images/google.png')}
          />
        }
        onPress={() => {
          onGoogleButtonPress().then(() => console.log('Signin with google'));
        }}>
        SIGNIN WITH GOOGLE
      </OutlineButton>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  space: {
    margin: 10,
  },
});
