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

const Signin = ({navigation}) => {
  const [email, setemail] = useState('');
  const {onGoogleButtonPress, login} = useAuth();
  const [password, setpassword] = useState('');
  const [loading, setloading] = useState(false);
  const [err, seterr] = useState([]);
  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      seterr({
        id: 0,
        message: 'email is incorrect !',
      });
      return;
    } else if (password == '' || password.length < 8) {
      seterr({
        id: 1,
        message: 'password should have atleast 8 characters !',
      });
      return;
    }
    setloading(true);
    let res = await login(email, password);
    console.log('res', res);
    if (res.err) {
      seterr({id: 1, message: res?.err?.userInfo?.message});
    }
    setloading(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Welcome</Text>
      <Text style={styles.heading}>Back</Text>
      {/* <View style={styles.space}/> */}
      <Text style={{fontWeight: 'bold'}}>Enter login details</Text>
      <View style={styles.space} />
      <Input onChnageText={setemail} value={email} placeholder={'Email'} />
      {err.id == 0 && <Error message={err.message} />}
      <View style={styles.space} />
      <Input
        placeholder={'Password'}
        onChnageText={setpassword}
        type={'password'}
        value={password}
      />
      {err.id == 1 && <Error message={err.message} />}
      <View style={styles.space} />
      <FilledButton loading={loading} onPress={() => handleSubmit()}>
        Sign In
      </FilledButton>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => navigation.navigate('Siginup')}>
          <Text style={{color: colors.primary, marginVertical: 10}}>
            Don't have an account?
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

export default Signin;

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
