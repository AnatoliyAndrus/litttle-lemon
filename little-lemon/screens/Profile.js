import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import {View, Text, StyleSheet, Image, Pressable, TextInput, ScrollView} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import colors from "../assets/colors";
import logo from '../assets/Logo.png';


export default function Profile(props) {
    const [image, setImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [lastName, setLastName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [checkboxes, setCheckboxes] = useState({
        orderStatuses:false,
        passwordChanges:false,
        specialOffers:false,
        newsletter:false,
    })
    
    useEffect(() => {
        const loadFromStorage = async () => {
          try {
            const storedEmail = await AsyncStorage.getItem('email');
            if (storedEmail) {
              setEmail(storedEmail);
            }
            const storedFirstName = await AsyncStorage.getItem('firstName');
            if (storedFirstName) {
              setFirstName(storedFirstName);
            }
            const storedLastName = await AsyncStorage.getItem('lastName');
            if (storedLastName) {
              setLastName(storedLastName);
            }
            const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
            if (storedPhoneNumber) {
              setPhoneNumber(storedPhoneNumber);
            }
            const storedCheckboxes = await AsyncStorage.getItem('checkboxes');
            if (storedCheckboxes) {
              setCheckboxes(storedCheckboxes);
            }
          } catch (error) {
            console.error('Error loading email from AsyncStorage:', error);
          }
        };
        loadFromStorage();
      }, []);

    return (
    <View style={{ flex: 1, alignItems: 'center'}}>
        <View style = {styles.headerContainer}>
            <Pressable style={styles.backArrowButtonContainer} onPress={()=>props.navigation.goBack()}>
                <Text style={styles.backArrowButtonText}>←</Text>
            </Pressable>
            <Image style={styles.logo} source={logo}></Image>
            <View>
                <View style={styles.headerImageContainer}>{
                    image?<Image source={{uri:image}} resizeMode="cover"></Image>
                    :
                    <Text style={styles.headerImageReplacementText}>{firstName&&(firstName.charAt(0).toUpperCase()+lastName.charAt(0).toUpperCase())}</Text>
                    }
                </View>
            </View>
        </View>

        <ScrollView style={styles.mainContainer}>

            <Text style={{fontSize:15, fontWeight:'bold',}}>Personal information</Text>
            <View>
                <Text style={{marginBottom:5, color:'grey'}}>Avatar</Text>
                <View style={{flexDirection:'row'}}>
                    
                    <View style={styles.mainImageContainer}>{
                        image?<Image source={{uri:image}} resizeMode="cover"></Image>
                        :
                        <Text style={styles.mainImageReplacementContainer}>{firstName&&(firstName.charAt(0).toUpperCase()+lastName.charAt(0).toUpperCase())}</Text>
                        }
                    </View>

                    <Pressable style={{marginHorizontal:20, backgroundColor:colors.primary2, borderRadius:8, alignSelf:'center'}} onPress={()=>{}}>
                        <Text style={{color:'white', margin:8, fontSize:15}}>Change</Text>
                    </Pressable>

                    <Pressable style={{borderWidth:2, borderColor:colors.primary2, alignSelf:'center'}} onPress={()=>{}}>
                        <Text style={{color:colors.primary2, margin:8, fontSize:15}}>Remove</Text>
                    </Pressable>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabelText}>First Name</Text>
                    <TextInput style={styles.inputField} value={firstName} onTextInput={setFirstName}></TextInput>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabelText}>Last Name</Text>
                    <TextInput style={styles.inputField} value={lastName} onTextInput={setLastName}></TextInput>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabelText}>Email</Text>
                    <TextInput style={styles.inputField} value={email} onTextInput={setEmail}></TextInput>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabelText}>Phone Number</Text>
                    <TextInput style={styles.inputField} value={phoneNumber} onTextInput={setPhoneNumber}></TextInput>
                </View>
            </View>
        </ScrollView>
    </View>
    );
}

const styles = StyleSheet.create({
    inputLabelText:{
        fontSize:15,
        fontWeight:'bold',
    },
    inputContainer:{
        marginVertical:5,
    },
    inputField:{
        paddingVertical:7,
        borderRadius:8,
        borderColor:colors.grey2,
        borderWidth:1,
        paddingHorizontal:10,
        width:'100%',
    },
    backArrowButtonContainer:{
        backgroundColor:colors.primary2,
        width:50,
        height:50,
        borderRadius:25,
        justifyContent:"center",
        alignItems:'center',
        marginHorizontal:15,
    },
    backArrowButtonText:{
        color:'white',
        fontSize:35,
        fontWeight:'bold',
        lineHeight:35,
    },
    headerContainer:{
        marginTop:30,
        width:'100%',
        flexDirection:"row",
        justifyContent:'space-between',
        alignItems:'center',
        height:70,
    },
    headerImageContainer:{
        marginHorizontal:15,
        backgroundColor:'#4dd1b7',
        width:60,
        height:60,
        borderRadius:30,
    },
    headerImageReplacementText:{
        alignSelf:'center',
        lineHeight:55,
        fontSize:30,
        color:'white',
    },
    mainContainer:{
        width:'96%',
        borderColor:colors.grey2,
        borderRadius:8,
        borderWidth:1,
        margin:5,
        flex:1,
        padding:15,
    },
    mainImageContainer:{
        backgroundColor:'#4dd1b7',
        width:60,
        height:60,
        borderRadius:40,
    },
    mainImageReplacementContainer:{
        alignSelf:'center',
        lineHeight:60,
        fontSize:30,
        color:'white',
    },
})