import * as React from 'react';
import { Text, View, StyleSheet, Image, Button } from 'react-native';

export default class Card extends React.Component {
  state = {
    card: this.props.card,
    showAnswer: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.card !== this.props.card) {
      this.setState({ card: nextProps.card });
    }
  }

  showTheAnswer = () => {
    this.setState({ showAnswer: true });
  };

  chooseRightOrWrong = (e, rightOrWrong) => {
    let points = 0;
    if (rightOrWrong == 'right') {
      points = points + 1;
    }
    this.props.updateQuizState(points);
    this.setState({ showAnswer: false });
  };

  render() {
    return (
      <View>
        <Text>Question: {this.state.card.question}?</Text>
        {!this.state.showAnswer ? (
          <Button title="Show Answer" onPress={this.showTheAnswer} />
        ) : (
          <View>
            <Text>Answer: {this.state.card.answer}</Text>
            <Button
              onPress={e => this.chooseRightOrWrong(e, 'right')}
              title="Correct"
            />
            <Button
              onPress={e => this.chooseRightOrWrong(e, 'wrong')}
              title="Incorrect"
            />
          </View>
        )}
      </View>
    );
  }
}
