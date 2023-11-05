import { useState, useEffect} from "react";
import { Text, View, Pressable } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style'
import Footer from './Footer';
import Header from './Header';
import { NBR_OF_DICES, NBR_OF_THROWS, MAX_SPOT, BONUS_POINTS_LIMIT, BONUS_POINTS, SCOREBOARD_KEY } from "../constants/Game";
import { Container, Row, Col } from 'react-native-flex-grid';
import AsyncStorage from "@react-native-async-storage/async-storage";

let board=[]

export default function Gameboard({navigation, route}){

    const [playerName, setPlayerName] = useState('')
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS)
    const [status, setStatus] = useState('Throw dices')
    const [gameEndStatus, setGameEndStatus] = useState(false)
    const [selectedDices, setSelectedDices] = useState(new Array(NBR_OF_DICES).fill(false))    
    const [diceSpots, setDiceSpots] = useState(new Array(NBR_OF_DICES).fill(0))    
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false))    
    const[dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0))
    const [bonusPointText, setBonusPointText] = useState(`You are ${BONUS_POINTS_LIMIT} points away from bonus`)
    const[totalPoints, setTotalPoints] = useState(0)
    const[iconView, setIconView] = useState(true)    
    const[scores, setScores] = useState([])

    useEffect(()=>{
        if (playerName === '' && route.params?.player){
            setPlayerName(route.params.player)
        } 
        },[])

    useEffect(()=>{
        setNbrOfThrowsLeft(NBR_OF_THROWS)
        selectedDices.fill(false)
        setStatus('Throw dices')
        let totalPointsCounter = dicePointsTotal.reduce((sum, point)=>sum + point, 0)
        let pointsMissing= BONUS_POINTS_LIMIT - totalPointsCounter
        if (pointsMissing > 0) {
            setTotalPoints(totalPointsCounter)
            setBonusPointText(`You are ${pointsMissing} points away from bonus`);
        }
        else{
            const newTotalPoints = totalPointsCounter + BONUS_POINTS;
            setTotalPoints(newTotalPoints)
            setBonusPointText(`Congrats! Bonus points (50) added`);
        }
        },[selectedDicePoints])
        
    useEffect(() => {
        if (gameEndStatus) {
            savePlayerPoints()
            setStatus("Game is over")
            }
        },[gameEndStatus])
    
    useEffect(() =>{
        const unsubscribe = navigation.addListener('focus',()=>{
            getScoreboardData()
        })
        return unsubscribe
    },[navigation])

    const dicesRow=[]
    for (let dice=0; dice< NBR_OF_DICES; dice++){
        dicesRow.push(
            <Col key={"dice" + dice}>
                <Pressable
                    key={"dice" + dice}
                    onPress={()=>selectDice(dice)}>
                    <MaterialCommunityIcons
                        name={board[dice]}
                        key= {"dice" +dice}
                        size={50}
                        color={getDiceColor(dice)}
                        >
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        )
    }

    const pointsRow=[]
    for (let spot=0; spot< MAX_SPOT; spot++){
        pointsRow.push(
            <Col key={"pointsRow" + spot}>
                <Text key={"pointsRow" + spot}>
                    {getSpotTotal(spot)}
                </Text>
            </Col>
        )
    }

    const pointsToSelectRow=[]
    for (let diceButton=0; diceButton< MAX_SPOT; diceButton++){
        pointsToSelectRow.push(
            <Col key={"diceButton" + diceButton}>
                <Pressable
                    key={"diceButton" + diceButton}
                    onPress={()=>selectDicePoints(diceButton)}
                    >
                    <MaterialCommunityIcons
                        name={"numeric-" +(diceButton + 1) + "-circle"}
                        key= {"buttonRow" + diceButton}
                        size={35}
                        color={getDicePointsColor(diceButton)}
                        >
                    </MaterialCommunityIcons>
                </Pressable>
            </Col>
        )
    }
  
    const selectDicePoints=(i)=>{
        
        if(nbrOfThrowsLeft===0){
                
                let selectedPoints =[...selectedDicePoints] 
                let points =[...dicePointsTotal] 
            
                if(!selectedPoints[i]){
                    selectedPoints[i]=true
                    let nbrOfDices = diceSpots.reduce((total, x)=>(x===(i+1) ? total +1 : total ),0)
                    points[i]=nbrOfDices * (i + 1) 
                }
                
                else{
                    setStatus('You already selected points for ' + (i+1))
                    return points[i]
                }
                const allPointsSelected = selectedPoints.every((pointSelected) => pointSelected);
                    if (allPointsSelected) {
                        setGameEndStatus(true)
                    }
                setDicePointsTotal(points)
                setSelectedDicePoints(selectedPoints)
                return points[i]   
        }
        
        else{
            setStatus('Throw ' + NBR_OF_THROWS + ' times before setting points')
        }    
    }

    
    const throwDices = () =>{
        setIconView(false)
        
        if (nbrOfThrowsLeft===0 && !gameEndStatus){
            setStatus('Select your points before the next throw')
            return 
        }
        
        else if(nbrOfThrowsLeft===3 && gameEndStatus){
            diceSpots.fill(0) 
            dicePointsTotal.fill(0) 
            setStatus("Game over")
        }
        else{
            
            let spots= [...diceSpots]
            for (let i=0; i<NBR_OF_DICES; i++){
                if(!selectedDices[i]){
                    let randomNumber = Math.floor(Math.random()* 6+1)
                    board[i]='dice-'+ randomNumber
                    spots[i]=randomNumber
                }
            }
            setDiceSpots(spots)
            setStatus('Select and throw dices again')
            if(nbrOfThrowsLeft===1){
                setStatus("Select your points before next throw ")
            }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft-1)
    }

    function getSpotTotal(i){
        return dicePointsTotal[i]
    }

    const selectDice =(i)=>{
        if(nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus){
            let dices=[...selectedDices]
            dices[i] =selectedDices[i] ? false :true 
            setSelectedDices(dices)
        }
        else{
            setStatus('You have to throw dices first')
        }
    }
  
    function getDiceColor(i){
        return selectedDices[i] ? "black":"blue"
    }

    function getDicePointsColor(i){
        return selectedDicePoints[i]  ? "black":"blue"
    }
    const restartGame = () => {
        setGameEndStatus(false)
        setStatus('Throw dices')
        totalPointsCounter = 0
        pointsMissing =0
        diceSpots.fill(0) 
        dicePointsTotal.fill(0)
        setTotalPoints(0)
        selectedDices.fill(0)
        selectedDicePoints.fill(0)
        setBonusPointText(`You are ${BONUS_POINTS_LIMIT} points away from bonus`)

    } 

    const savePlayerPoints = async() => {
        const newKey = scores.length + 1
        const currentDate = new Date();
        const playerPoints ={
            key:newKey,
            name:playerName,
            date:currentDate.toLocaleDateString(),
            time:currentDate.toLocaleTimeString(),
            points: totalPoints
        }
        try{
            const newScore =[...scores, playerPoints]
            const jsonValue = JSON.stringify(newScore)
            await AsyncStorage.setItem(SCOREBOARD_KEY, jsonValue)
        }
        catch(e){
            console.log('Save error: ' + e)
        }
      }

      const getScoreboardData = async () =>{
        try{
            const jsonValue = await AsyncStorage.getItem(SCOREBOARD_KEY)
            if (jsonValue !== null){
                let tmpScores = JSON.parse(jsonValue)
                setScores(tmpScores)
            }
        }
        catch(e){
            console.log('Save error: ' + e)
        }
      }

    return(
        <>
            <Header/>
            <View style={styles.container}>
                {iconView ?
                <MaterialCommunityIcons
                    name={"dice-multiple"}
                    key= {"dice-multiple"}
                    size={70}
                    color={'blue'}>
                </MaterialCommunityIcons>
                :
                <Container fluid>
                    <Row>{dicesRow}</Row>
                </Container>
                }
                <Text>Throws left: {nbrOfThrowsLeft}</Text>
                <Text> {status}</Text>
                {!gameEndStatus ? 
                    <Pressable
                        style={styles.button}
                        onPress={()=>throwDices()}>
                        <Text>THROW DICES</Text>
                    </Pressable>
                    :<View style={styles.buttonGroup}>
                    <Pressable
                    style={styles.button}
                    onPress={restartGame}>
                    <Text>START GAME AGAIN </Text>
                    </Pressable>

                    </View>
                }
                <Text>Total: {totalPoints}</Text>
                <Text>{bonusPointText}</Text>
                <Container fluid>
                    <Row>{pointsRow}</Row>
                </Container>
                <Container fluid>
                    <Row>{pointsToSelectRow}</Row>
                </Container>
                <Text>Player: {playerName}</Text>
            </View>
            <Footer/>
        </>
    )
}