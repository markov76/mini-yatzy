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
    //ovatko nopat kiinnitetty
    const [selectDices, setSelectDices] = useState(new Array(NBR_OF_DICES).fill(false));
    //noppien silmäluvut
    const [diceSpots, setDicesSpots] = useState(new Array(NBR_OF_DICES).fill(0));
    // onko silmäluvuille valittu pisteiksi
    const [selectedDicePoints, setSelectedDicePoints] = useState(new Array(MAX_SPOT).fill(false));
    //kerätyty pisteet
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
                <Text key={"pointsRowText1" + spot}>
                    Spot {spot + 1}:
                </Text> 
                <Text key={"pointsRowText2" + spot}>
                    {getSpotTotal(spot)}
                </Text>
            </Col>
        )
    }

    const PointsToSelectRow = []
    for (let diceButton = 0; diceButton < MAX_SPOT; diceButton++) {
        PointsToSelectRow.push(
            <Col key={"buttonsRow" + diceButton}>
                <Pressable key={"buttonsRow" + diceButton } onPress={() => selectDicePoints(diceButton)}>
                    <MaterialCommunityIcons name={"numeric-" + (diceButton + 1) + "-circle"} key={"buttonsRow" + diceButton} size={35} color={getDicePointsColor(diceButton)}> 
                    </MaterialCommunityIcons>            
                </Pressable>
            </Col>
        )
    }

    const selectDicePoints = (i) => {
        if (nbrOfThrowsLeft === 0) {
        let selectedPoints = [...selectedDicePoints];
        let points = [...dicePointsTotal];
        if (!selectedPoints[i]) {
            selectedPoints[i] = true;
            let nbrOfDices = 
                diceSpots.reduce(
                    (total, x) => (x === (i + 1) ? total + 1 : total), 0);
            points[i] = (i + 1) * nbrOfDices;
        }  
        else {
            setStatus('You have already selected points for this spot' + (i + 1));
            return points[i];
        }      
        setDicePointsTotal(points);
        setSelectedDicePoints(selectedPoints);
        return points[i];
    }
    else {
        setStatus('Throw ' + NBR_OF_THROWS + ' times before setting points');
    }
}  
    
    const throwDices = () => {
        
        if (nbrOfThrowsLeft === 0 && !gameEndStatus) {
            setStatus('Select your points before the next throw');
            return 1;
        }
        else if (nbrOfThrowsLeft === 0 && gameEndStatus) {
            setGameEndStatus(false);
            diceSpots.fill(0);
            dicePointsTotal.fill(0);
        }
        let spots = [...diceSpots];
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1) ;
                board[i] = "dice-" + randomNumber;
                spots[i] = randomNumber;
            }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
        setDicesSpots(spots);
        setStatus('Select and throw dices again');
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

    function getDicePointsColor(i) {
        return selectedDicePoints[i] && !gameEndStatus ? 'red' : 'black';
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
                <Text>Throws left: {nbrOfThrowsLeft}</Text>
                <Text>{status}</Text>
                <Pressable 
                    onPress={() => throwDices()} 
                    ><Text>THROW DICES</Text>
                </Pressable>  
                <Container fluid>
                    <Row>{pointsRow}</Row>
                </Container>  
                <Container fluid>
                    <Row>{PointsToSelectRow}</Row>
                </Container>  

                <Text>Player: {playerName}</Text>
            </View>
            <Footer />
        </>
    )
}