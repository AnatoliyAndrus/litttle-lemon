import {View, Text, StyleSheet, Image, Pressable, ScrollView, TextInput} from 'react-native'
import logo from '../assets/Logo.png'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../assets/colors';
import HeroImage from '../assets/HeroImage.png'
import search from '../assets/search.png'
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon');


export default function Home(props){

    const [dishesList, setDishesList] = useState(null);

    const [image, setImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('')

    const [filterLine, setFilterLine] = useState("");

    async function createTable() {
        return new Promise((resolve, reject) => {
          db.transaction(
            (tx) => tx.executeSql('create table if not exists dishes (id integer primary key not null, name text, price text, description text, image text, category text);')
          );
        });
      }
    
      async function getDishes() {
        return new Promise((resolve) => {
          db.transaction((tx) => {
            tx.executeSql('select * from dishes', [], (_, { rows }) => {
              resolve(rows._array);
            });
          });
        });
      }
    
      function saveDishes(dishesList) {
        db.transaction((tx) => {
          tx.executeSql(
            `insert into dishes (name, price, description, image, category) values ${dishesList
              .map(
                (item) =>
                  `('${item.name}', '${item.price}', '${item.description}', '${item.image}', '${item.category}')`
              )
              .join(', ')}`
          );
        });
      }
    

    const loadFromStorage = async () => {
        try {
          const storedImage = await AsyncStorage.getItem('image');
          if (storedImage) {
              setImage(storedImage)
          }
          const storedFirstName = await AsyncStorage.getItem('firstName');
          if (storedFirstName) {
            setFirstName(storedFirstName);
          }
          const storedLastName = await AsyncStorage.getItem('lastName');
          if (storedLastName) {
            setLastName(storedLastName);
          }
        } catch (error) {
          console.error('Error loading data from AsyncStorage:', error);
        }
    };

    const loadDishesList = async () => {
        try {
          const result = await getDishes();
      
          if (result.length > 0) {
            setDishesList(result);
          } else {
            const response = await fetch(
              'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'
            );
            if (!response.ok) {
              throw new Error('Some HTTP error');
            }
            const data = await response.json();
           
            setDishesList(data.menu);
            saveDishes(data.menu);
          }
        } catch (error) {
          console.error('Error loading dishes from database:', error);
        }
      };
      
    useEffect(() => {
          try {
            createTable();
            
            loadFromStorage();
            loadDishesList();
          } catch (e) {
            console.error(e);
          }
        }, []);

    return (
    <ScrollView style = {{flex:1}}>
        
        <View style = {styles.headerContainer}>
            <View style={{width:'15%'}}></View>
            <Image style={styles.logo} source={logo}></Image>
            <View>
                <Pressable onPress={()=>props.navigation.navigate('Profile')}>
                    <View style={styles.headerImageContainer} resizeMode="cover">{
                        image?<Image source={{uri:image}} key={image} style={{width:60, height:60, borderRadius:30,}} resizeMode='cover'></Image>
                        :
                        <Text style={styles.headerImageReplacementText}>{firstName&&(firstName.charAt(0).toUpperCase()+lastName.charAt(0).toUpperCase())}</Text>
                        }
                    </View>
                </Pressable>
            </View>
        </View>

        {/*Hero*/}
        <View style={styles.heroContainer}>
            <Text style = {styles.heroHeader1}>Little Lemon</Text>
            
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{flexDirection:'column', flex:0.7}}>
                    <Text style = {styles.heroHeader2}>
                        Chicago    
                    </Text>
                    <Text style={{color:'white', fontSize:15,}}>We are family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                </View>
                <View style={styles.heroImageContainer}>
                    <Image resizeMode='cover' style={{width:'100%', height:'100%', borderRadius:8,}} source={HeroImage}></Image>
                </View>
            </View>

            <TextInput style={{backgroundColor:colors.grey1, borderRadius:12, alignItems:'center', justifyContent:'center', marginTop:20, fontSize:20, padding:10,}} placeholder='Search...' value={filterLine} onChangeText={setFilterLine}>
                        
            </TextInput>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
            <Text style={{fontSize:20, fontWeight:'bold', marginBottom:10}}>ORDER FOR DELIVERY!</Text>
            <View style={styles.menuButtonRow}>
                <MenuButton title='Starters'></MenuButton>
                <MenuButton title='Mains'></MenuButton>
                <MenuButton title='Desserts'></MenuButton>
                <MenuButton title='Drinks'></MenuButton>
            </View>

            {/* menu items */}
            {
            dishesList?dishesList.filter((item)=>!filterLine||item.name.toLowerCase().includes(filterLine.toLowerCase())).map((item)=>{
                return (
                <View style={{flex:1}} key={item.name}>
                    <MenuItem 
                        name={item.name} 
                        price={item.price}
                        description={item.description}
                        image={item.image}
                    ></MenuItem>
                </View>
                )}):(<View></View>)
                }
        </View>
    </ScrollView>
    )
}

function MenuButton({title, style, onPress}){
    return (
        <Pressable style={{...style, backgroundColor:colors.grey1, borderRadius:20, alignItems:'center', justifyContent:'center'}} onPress={onPress}>
            <Text style={{fontSize:18, fontWeight:'bold', color:colors.primary2, margin:7}}>
                {title}
            </Text>
        </Pressable>
    )
}

function MenuItem({name, price, description, image}){

    return (
        <View style={{width:'100%',}}>
            <Text style={{fontWeight:'bold', fontSize:20}}>{name}</Text>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                <View style={{flexDirection:'column', flexBasis:`70%`}}>
                    <Text numberOfLines={2} ellipsizeMode='tail'>{description}</Text>
                    <Text>${price}</Text>
                </View>
                <Image source={{uri:`https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`}} style={{width:80, height:80}} resizeMode='cover'></Image>
            </View>
            <View style={{width:`100%`, backgroundColor:colors.grey1, height:2, marginTop:10,}}></View>
        </View>
    )
}

const styles=StyleSheet.create({

    menu:{
        flex:0.15,
        paddingHorizontal:'3%',
        paddingTop:20,
    },
    menuButtonRow:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    heroHeader1:{
        color:colors.primary1,
        fontSize:30,
        fontFamily:'serif'
    },
    heroHeader2:{
        color:'white',
        fontSize:20,
        fontFamily:'serif',
    },
    heroImageContainer:{
        borderRadius:8,
        width:'25%',
        aspectRatio:1,
    },
    heroContainer:{
        flex:0.4,
        backgroundColor:colors.primary2,
        padding:10,
    },
    logo:{
        
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
        backgroundColor:'#4dd1b7',
        width:60,
        height:60,
        borderRadius:30,
        marginRight:10,
    },
    headerImageReplacementText:{
        alignSelf:'center',
        lineHeight:55,
        fontSize:30,
        color:'white',
    },
})