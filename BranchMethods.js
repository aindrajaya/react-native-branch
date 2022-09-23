/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import Button from './Button';

import branch, {Branch, RegisterViewEvent} from 'react-native-branch';

const defaultContent = {
  title: 'Wait and see',
  contentDescription: 'My Content Description',
  contentMetadata: {
    customMetadata: {
      key1: 'value1',
    },
  },
};

class BranchMethods extends Component {

  linkx = null;

  state = {
    results: [],
  }

  componentWillUnmount() {
    if (!this.linkx) {return;}
    this.linkx.release();
  }

  createBranchUniversalObject = async () => {
    try {
      let result = await branch.createBranchUniversalObject('/broom/49pYxPjzutb', defaultContent);
      if (this.linkx) {this.linkx.release();}
      this.linkx = result;
      console.log('createBranchUniversalObject', result);
      this.addResult('success', 'createBranchUniversalObject', result);
    } catch (err) {
      console.log('createBranchUniversalObject err', err.toString());
      this.addResult('error', 'createBranchUniversalObject', err.toString());
    }
  }

  generateShortUrl = async () => {
    if (!this.linkx) {await this.createBranchUniversalObject();}
    try {
      let result = await this.linkx.generateShortUrl();
      console.log('generateShortUrl', result);
      this.addResult('success', 'generateShortUrl', result);
    } catch (err) {
      console.log('generateShortUrl err', err);
      this.addResult('error', 'generateShortUrl', err.toString());
    }
  }

  listOnSpotlight = async () => {
    if (!this.linkx) {await this.createBranchUniversalObject();}
    try {
      let result = await this.linkx.listOnSpotlight();
      console.log('listOnSpotlight', result);
      this.addResult('success', 'listOnSpotlight', result);
    } catch (err) {
      console.log('listOnSpotlight err', err.toString());
      this.addResult('error', 'listOnSpotlight', err.toString());
    }
  }

  showShareSheet = async () => {
    if (!this.linkx) {await this.createBranchUniversalObject();}
    try {
      let result = await this.linkx.showShareSheet();
      console.log('showShareSheet', result);
      this.addResult('success', 'showShareSheet', result);
    } catch (err) {
      console.log('showShareSheet err', err.toString());
      this.addResult('error', 'showShareSheet', err.toString());
    }
  }

  userCompletedAction = async() => {
    if (!this.linkx){await this.createBranchUniversalObject();}
    try {
      let result = await this.linkx.userCompletedAction(RegisterViewEvent);
      console.log('userCompletedAction', result);
      this.addResult('success', 'userCompletedAction', result);
    } catch (err) {
      console.log('userCompletedAction err', err.toString());
      this.addResult('error', 'userCompletedAction', err.toString());
    }
  }

  sendCommerceEvent = async() => {
    try {
      let result = await branch.sendCommerceEvent(20.00, {'key': 'value'});

      console.log('sendCommerceEvent', result);
      this.addResult('success', 'sendCommerceEvent', result);
    } catch (err) {
      console.log('sendCommerceEvent err', err.toString());
      this.addResult('error', 'sendCommerceEvent', err.toString());
    }
  }

  addResult(type, slug, payload) {
    let result = {type, slug, payload};
    this.setState({
      results: [result, ...this.state.results].slice(0, 10),
    });
  }

  createDeepLink = async() => {
    let link = {
      feature: 'sharing',
      channel: 'facebook',
      campaign: 'content 123 launch',
    };

    let controlParams = {
      $desktop_url: 'https://facebook.com/',
      custom: 'data',
    };

    try {
      let {res} = await this.linkx.generateShortUrl(link, controlParams);
      console.log('Depp link, generate short URL', res);
      this.addResult('success', 'Generate Short URL', res);
    } catch (error) {
      console.log('Error', error.toString());
      this.addResult('error', 'Generate Short URL', error.string());
    }
  }

  shareDeepLink = async () => {
    let shareOptions = {
      messageHeader: 'Check this out',
      messageBody: 'No really, check this out!',
    };
    let linkProperties = {
      feature: 'sharing',
      channel: 'facebook',
    };
    let controlParams = {
      $desktop_url: 'http://branch.io/home',
      $ios_url: 'http://branch.io/ios',
    };
    try {
      let {channel, completed, error} = await this.linkx.showShareSheet(shareOptions, controlParams, linkProperties);
      // return {channel, completed, error};
      console.log('Share sheet', completed);
      this.addResult('success', 'Share sheet', completed);
    } catch (error) {
      console.log('Error', error.toString());
    }
  }

  readDeepLink = async () => {
    // listener
    Branch.subscribe(({error, params, uri}) => {
      if (error) {
        console.error('Error from Branch: ' + error);
        return;
      }
      // params will never be null if error is null
    });

    try {
      let lastParams = await branch.getLatestReferringParams(); // params from last open
      let installParams = await branch.getFirstReferringParams(); // params from original install
      let {url} = await this.linkx.generateShortUrl(lastParams, installParams);
      console.log('Read deep link, generate short URL', url);
      this.addResult('success', 'Generate Short URL', url);
    } catch (error) {
      console.log('Error, generate shor ULR', error.toString());
    }
  }

  NavigateToContent = async () => {
      Branch.subscribe(({error, params, uri}) => {
        if (error) {
          console.error('Error from Branch: ' + error)
          return
        }

        // params will never be null if error is null

        if (params['+non_branch_link']) {
          const nonBranchUrl = params['+non_branch_link']
          // Route non-Branch URL if appropriate.
          return
        }

        if (!params['+clicked_branch_link']) {
              // A Branch link opened.
            // Route link based on data in params
            this.navigator.push({params: params, uri: uri})
          return
        }
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.header}>RESULTS</Text>
          <ScrollView style={styles.scrollContainer}>
            {this.state.results.length === 0 && <Text>No Results yet, run a method below</Text>}
            {this.state.results.map((result, i) => {
              return (
                <View key={i} style={styles.result}>
                  <Text style={result.type === 'success' ? styles.textSucccess : styles.textError}>{`${result.slug} (${result.type})`}</Text>
                  <Text style={styles.textSmall}>{JSON.stringify(result.payload, null, 2)}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <Text style={styles.header}>METHODS</Text>
        <ScrollView style={styles.buttonsContainer}>
          <Button style={styles.button} onPress={this.createBranchUniversalObject}><Text>createBranchUniversalObject</Text></Button>
          <Button style={styles.button} onPress={this.userCompletedAction}><Text>userCompletedAction</Text></Button>
          <Button style={styles.button} onPress={this.sendCommerceEvent}><Text>sendCommerceEvent</Text></Button>
          <Button style={styles.button} onPress={this.generateShortUrl}><Text>generateShortUrl</Text></Button>
          <Button style={styles.button} onPress={this.listOnSpotlight}><Text>listOnSpotlight</Text></Button>
          <Button style={styles.button} onPress={this.showShareSheet}><Text>showShareSheet</Text></Button>
          <Button style={styles.button} onPress={this.createDeepLink}><Text>Deep Link Create</Text></Button>
          <Button style={styles.button} onPress={this.shareDeepLink}><Text>Share Deep Link</Text></Button>
          <Button style={styles.button} onPress={this.readDeepLink}><Text>Read Deep Link</Text></Button>
          <Button style={styles.button} onPress={this.NavigateToContent}><Text>Navigate</Text></Button>
        </ScrollView>
      </View>
    );
  }
}

export default BranchMethods;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
  },
  header: {
    backgroundColor: '#f19d18',
    padding: 5,
    paddingLeft: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#aaa',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resultsContainer: {
    height: 200,
    backgroundColor: '#fff8e1',
  },
  scrollContainer: {
    padding: 10,
  },
  result: {
    padding: 5,
  },
  textSmall: {
    fontSize: 10,
  },
  textSucccess: {
    color: '#2b8738',
  },
  textError: {
    color: '#a03d31',
  },
  buttonsContainer: {
    flex: 1,
    backgroundColor: '#fff3c9',
  },
  button : {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
});
