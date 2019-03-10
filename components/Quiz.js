import * as React from 'react';
import { Text, View, StyleSheet, Image, Button } from 'react-native';
import Card from './Card';

export default class Quiz extends React.Component {
  state = {
    deck: this.props.navigation.state.params.deck,
    cards: this.props.navigation.state.params.cards,
    cardsInDeck: this.props.navigation.state.params.cards.length,
    questionIndex: 1,
    pointTotal: 0,
  };

  updateQuizState = points => {
    this.setState({
      questionIndex: this.state.questionIndex + 1,
      pointTotal: this.state.pointTotal + points,
    });
  };

  restartQuiz = () => {
    this.setState({ questionIndex: 1, pointTotal: 0 });
  };

  backToDeckView = () => {
    this.props.navigation.navigate('Deck', {
      deck: this.state.deck,
      cards: this.state.cards,
    });
  };

  render() {
    let card = this.state.questionIndex - 1;
    let quizNeedsToLoopAgain = true;
    if (this.state.cardsInDeck == card) {
      quizNeedsToLoopAgain = false;
    }
    return (
      <View>
        <Text>Your Score {this.state.pointTotal}</Text>
        {quizNeedsToLoopAgain ? (
          <Card
            card={this.state.cards[card]}
            pointTotal={this.state.pointTotal}
            updateQuizState={i => this.updateQuizState(i)}
          />
        ) : (
          <View>
            <Button title="return to deck view" onPress={this.backToDeckView} />
            <Button title="Restart Quiz" onPress={this.restartQuiz} />
          </View>
        )}
      </View>
    );
  }
}
