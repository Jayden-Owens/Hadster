import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat'
import firestore from '@react-native-firebase/firestore'
import { useAuth } from '../Context/authContext'
import { firebase } from '@react-native-firebase/auth'
import { colors } from '../Constant'
export default function ChatScreen({ route, navigation }) {
    const user = useAuth().currentUser


    const [messages, setMessages] = useState([]);
    const { uid, name } = route.params;
    console.log(route)
    const getAllMessages = async () => {
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        const querySanp = await firestore().collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .orderBy('createdAt', "desc")
            .get()
        const allmsg = querySanp.docs.map(docSanp => {
            return {
                ...docSanp.data(),
                createdAt: docSanp.data().createdAt.toDate()
            }
        })
        setMessages(allmsg)


    }
    useEffect(() => {
        // getAllMessages()

        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        const messageRef = firestore().collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .orderBy('createdAt', "desc")

        const unSubscribe = messageRef.onSnapshot((querySnap) => {
            const allmsg = querySnap.docs.map(docSanp => {
                const data = docSanp.data()
                if (data.createdAt) {
                    return {
                        ...docSanp.data(),
                        createdAt: docSanp.data().createdAt.toDate()
                    }
                } else {
                    return {
                        ...docSanp.data(),
                        createdAt: new Date()
                    }
                }

            })
            setMessages(allmsg)

        })


        return () => {
            unSubscribe()
        }


    }, [])

    const onSend = (messageArray) => {
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy: user.uid,
            sentTo: uid,
            createdAt: new Date(),
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
        const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid
        if (messages?.length == 0) {
            let dat = [{ id: user.uid, name: user.displayName }, { id: uid, name: name }]
            dat.map((item, i) => {
                let res = firestore().collection('users').doc(item.id).set({
                    chats: firestore.FieldValue.arrayUnion({ id: docid, detail: dat[i == 0 ? 1 : 0] })
                }, { merge: true })
                console.log(res)
            })

        }
        firestore().collection('chatrooms')
            .doc(docid)
            .collection('messages')
            .add({ ...mymsg, createdAt: firestore.FieldValue.serverTimestamp() })


    }
    return (
        <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
            <View style={{ height: 55, backgroundColor: 'white', elevation: 10, alignItems: 'center', paddingHorizontal: 10, flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../Assets/Images/back.png')} style={{ width: 25, height: 25, }} />
                </TouchableOpacity>
                <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 17 }}>{name}</Text>

            </View>
            <GiftedChat
                messages={messages}
                onSend={text => onSend(text)}
                user={{
                    _id: user.uid,
                }}
                renderSend={(props) => {
                    const { text, messageIdGenerator, user, onSend } = props
                    if (!text) {
                        return null

                    }
                    return (
                        <TouchableOpacity

                            onPress={
                                () => {
                                    if (text && onSend) {
                                        onSend({ text: text.trim(), user: user, _id: messageIdGenerator() }, true);
                                    }
                                }
                            }

                            style={{ alignSelf: 'center', marginHorizontal: 10 }}>
                            <Image source={require('../Assets/Images/send.png')} style={{ width: 35, height: 35, }} />
                        </TouchableOpacity>
                    )
                }}
                renderBubble={(props) => {
                    return <Bubble
                        {...props}
                        wrapperStyle={{
                            right: {
                                backgroundColor: "green",

                            }

                        }}
                    />
                }}

                renderInputToolbar={(props) => {
                    return <InputToolbar {...props}
                        containerStyle={{ borderTopWidth: 1.5, borderTopColor: 'green' }}
                        textInputStyle={{ color: "black" }}
                    />
                }}

            />
        </View>
    )
}
