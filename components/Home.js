import * as React from 'react';
import { Text, View, StyleSheet, Image, Button, Animated, ScrollView } from 'react-native';
import AddDeck from './AddDeck';
import { AsyncStorage } from 'react-native';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { NavigationEvents } from 'react-navigation';

const client = new ApolloClient({
  uri: 'https://flashcardsreact.herokuapp.com/v1alpha1/graphql',
});

export default class Home extends React.Component {
  state = {
    animVal: new Animated.Value(1),
  };
  loadData = async () => {
    await client
      .query({
        fetchPolicy: 'network-only',
        query: gql`
        query {
          decks {
            name
          }
        }
      `,
      })
      .then(decksReturned => {
        let decks = [];
        for (let deck of decksReturned['data'].decks) {
          decks.push(deck.name);
        }
        this.setState({ decks });
      });
    await client
      .query({
        fetchPolicy: 'network-only',
        query: gql`
        {
          cards {
            id,
            deck,
            question,
            answer,
          }
        }
      `,
      })
      .then(cardsReturned => {
        let cards = [];
        for (let card of cardsReturned['data'].cards) {
          cards.push(card);
        }
        this.setState({ cards });
      });
  };
  componentDidMount() {
    this.loadData();
  }
  goToDeckView = (e, deckname) => {
    Animated.sequence([
      Animated.timing(this.state.animVal, { duration: 10, toValue: 2 }),
      Animated.spring(this.state.animVal, { toValue: 1, friction: 4 }),
    ]).start(finished => {
      let cards = [];
      for (let card of this.state.cards) {
        if (card.deck == deckname) {
          cards.push(card);
        }
      }
      this.props.navigation.navigate('Deck', {
        deckName: deckname,
        cards: cards,
      });
    });
  };
  render() {
    return (
      <ScrollView>
        <NavigationEvents
          onDidFocus={payload => {
            this.loadData();
          }}
        />
        {this.state.decks
          ? this.state.decks.map(deck => {
              return (
                <Animated.View
                  style={
                    ([styles.section, {transform: [{scale: this.state.animVal}]}])
                  }>
                  <Button
                    title={deck}
                    onPress={e => this.goToDeckView(e, deck)}
                  />
                </Animated.View>
              );
            })
          : null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: 128,
    width: 128,
  },
  section: {
    margin: 10,
    backgroundColor: 'rgba(50,205,50, 0.9)',
    padding: 10,
  },
  button: {
    backgroundColor: 'rgb(34,139,34)',
  },
});
