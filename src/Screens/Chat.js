import React, {useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../Constant';
import db from '@react-native-firebase/firestore';
import {useAuth} from '../Context/authContext';
import {useState} from 'react';
import ToLogin from '../Components/ToLogin';
import Empty from '../Components/Customelements/empty';
import Avatar from '../Components/Customelements/avatar';
const Chat = ({navigation}) => {
  const {currentUser, isLoggedIn} = useAuth();
  const [chats, setchats] = useState([]);
  const [Refreshing, setRefreshing] = useState(false);
  const [loading, setloading] = useState(false);
  const call = () => {
    console.log(currentUser.uid);
    db()
      .collection('users')
      .doc(currentUser.uid)
      .onSnapshot(async snapshot => {
        console.log(snapshot.data());
        let data = snapshot.data();
        let results;
        if (data?.chats) {
          if (data?.chats) {
            console.log('yeh chats', data?.chats);

            results = await Promise.all(
              data?.chats.map(async item => {
                let ids = item.id.split('-');
                let id = ids[0] == currentUser.uid ? ids[1] : ids[0];
                let res = await db().collection('users').doc(id).get();
                let res1 = await db()
                  .collection('chatrooms')
                  .doc(item.id)
                  .collection('messages')
                  .orderBy('createdAt', 'desc')
                  .limit(1)
                  .get();
                console.log('ggboss', res1.docs[0].data());
                console.log(res.data().name);

                return {
                  ...item,
                  name: res?.data()?.name,
                  lastMessage: res1?.docs[0]?.data(),
                };
              }),
            ).catch(err => {
              setloading(false);
              setRefreshing(false);
            });
          }
          if (results) {
            setchats(results);
            setloading(false);
            setRefreshing(false);
          } else {
            setloading(false);
            setRefreshing(false);
          }
          console.log('atha rakh .....', results);
        }
      });
  };
  useEffect(() => {
    if (isLoggedIn) {
      call();
    }
  }, [isLoggedIn]);
  const calculateTime = date => {
    // const value = Math.floor((new Date() - new Date(date._seconds * 1000)) / 1000 * 60 * 60 * 24);
    // const comingdate = new Date(date._seconds * 1000).toISOString()
    const diffDays = Math.round(
      Math.abs(
        (new Date(date?._seconds * 1000) - new Date()) / (1000 * 60 * 60 * 24),
      ),
    );

    if (diffDays == 0) {
      return 'Today';
    } else {
      return diffDays + ' days ago';
    }
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    call();
  }, []);
  if (!isLoggedIn) {
    return <ToLogin />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          height: 55,
          backgroundColor: 'white',
          elevation: 10,
          alignItems: 'center',
          paddingHorizontal: 10,
          flexDirection: 'row',
        }}>
        <Text style={{marginLeft: 10, fontWeight: 'bold', fontSize: 17}}>
          Chats
        </Text>
      </View>

      {chats.length <= 0 ? (
        <View style={{flex: 1, backgroundColor: colors.white}}>
          <Empty text={'No messages Yet'} />
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl refreshing={Refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{padding: 15}}
          data={chats}
          keyExtractor={item => item.id}
          renderItem={({item, index}) => {
            console.log(item);
            return (
              <TouchableOpacity
                key={index}
                style={styles.chatItem}
                onPress={() =>
                  navigation.navigate('Chat', {
                    name: item.name,
                    uid: item.detail.id,
                    // status: typeof (item.status) == "string" ? item.status : item.status.toDate().toString()
                  })
                }>
                <Avatar
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: colors.grey,
                    borderRadius: 30,
                  }}
                />
                <View style={{margin: 5}}></View>
                <View style={{flex: 1}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.heading}>{item?.name}</Text>

                    <Text>{calculateTime(item?.lastMessage.createdAt)}</Text>
                  </View>
                  <Text style={styles.extraText}>
                    {' '}
                    {currentUser?.uid == item?.lastMessage?.sentBy &&
                      'me:'}{' '}
                    {item?.lastMessage?.text}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatItem: {
    borderBottomColor: colors.grey,
    borderBottomWidth: 2,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  extraText: {
    color: '#A2A0A1',
  },
});
