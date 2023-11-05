import { useState } from 'react';
import { View, Text, Pressable, TextInput, Keyboard, ScrollView } from 'react-native';
import styles from '../style/style';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FontAwesome } from '@expo/vector-icons';
import Header from './Header';
import Footer from './Footer';
import { NBR_OF_DICES, NBR_OF_THROWS, MIN_SPOT, MAX_SPOT, BONUS_POINTS_LIMIT, BONUS_POINTS } from '../constants/Game';

export default Home = ({ navigation }) => {

    const [playerName, setPlayerName] = useState('');
    const [hasPlayerName, setHasPlayerName] = useState(false);

    const handlePlayerName = (value) => {
        if (value.trim().length > 0 ) {
          setHasPlayerName(true);
          Keyboard.dismiss();
        }
    }

    return (
        <>
            <Header />
            <View style={styles.container}>
                <MaterialCommunityIcons name="information" size={70} style={styles.rulessymbol} />
                
                {!hasPlayerName ?
                                <>
                                <FontAwesome name="user-circle-o" size={70} style={styles.rulessymbol}/>
                                <Text style={styles.rulesheader}>For scoreboard enter your name</Text>
                                <TextInput 
                                    style={styles.textinput} 
                                    onChangeText={setPlayerName}
                                    value={playerName} 
                                    placeholder="Enter your name here"
                                    maxLength={10}
                                    autoFocus={true}>                                    
                                </TextInput>
                                <Pressable style={styles.playbutton} onPress={() => handlePlayerName(playerName)}>
                                    <Text>OK</Text>
                                </Pressable>
                            </>

                            :
                            <>
                            <ScrollView> 
                            <MaterialCommunityIcons name="information" size={70} style={styles.rulessymbol}/>
                                <Text style={styles.rulesheader}>Rules of the game...</Text>
                                <Text style={styles.rules} multiline="true">
                                    THE GAME: Upper section of the classic Yahtzee 
                                    dice game. You have {NBR_OF_DICES} dices and 
                                    for the every dice you have {NBR_OF_THROWS} 
                                    throws. After each throw you can keep dices in 
                                    order to get same dice spot counts as many as 
                                    possible. In the end of the turn you must select 
                                    your points from {MIN_SPOT} to {MAX_SPOT}. 
                                    Game ends when all points have been selected. 
                                    The order for selecting those is free.
                                </Text>
                                <Text style={styles.rules} multiline="true">
                                    POINTS: After each turn game calculates the sum 
                                    for the dices you selected. Only the dices having 
                                    the same spot count are calculated. Inside the 
                                    game you can not select same points from the
                                    {MIN_SPOT} to {MAX_SPOT} again.
                                </Text>
                                <Text style={styles.rules} multiline="true">
                                    GOAL: To get points as much as possible. 
                                    {BONUS_POINTS_LIMIT} points is the limit of 
                                    getting bonus which gives you {BONUS_POINTS} 
                                    points more.
                                </Text>
                                <Text style={styles.lucktext}>Good luck, {playerName}</Text>
                                <Pressable style={styles.playbutton} onPress={() => navigation.navigate('Gameboard', {player: playerName})}>
                                    <Text>Start Game</Text>
                                </Pressable>  
                                </ScrollView>  
                            </>
               } 
            </View>
            <Footer />
        </>
     )   
}