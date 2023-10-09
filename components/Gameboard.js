import { useState, useEffect } from "react"
import { Text, View, Pressable } from "react-native"
import Header from "./Header"
import Footer from "./Footer"
import style from "../style/style"
import { NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, BONUS_POINTS_LIMIT, BONUS_POINTS } from '../constants/Game';
import { Container, Row, Col } from 'react-native-flex-grid';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

let board = []


export default Gameboard = ({ navigation, route }) => {

    const [playerName, setPlayerName] = useState('');
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('Throw dices');
    const [gameEndStatus, setGameEndStatus] = useState(false);
    const [selectDices, setSelectDices] = useState(new Array(NBR_OF_DICES).fill(false));
    const [diceSpots, setDicesSpots] = useState(new Array(NBR_OF_DICES).fill(0));
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));
    const [dicePointsTotal, setDicePointsTotal] = useState(new Array(MAX_SPOT).fill(0));

    const dicesRow = []
    for (let dice = 0; dice < NBR_OF_DICES; dice++) {
        dicesRow.push(
            <Col key={"dice" + dice}>
                <Pressable key={"dice" + dice } onPress={() => selectDice(dice)} >
                    <MaterialCommunityIcons name={board[dice]} key={"dice" + dice} size={50} color={getDiceColor(dice)}> 
                    </MaterialCommunityIcons>            
                </Pressable>
            </Col>
        )
    }

    const pointsRow = []
    for (let spot = 0; spot < MAX_SPOT; spot++) {
        pointsRow.push(
            <Col key={"pointsRow" + spot}>
              <Text key={"pointsRow" + spot}>
               </Text> 
            </Col>
        )
    }

    const PointsToSelectRow = []
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        PointsToSelectRow.push(
            <Col key={"buttonsRow" + diceButton}>
                <Pressable key={"buttonsRow" + diceButton } onPress={() => selectDicePoints(diceButton)} >
                    <MaterialCommunityIcons name={"numeric-" + (diceButton + 1) + "-circle"} key={"buttonsRow" + diceButton} size={35} color={getDicePointsColor(diceButton)}> 
                    </MaterialCommunityIcons>            
                </Pressable>
            </Col>
        )
    }

    function getSpotTotal(i) {
        return dicePointsTotal[i] ;
    }    

    const selectDice = (i) => {
        if (nbrOfThrowsLeft < NBR_OF_THROWS && !gameEndStatus) {
            let dices = [...selectDices];
            dices[i] = selectDices[i] ? false : true;
            setSelectDices(dices);
        }
        else {
            setStatus('You have to throw dices first');
        }
    }

    function getDiceColor(i) {
        return selectDices[i] ? 'red' : 'black';
    }

    useEffect(() => {
        if (playerName === '' && route.params?.player ) {
            setPlayerName(route.params.player);
        }    
    }, []);

    return (
        <>
            <Header />
            <View >
                <Text>Gameboard</Text>
                <Container fluid>
                    <Row>{dicesRow}</Row>
                </Container>   
                <Container fluid>
                    <Row>{pointsRow}</Row>
                </Container>  
                <Container fluid>
                    <Row>{PointsToSelectRowRow}</Row>
                </Container>  

                <Text>Player: {playerName}</Text>
            </View>
            <Footer />
        </>
    )
}