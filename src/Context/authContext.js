import React, {useContext} from 'react';
import {useState} from 'react';
import {createContext} from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useEffect} from 'react';
import db from '@react-native-firebase/firestore';
GoogleSignin.configure({
  webClientId:
    '840070652712-off2mo8ggtaugm71ikonj2eaq6pec192.apps.googleusercontent.com',
  webClientSecret: 'agv02koljqlYj9vE19pW3ZTS',
});

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password, name) {
    return auth()
      .createUserWithEmailAndPassword(email, password)
      .then(authUser => {
        authUser.user
          .updateProfile({
            displayName: name,
          })
          .catch(err => {
            return {err};
          });
        db().collection('users').doc(authUser.user.uid).set({
          name: name,
        });
      })
      .catch(err => {
        return {err};
      });
  }

  function login(email, password) {
    return auth()
      .signInWithEmailAndPassword(email, password)
      .catch(err => {
        return {err};
      });
  }

  function logout() {
    return auth().signOut();
  }

  function resetPassword(email) {
    return auth().sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setCurrentUser(user);
      if (user) {
        setisLoggedIn(true);
      } else {
        setisLoggedIn(false);
      }
      console.log(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  const onGoogleButtonPress = async () => {
    // Get the users ID token
    try {
      const {idToken} = await GoogleSignin.signIn();
      console.log('token', idToken);
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const res = await auth().signInWithCredential(googleCredential);

      if (res.additionalUserInfo.isNewUser) {
        db().collection('users').doc(res.user.uid).set(
          {
            name: res.user.displayName,
          },
          {merge: true},
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    onGoogleButtonPress,
    isLoggedIn,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const {
    currentUser,
    login,
    isLoggedIn,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    onGoogleButtonPress,
  } = useContext(AuthContext);

  return {
    currentUser,
    login,
    isLoggedIn,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    onGoogleButtonPress,
  };
};
