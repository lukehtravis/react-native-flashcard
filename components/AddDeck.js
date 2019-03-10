import * as React from 'react';
import { Text, View, StyleSheet, Image, Button } from 'react-native';
import t from 'tcomb-form-native'; // 0.6.9
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const Form = t.form.Form;

const deckName = t.struct({
  name: t.String,
});
const client = new ApolloClient({
  uri: 'https://flashcardsreact.herokuapp.com/v1alpha1/graphql',
});
export default class AddDeck extends React.Component {
  state = {
    cards: []
  }
  _handleSubmit = async () => {
    let value = this._form.getValue();
    if (value === null) {
      value = {};
    }
    await client
      .mutate({

        mutation: gql`
        mutation {
          insert_decks(objects:{ name: "${value.name}"}) {
            affected_rows,
            
            returning {
              name
            }
          }
        }`,
      })
      .then(result => {
        this.props.navigation.navigate('Deck', {
          deckName: result.data.insert_decks.returning[0].name,
          cards: this.state.cards
        });
      });
  };

  render() {
    return (
      <View>
        <Form ref={c => (this._form = c)} type={deckName} />
        <Button title="Submit" onPress={this._handleSubmit} />
      </View>
    );
  }
}
