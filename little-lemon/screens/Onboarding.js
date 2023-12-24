import {Text, TextInput, Pressable, View, StyleSheet, Image} from 'react-native'
import { useState, useEffect } from 'react'
import logo from '../assets/Logo.png'
import colors from '../assets/colors'
import AsyncStorage from '@react-native-async-storage/async-storage'

const checkEmail = (em) => {
    return em.length!==0&&/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(em);
}



export default function Onboarding({navigation}){
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [disabled, setDisabled] = useState(true);

    useEffect(
        () => {
            setDisabled(!(checkEmail(email)&&firstName.length!==0));
        }, [email, firstName]
    );

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={logo}></Image>
            </View>
            <View style={styles.mainContainer}>
                <Text style={{...styles.titleText, marginTop:50}}>
                    Let us get to know you
                </Text>
                <View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.titleText}>First Name</Text>
                        <TextInput value={firstName} onChangeText={setFirstName} style={styles.inputField}></TextInput>
                    </View>
                    <View style={{...styles.inputContainer, marginBottom:40}}>
                        <Text style={styles.titleText}>Email</Text>
                        <TextInput value={email} onChangeText={setEmail} style={styles.inputField}></TextInput>
                    </View>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <Pressable disabled = {disabled} style={{...styles.button, ...(disabled?styles.buttonDisabled:styles.buttonEnabled)}} onPress={()=>{
                    AsyncStorage.setItem('isOnboardingCompleted', true)
                    AsyncStorage.setItem('firstName', firstName)
                    AsyncStorage.setItem('email', email)
                    navigation.navigate('Profile')}
                    }>
                    
                    <Text style={styles.titleText}>Next</Text>
                </Pressable>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    logoContainer:{
        flex:0.15,
        backgroundColor:colors.grey1,
        alignItems:'center',
        justifyContent:'center'
    },
    logo:{
        width:'70%',
        height:'100%',
        resizeMode:'contain'
    },
    mainContainer:{
        flex:0.70,
        backgroundColor:colors.grey2,
        justifyContent:'space-between'
    },
    titleText:{
        alignSelf:'center',
        color:colors.primary2,
        fontSize:25,
    },
    inputContainer:{
        alignSelf:'center',
        width:'80%',
    },
    inputField:{
        paddingVertical:7,
        borderWidth:3,
        borderRadius:8,
        borderColor:colors.primary2,
        paddingLeft:10,
        fontSize:20,
    },
    bottomContainer:{
        flex:0.15,
        backgroundColor:colors.grey1,
    },
    button:{
        width:'30%',
        borderRadius:8,
        padding:7,
        alignSelf:'flex-end',
        marginRight:30,
        marginTop:20,
    },
    buttonEnabled:{
        backgroundColor:colors.primary1,
        color:colors.primary2,
    },
    buttonDisabled:{
        backgroundColor:colors.grey2,
        color:colors.primary2,
    }
})