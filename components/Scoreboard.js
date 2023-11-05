import { Text, View, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { DataTable } from "react-native-paper"
import Footer from './Footer';
import Header from './Header';
import styles from "../style/style";
import { NBR_OF_SCOREBOARD_ROWS, SCOREBOARD_KEY } from "../constants/Game";
import AsyncStorage from '@react-native-async-storage/async-storage'

export default Scoreboard = ({navigation}) =>{

    const [scores, setScores]= useState([])

    useEffect(() =>{
        const unsubscribe = navigation.addListener('focus',()=>{
            getScoreboardData()
        })
        return unsubscribe
    },[navigation])

    const getScoreboardData = async () =>{
        try{
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY)
            if (jsonValue !== null){
                let tmpScores = JSON.parse(jsonValue)
                tmpScores.sort((a, b) => b.points - a.points)
                setScores(tmpScores)
            }
        }
        catch(e){
            console.log('Save error: ' + e)
        }
      }
      const clearStorageBoard = async() =>{
        try{
            await AsyncStorage.clear()
            setScores([])
        }
        catch(e){
            console.log('clear error' + e)
        }
      }
      
    return(
        <>
            <Header/>
            <View >
                <Text>Scoreboard</Text>
                {scores.length ===0 ?
                    <Text>Scoreboard is empty</Text>
                    :
                    scores.map((player, index)=>(
                        index < NBR_OF_SCOREBOARD_ROWS &&
                        
                        <DataTable.Row style={styles.dataTable} key={player.key}>
                            <DataTable.Cell><Text>{index + 1}.</Text></DataTable.Cell>
                            <DataTable.Cell><Text>{player.name}</Text></DataTable.Cell>
                            <DataTable.Cell><Text>{player.date}</Text></DataTable.Cell>
                            <DataTable.Cell><Text>{player.time}</Text></DataTable.Cell>
                            <DataTable.Cell><Text>{player.points}</Text></DataTable.Cell>
                        </DataTable.Row>
                        
                    )) 
                 }
            </View >

            <View>
                    {scores.length ===0 ?
                    null
                    :

                <Pressable 
                    style={styles.playbutton}
                    onPress={()=>clearStorageBoard()}>
                    <Text>CLEAR SCOREBOARD</Text>
                </Pressable>
                    }
            </View>
            <Footer/>
        </>
    )

}