import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import {View, Text, StyleSheet, Image, Pressable, TextInput, ScrollView} from 'react-native'
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import colors from "../assets/colors";
import logo from '../assets/Logo.png';


export default function Profile(props) {
    const [image, setImage] = useState('');
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
    
    const logout = async () => {
        AsyncStorage.removeItem('image');
        AsyncStorage.removeItem('email');
        AsyncStorage.removeItem('firstName');
        AsyncStorage.removeItem('lastName');
        AsyncStorage.removeItem('phoneNumber');
        AsyncStorage.removeItem('checkboxes');
        setImage('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        setCheckboxes({
            orderStatuses:false,
            passwordChanges:false,
            specialOffers:false,
            newsletter:false,
        });
    }
    const discardChanges = async()=>{
        setImage('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhoneNumber('');
        loadFromStorage();
    }
    const removeImage = async()=>{
        AsyncStorage.setItem(image, null);
        setImage('');
    }
    const loadFromStorage = async () => {
        try {
          const storedImage = await AsyncStorage.getItem('image');
          if (storedImage) {
              setImage(storedImage)
            }
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
            try {
              setCheckboxes(JSON.parse(storedCheckboxes));
            } catch (error) {
              console.error('Error parsing checkboxes:', error);
            }
          }
        } catch (error) {
          console.error('Error loading data from AsyncStorage:', error);
        }
    };
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [1,1],
          quality: 1,
        });

    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
          
        }
    };
    const saveChanges = async () => {
        AsyncStorage.setItem('image', image);
        AsyncStorage.setItem('firstName', firstName);
        AsyncStorage.setItem('email', email);
        AsyncStorage.setItem('lastName', lastName);
        AsyncStorage.setItem('phoneNumber', phoneNumber)
        AsyncStorage.setItem('checkboxes', JSON.stringify(checkboxes))
    }

    useEffect(() => {
        loadFromStorage();
      }, []);


    return (
    <View style={{ flex: 1, alignItems: 'center'}}>
        <View style = {styles.headerContainer}>
            <Pressable style={styles.backArrowButtonContainer} onPress={()=>props.navigation.goBack()}>
                <Text style={styles.backArrowButtonText}>←</Text>
            </Pressable>
            <Image source={logo}></Image>
            <View>
                <View style={styles.headerImageContainer} resizeMode="cover">{
                    image?<Image source={{uri:image}} style={{width:60, height:60, borderRadius:30,}}></Image>
                    :
                    <Text style={styles.headerImageReplacementText}>{firstName&&(firstName.charAt(0).toUpperCase()+lastName.charAt(0).toUpperCase())}</Text>
                    }
                </View>
            </View>
        </View>

        <ScrollView style={styles.mainContainer} contentContainerStyle={styles.contentContainer}>

            <Text style={{fontSize:15, fontWeight:'bold',}}>Personal information</Text>
            <View>
                <Text style={{marginBottom:5, color:'grey'}}>Avatar</Text>
                <View style={{flexDirection:'row'}}>
                    
                    <View style={styles.mainImageContainer}>{
                        image?<Image source={{uri:image}} style={{width:60, height:60, borderRadius:30,}} resizeMode="cover"></Image>
                        :
                        <Text style={styles.mainImageReplacementContainer}>{firstName&&(firstName.charAt(0).toUpperCase()+lastName.charAt(0).toUpperCase())}</Text>
                        }
                    </View>

                    <Pressable style={{marginHorizontal:20, backgroundColor:colors.primary2, borderRadius:8, alignSelf:'center'}} onPress={pickImage}>
                        <Text style={{color:'white', margin:8, fontSize:15}}>Change</Text>
                    </Pressable>

                    <Pressable style={{borderWidth:2, borderColor:colors.primary2, alignSelf:'center'}} onPress={removeImage}>
                        <Text style={{color:colors.primary2, margin:8, fontSize:15}}>Remove</Text>
                    </Pressable>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabelText}>First Name</Text>
                    <TextInput style={styles.inputField} value={firstName} onChangeText={setFirstName}></TextInput>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabelText}>Last Name</Text>
                    <TextInput style={styles.inputField} value={lastName} onChangeText={setLastName}></TextInput>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabelText}>Email</Text>
                    <TextInput style={styles.inputField} value={email} onChangeText={setEmail}></TextInput>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabelText}>Phone Number</Text>
                    <TextInput style={styles.inputField} value={phoneNumber} onChangeText={setPhoneNumber}></TextInput>
                </View>

                {/* Checkboxes */}
                <View>
                    <Text style={{fontSize:15, fontWeight:'bold'}}>Email notifications</Text>
                    
                    <View style={styles.checkboxContainer}>
                        <Checkbox value={checkboxes.orderStatuses} onValueChange={(value)=>setCheckboxes({...checkboxes, orderStatuses:value})}></Checkbox>
                        <Text style={styles.checkboxLabel}>Order statuses</Text>
                    </View>
                
                    <View style={styles.checkboxContainer}>
                        <Checkbox value={checkboxes.passwordChanges} onValueChange={(value)=>setCheckboxes({...checkboxes, passwordChanges:value})}></Checkbox>
                        <Text style={styles.checkboxLabel}>Password Changes</Text>
                    </View>

                    <View style={styles.checkboxContainer}>
                        <Checkbox value={checkboxes.specialOffers} onValueChange={(value)=>setCheckboxes({...checkboxes, specialOffers:value})}></Checkbox>
                        <Text style={styles.checkboxLabel}>Special Offers</Text>
                    </View>

                    <View style={styles.checkboxContainer}>
                        <Checkbox value={checkboxes.newsletter} onValueChange={(value)=>setCheckboxes({...checkboxes, newsletter:value})}></Checkbox>
                        <Text style={styles.checkboxLabel}>Newsletter</Text>
                    </View>

                    <Pressable style={{borderWidth:1, borderColor:colors.primary1Shade, alignSelf:'center', backgroundColor:colors.primary1, width:'100%', margin:10, borderRadius:8, alignItems:"center", justifyContent:'center', marginTop:20}} 
                    onPress={()=>{
                        logout();
                        AsyncStorage.setItem('isOnboardingCompleted', 'false');
                        props.navigation.navigate('Onboarding');
                        }}>
                        <Text style={{margin:8, fontSize:20, fontWeight:"bold"}}>Log Out</Text>
                    </Pressable>

                    <View style={{flexDirection:'row', justifyContent:'space-around', marginTop:20}}>
                        <Pressable style={{borderWidth:2, borderColor:colors.primary2, width:'40%', margin:5, borderRadius:8, alignItems:"center", justifyContent:'center'}} onPress={()=>{discardChanges()}}>
                            <Text style={{color:colors.primary2, marginHorizontal:8, marginVertical:10, fontSize:15, fontWeight:'bold'}}>Discard changes</Text>
                        </Pressable>
                        <Pressable style={{backgroundColor:colors.primary2, width:'40%', margin:5, borderRadius:8, alignItems:"center", justifyContent:'center'}} onPress={()=>{
                            saveChanges();
                            props.navigation.navigate('Home');
                            }}>
                            <Text style={{color:'white', marginHorizontal:8, marginVertical:10, fontSize:15, fontWeight:"bold"}}>Save Changes</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScrollView>
    </View>
    );
}

const styles = StyleSheet.create({
    checkboxLabel:{
        fontSize:15,
        marginLeft:5,
    },
    checkboxContainer:{
        marginTop:10,
        flexDirection:'row',
        alignItems:'center',
    },
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
    contentContainer: {
        paddingBottom: 100,
    }
})