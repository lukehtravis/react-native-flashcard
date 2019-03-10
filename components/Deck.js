import * as React from 'react';
import { Text, View, StyleSheet, Image, Button,} from 'react-native';
import {clearLocalNotification, setLocalNotification} from 'utils/pushNotification'

export default class Deck extends React.Component {
  state = {
    deck: this.props.navigation.state.params.deckName,
    cards: this.props.navigation.state.params.cards,
  };
  addCard = () => {
    this.props.navigation.navigate('AddCard', {
      deck: this.state.deck,
      cards: this.state.cards,
    });
  };
  takeQuiz = () => {
    clearLocalNotification().then(setLocalNotification); 
    this.props.navigation.navigate('Quiz', {
      deck: this.state.deck,
      cards: this.state.cards,
    });
  }
  render() {
    const { navigation } = this.props;
    // This come from AddCard
    const params = navigation.getParam('newCardId');
    if (params !== undefined) {
      navigation.setParams({ newCardId: undefined });
      let cardIds = [];
      for (let card of this.state.cards) {
        cardIds.push(card.id);
      }
      if (cardIds.includes(params.id) == false) {
        this.setState(state => ({
          cards: [...state.cards, params],
        }));
      }
    }
    let cards = this.state.cards;
    if (cards == undefined) {
      cards = [];
    }
    return (
      <View>
        <Text>Name of Deck: {this.state.deck}</Text>
        <Text>Number of cards: {cards.length}</Text>
        <Button title="Add Card" onPress={this.addCard} />
        <Button title="Take Quiz" onPress={this.takeQuiz} />
      </View>
    );
  }
}
