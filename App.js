/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import Axios from 'axios';
import RNAccountKit from 'react-native-facebook-account-kit'

export default class App extends Component {

  constructor(){
    super();
    this.state = {
      phoneNumber: ''
    }
  }

  componentDidMount() {

    // Configures the SDK with some options
    RNAccountKit.configure({
      responseType: 'code', // 'token' by default,
      initialPhoneCountryPrefix: '+880', // autodetected if none is provided
      // receiveSMS: true | false, // true by default,
      // countryWhitelist: ['AR'], // [] by default
      // countryBlacklist: ['US'], // [] by default
      defaultCountry: 'BD',
      // theme: { ...} // for iOS only, see the Theme section
    })

    // Shows the Facebook Account Kit view for login via SMS
    RNAccountKit.loginWithPhone()
      .then(async (token) => {
        if (!token) {
          console.log('Login cancelled')
        } else {
          console.log(`Logged with phone. Token: ${JSON.stringify(token)}`);

          var getResults = await this.sendRequestForPhoneNumber(token.code);
          console.log('Here is the verified Phone Number: ', getResults);
          this.setState({
            phoneNumber: getResults.phone.number
          })
        }
      })
  }

  sendRequestForPhoneNumber = async (token) => {

    try {
      // console.log('token from system: ', token);
      var access_token_data = ['AA', '342870159596630', '0542594da847835372aad5087a5e963e']

      var access_token = access_token_data.join('|');

      var token_exchange_url = `https://graph.accountkit.com/v1.1/access_token?grant_type=authorization_code&code=${token}&access_token=${access_token}`;
      let getTokens = await Axios(token_exchange_url);
      let getDetailsUrl = `https://graph.accountkit.com/v1.1/me?access_token=${getTokens.data.access_token}`;

      let getDetailsUser = await Axios(getDetailsUrl);
      return getDetailsUser.data;
    } catch (error) {
      console.log('from the catch block: ', error);
    }
  }

  render() {

    

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Congratulations! You have successfully verified your account</Text>
        <Text style={styles.instructions}>Here is your Phone Number: {this.state.phoneNumber}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
