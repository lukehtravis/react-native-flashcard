import * as React from 'react';
import { Text, View, StyleSheet, Image, Button, TextInput } from 'react-native';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const client = new ApolloClient({
  uri: 'https://flashcardsreact.herokuapp.com/v1alpha1/graphql',
});

export default class AddCard extends React.Component {
  state = {
    questionText: '',
    answerText: '',
    belongsToDeck: this.props.navigation.state.params.deck,
    cards: this.props.navigation.state.params.cards
  };
  handleSubmit = async (e, question, answer) => {
    await client
      .mutate({
        mutation: gql`
        mutation {
          insert_cards(objects:{deck: "${
            this.state.belongsToDeck
          }", question: "${question}", answer: "${answer}" }) {
            affected_rows,
            returning {
              id,
              deck,
              question,
              answer
            }
          }
        }`,
      })
      .then(result => {
        this.props.navigation.navigate('Deck', {
          newCardId: result.data.insert_cards.returning[0],
          deckName: this.state.belongsToDeck,
          cards: this.state.cards
        });
      });
  };
  render() {
    return (
      <View>
        <TextInput
          onChangeText={text => this.setState({ questionText: text })}
          value={this.state.questionText}
          placeholder="Enter Question Here"
        />
        <TextInput
          onChangeText={text => this.setState({ answerText: text })}
          value={this.state.answerText}
          placeholder="Enter Answer Here"
        />
        <Button
          title="Submit"
          onPress={e =>
            this.handleSubmit(e, this.state.questionText, this.state.answerText)
          }
        />
      </View>
    );
  }
}
