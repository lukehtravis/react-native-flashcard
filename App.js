import * as React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { Constants } from 'expo';
import {
  createBottomTabNavigator,
  createStackNavigator,
} from 'react-navigation';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { createAppContainer } from 'react-navigation';
import { AsyncStorage } from 'react-native';
// You can import from local files
import Home from './components/Home';
import Deck from './components/Deck';
import AddCard from './components/AddCard';
import AddDeck from './components/AddDeck';
import Quiz from './components/Quiz';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { setLocalNotification } from './utils/pushNotification'

// or any pure javascript modules available in npm
const Tabs = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <Ionicons name="ios-bookmarks" size={30} color={tintColor} />
        ),
      },
    },
    AddDeck: {
      screen: AddDeck,
      navigationOptions: {
        tabBarLabel: 'Add Deck',
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="plus-square" size={30} color={tintColor} />
        ),
      },
    },
  },
  {
    navigationOptions: {
      header: null,
    },
    tabBarOptions: {
      activeTintColor: Platform.OS === 'ios' ? '#292477' : '#fff',
      style: {
        height: 56,
        backgroundColor: Platform.OS === 'ios' ? '#fff' : '#292477',
        shadowColor: 'rgba(0, 0, 0, 0.24)',
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowRadius: 6,
        shadowOpacity: 1,
      },
    },
  }
);
const Stack = createStackNavigator({
  Home: {
    screen: Tabs,
  },
  Deck: {
    screen: Deck,
    navigationOptions: {
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#292477',
      },
    },
  },
  AddCard: {
    screen: AddCard,
    navigationOptions: {
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#292477',
      },
    },
  },
  Quiz: {
    screen: Quiz,
    navigationOptions: {
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#292477',
      },
    },
  },
});
const AppContainer = createAppContainer(Stack);
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}
const client = new ApolloClient({
  uri: 'https://flashcardsreact.herokuapp.com/v1alpha1/graphql',
});
export default class App extends React.Component {
  componentDidMount() {
     setLocalNotification()
  }
  render() {
    return (
      <View style={styles.container}>
        <AppContainer />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
});
