import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View, Linking} from 'react-native';

import Button from './Button';

import branch, {RegisterViewEvent, BranchEvent} from 'react-native-branch';

const defaultProduct = {
  title: 'Try event ssss',
};

const adidasProduct = {
  canonicalUrl: 'https://www.adidas.com/us/nmd_r1-shoes/FZ3777.html',
  title: 'NMD R1',
  contentMetadata: {
    quantity: 1,
    price: 23.12,
    sku: '1994320302',
    productName: 'Shoes Adidas',
    productBrand: 'Adidas',
    // customMetadata: {
    //   og_title: 'Adidas Shoes',
    //   og_description: 'Adidsa shoes for runner',
    //   android_deeplink_path: 'product/FZ3777',
    //   og_app_id: '129087217170262',
    //   deeplink_path: 'product/FZ3777',
    //   ios_deeplink_path: 'product/FZ3777',
    // },
  },
};

let Params = {
  transactionID: '12344554',
  currency: 'USD',
  revenue: 1.5,
  shipping: 10.2,
  tax: 12.3,
  coupon: 'Coupon_Y',
  affiliation: 'test_affiliation',
  description: 'Test purchase event',
  searchQuery: 'test keyword',
  customData: {
    depplink_path: 'product/FZ3777',
    og_app_id: '129087217170262',
    $og_title: 'Adidas Android App from params di luar',
    $canonical_identifier: 'adidas/5324',
  },
  alias: 'WishList',
};

class AnotherBranch extends Component {
  product = null;
  // lastParams = null;
  // installParams = null;

  state = {
    results: [],
    // data: null,
  };

  // params = {
  //   transactionID: '12344554',
  //   currency: 'USD',
  //   revenue: 1.5,
  //   shipping: 10.2,
  //   tax: 12.3,
  //   coupon: 'Coupon_Y',
  //   affiliation: 'test_affiliation',
  //   description: 'Test purchase event',
  //   searchQuery: 'test keyword',
  //   // customData: this.state.data,
  //   customData: {
  //     depplink_path: 'product/FZ3777',
  //     og_app_id: '129087217170262',
  //     $og_title: 'Adidas Android App from params',
  //     $canonical_identifier: 'adidas/5324',
  //   },
  //   alias: 'WishList',
  // };

  // adidasProduct = {
  //   canonicalUrl: 'https://www.adidas.com/us/nmd_r1-shoes/FZ3777.html',
  //   title: 'NMD R1',
  //   contentMetadata: {
  //     quantity: 1,
  //     price: 23.12,
  //     sku: '1994320302',
  //     productName: 'Shoes Adidas',
  //     productBrand: 'Adidas',
  //     // customMetadata: {
  //     //   og_title: 'Adidas Shoes',
  //     //   og_description: 'Adidsa shoes for runner',
  //     //   android_deeplink_path: 'product/FZ3777',
  //     //   og_app_id: '129087217170262',
  //     //   deeplink_path: 'product/FZ3777',
  //     //   ios_deeplink_path: 'product/FZ3777',
  //     // },
  //   },
  // };

  componentWillUnmount() {
    if (!this.product) {
      return;
    }
    this.product.release();
  }

  /**
   * Dummy data
   */
  getData = () => {
    this.setState({
      data: {
        a: 'string',
        b: 'string2',
      },
    });
  };

  /**
   * Check branch params
   */
  checkDataFromBranchSDK = async () => {
    try {
      // let res = await branch.subscribe();
      let last = await branch.getLatestReferringParams();
      // let first = await branch.getFirstReferringParams();
      let init = await branch.initSessionTtl()
      this.product = last.key;
      this.addResult('success', 'createBranchUniversalObject', last);
    } catch (error) {
      console.log('createBranchUniversalObject err', error.toString());
      this.addResult('error', 'createBranchUniversalObject', error.toString());
    }
    await branch.subscribe(({error, params, uri}) => {
      if (error) {
        console.error('Error from Branch: ' + error);
        return;
      }

      console.log('Paramssss: ', params);
      console.log('uri: ', uri);

      if (params['+non_branch_link']) {
        const nonBranchUrl = params['+non_branch_link'];
        return;
      }

      if (!params['+clicked_branch_link']) {
        return;
      }

      // A Branch link was opened.
      // Route link based on data in params, e.g.
      const title = params.$og_title;
      const url = params.$canonical_identifier;
      const image = params.$og_image_url;
      const deeplink = params.$deeplink_path;
      const appId = params.$og_app_id;
      const deeplinkUrl = params['+url'];
      const canonicalUrlPar = params.$canonical_url;
      this.setState({
        data: {
          deeplink: deeplink,
          appId: appId,
          androidDeeplink: deeplinkUrl,
          canonicalUrl: canonicalUrlPar,
          canonicalIdentifier: url,
        },
      });
      const datasss = {title, url, image};
      this.addData(datasss);
      console.log('createBranchUniversalObject', title);
      this.addResult('success', 'createBranchUniversalObject', title);
    });

    let lastParams = await branch.getLatestReferringParams();
    let installParams = await branch.getFirstReferringParams();

    console.log('LAST PARAMS', lastParams);
    this.addResult('success', 'createBranchUniversalObject', lastParams);
    console.log('INSTALL', installParams);
  };

  /**
   * Adidas Shoes object
   */
  dataCommerceShoesAdidas = async () => {
    try {
      let res = await branch.createBranchUniversalObject(
        'adidasItem/12345',
        adidasProduct,
      );
      if (this.product) {
        this.product.release();
      }
      this.product = res;
      console.log('createBranchUniversalObject', res);
      this.addResult('success', 'createBranchAdidasObject', res);
    } catch (error) {
      console.log('createBranchUniversalObject err', error.toString());
      this.addResult('error', 'createBranchAdidasObject', error.toString());
    }
  };

  /**
   * Default branch object
   */
  createBranchUniversalObject = async () => {
    try {
      let result = await branch.createBranchUniversalObject(
        'abcd/1',
        defaultProduct,
      );
      if (this.product) {
        this.product.release();
      }
      this.product = result;
      console.log('createBranchUniversalObject', result);
      this.addResult('success', 'createBranchUniversalObject', result);
    } catch (err) {
      console.log('createBranchUniversalObject err', err.toString());
      this.addResult('error', 'createBranchUniversalObject', err.toString());
    }
  };

  generateShortUrl = async () => {
    let link = {
      feature: 'sharing',
      channel: 'adidas',
      campaign: 'content addidas shoes',
    };

    let controlParams = {
      desktop_url: 'https://nike.com/',
      custom: 'data',
    };

    if (!this.product) {
      let res = await branch.createBranchUniversalObject(
        'item/1',
        this.adidasProduct,
      );
      this.product = res;
    }
    try {
      let result = await this.product.generateShortUrl(link, controlParams);
      console.log('generateShortUrl', result);
      this.addResult('success', 'generateShortUrl', result);
    } catch (err) {
      console.log('generateShortUrl err', err);
      this.addResult('error', 'generateShortUrl', err.toString());
    }
  };

  sendCommerceEvent = async () => {
    try {
      let result = await branch.sendCommerceEvent(20.0, {key: 'value'});
      console.log('sendCommerceEvent', result);
      this.addResult('success', 'sendCommerceEvent', result);
    } catch (err) {
      console.log('sendCommerceEvent err', err.toString());
      this.addResult('error', 'sendCommerceEvent', err.toString());
    }
  };

  /**
   * Event Standard Commerce
   */
  logStandardEventCommerceAddToWishlist = async () => {
    if (!this.product) {
      this.dataCommerceShoesAdidas();
    }
    try {
      let branchEventWhislist = new BranchEvent(
        BranchEvent.AddToWishlist,
        [this.product],
        Params,
      );
      branchEventWhislist.logEvent();
      this.addResult(
        'success',
        'logStandardEventCommerceAddToWishlist',
        branchEventWhislist,
      );
    } catch (err) {
      console.log('sendStandardEvent err', err);
      this.addResult(
        'error',
        'logStandardEventCommerceAddToWishlist',
        err.toString(),
      );
    }
  };

  logStandardEventCommerceAddToCard = async () => {
    if (!this.product) {
      this.dataCommerceShoesAdidas();
    }
    try {
      let branchEventAddToCart = new BranchEvent(
        BranchEvent.AddToCart,
        [this.product],
        Params,
      );
      branchEventAddToCart.logEvent();
      this.addResult(
        'success',
        'logStandardEventCommerceAddToCard',
        branchEventAddToCart,
      );
    } catch (err) {
      console.log('sendStandardEvent err', err);
      this.addResult(
        'error',
        'logStandardEventCommerceAddToCard',
        err.toString(),
      );
    }
  };

  logStandardEventCommercePurchase = async () => {
    if (!this.product) {
      this.dataCommerceShoesAdidas();
    }
    try {
      let branchEventPurchase = new BranchEvent(
        BranchEvent.Purchase,
        [this.product],
        Params,
      );
      branchEventPurchase.logEvent();
      this.addResult(
        'success',
        'logStandardEventCommercePurchase',
        branchEventPurchase,
      );
    } catch (err) {
      console.log('sendStandardEvent err', err);
      this.addResult(
        'error',
        'logStandardEventCommercePurchase',
        err.toString(),
      );
    }
  };

  addResult(type, slug, payload){
    let result = {type, slug, payload};
    this.setState({
      results: [result, ...this.state.results].slice(0, 10),
    });
  }

  /**
   * Event Standard Content
   */
  logStandardEventContentSearch = async () => {
    if (!this.product) {
      this.dataCommerceShoesAdidas();
    }
    try {
      let branchEventSearch = new BranchEvent(
        BranchEvent.Search,
        [this.product],
        {
          alias: 'RMD R1 Adidas',
          description: 'Product Search',
          searchQuery: 'black men footbal',
          customData: {
            depplink_path: 'product/FZ3777',
            og_app_id: '129087217170262',
            $og_title: 'Adidas Android App',
            $canonical_identifier: 'adidas/5324',
          },
        },
      );
      branchEventSearch.logEvent();
      this.addResult(
        'success',
        'logStandardEventContentSearch',
        branchEventSearch,
      );
    } catch (err) {
      console.log('sendStandardEvent err', err);
      this.addResult('error', 'logStandardEventContentSearch', err.toString());
    }
  };

  /**
   * Event Standard - Lifecycle
   */
  logStandardEventLifecycleRegister = async () => {
    if (!this.product) {
      this.dataCommerceShoesAdidas();
    }
    try {
      let branchEventRegistration = new BranchEvent(
        BranchEvent.CompleteRegistration,
        [this.product],
        {
          os: 'Android',
          description: 'Preferred',
          developerIdentity: 'user1234',
          // customData: {
          //   depplink_path: 'product/FZ3777',
          //   og_app_id: '129087217170262',
          //   $og_title: 'Adidas Android App',
          //   $canonical_identifier: 'adidas/5324',
          // },
        },
      );
      branchEventRegistration.logEvent();
      this.addResult(
        'success',
        'logStandardEventLifecycleRegister',
        branchEventRegistration,
      );
    } catch (err) {
      console.log('sendStandardEvent err', err);
      this.addResult(
        'error',
        'logStandardEventLifecycleRegister',
        err.toString(),
      );
    }
  };

  /**
   * Not used
   */

  lastAttributedTouchData = async () => {
    const attributionWindow = 365;
    try {
      let latd = await branch.lastAttributedTouchData(attributionWindow);
      console.log('lastAttributedTouchData', latd);
      this.addResult('success', 'lastAttributedTouchData', latd);
    } catch (err) {
      console.log('lastAttributedTouchData', err);
      this.addResult('error', 'lastAttributedTouchData', err.toString());
    }
  };

  openPage = async ({link}) => {
    try {
      await Linking.openURL(link.url);
      this.addResult('success', 'openURL', link);
    } catch (err) {
      this.addResult('error', 'openURL', err.toString());
    }
  };

  openURL = async () => {
    const url = 'https://aloysius.app.link/EF8tn2kwmdb';
    try {
      await branch.openURL(url);
      this.addResult('success', 'openURL', url);
    } catch (err) {
      this.addResult('error', 'openURL', err.toString());
    }
  };

  createDeepLink = async () => {
    let link = {
      feature: 'sharing',
      channel: 'adidas',
      campaign: 'content 123 launch',
    };

    let controlParams = {
      $desktop_url: 'https://adidas.com/',
      custom: 'data',
    };

    try {
      let {res} = await this.product.generateShortUrl(link, controlParams);
      console.log('Depp link, generate short URL', res);
      this.addResult('success', 'Generate Short URL', res);
    } catch (error) {
      console.log('Error', error.toString());
      this.addResult('error', 'Generate Short URL', error.string());
    }
  };

  disableTracking = async () => {
    try {
      let disabled = await branch.isTrackingDisabled();
      branch.disableTracking(!disabled);
      disabled = await branch.isTrackingDisabled();
      let status = disabled ? 'Tracking Disabled' : 'Tracking Enabled';
      console.log('disableTracking', status);
      this.addResult('success', 'disableTracking', status);
    } catch (err) {
      console.log('disableTracking err', err);
      this.addResult('error', 'disableTracking', err.toString());
    }
  };

  isTrackingDisabled = async () => {
    try {
      let disabled = await branch.isTrackingDisabled();
      let status = disabled ? 'Tracking is Disabled' : 'Tracking is Enabled';
      console.log('isTrackingDisabled', status);
      this.addResult('success', 'isTrackingDisabled', status);
    } catch (err) {
      console.log('isTrackingDisabled err', err);
      this.addResult('error', 'isTrackingDisabled', err.toString());
    }
  };

  listOnSpotlight = async () => {
    if (!this.product) {
      await this.createBranchUniversalObject();
    }
    try {
      let result = await this.product.listOnSpotlight();
      console.log('listOnSpotlight', result);
      this.addResult('success', 'listOnSpotlight', result);
    } catch (err) {
      console.log('listOnSpotlight err', err.toString());
      this.addResult('error', 'listOnSpotlight', err.toString());
    }
  };

  showShareSheet = async () => {
    if (!this.product) {
      await this.createBranchUniversalObject();
    }
    try {
      let result = await this.product.showShareSheet();
      console.log('showShareSheet', result);
      this.addResult('success', 'showShareSheet', result);
    } catch (err) {
      console.log('showShareSheet err', err.toString());
      this.addResult('error', 'showShareSheet', err.toString());
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.resultsContainer}>
          <Text style={styles.header}>RESULTS</Text>
          <ScrollView style={styles.scrollContainer}>
            {this.state.results.length === 0 && (
              <Text> No Results yet, run a method below </Text>
            )}
            {this.state.results.map((result, i) => {
              return (
                <View key={i} style={styles.result}>
                  <Text
                    style={
                      result.type === 'success'
                     ? styles.textSucccess
                      : styles.textError
                    }>{`${result.slug} (${result.type})`}</Text>
                  <Text onPress={()=> Linking.openURL(result.payload.url)}  style={styles.textSmall}>{JSON.stringify(result.payload, null, 2)}</Text>
                </View>
              )
            })}
          </ScrollView>
        </View>
        <Text style={styles.header}>METHODS</Text>
        <ScrollView style={styles.buttonsContainer}>
          <Button onPress={this.dataCommerceShoesAdidas}>Create Branch Adidas Object</Button>
          <Button onPress={this.generateShortUrl}>Deep Link - Generate Short URL</Button>
          <Button onPress={this.logStandardEventCommercePurchase}>BranchEvent.logEvent (Commerce Purchase)</Button>
          <Button onPress={this.logStandardEventCommerceAddToCard}>BranchEvent.logEvent (Commerce AddToCart)</Button>
          <Button onPress={this.logStandardEventCommerceAddToWishlist}>BranchEvent.logEvent (Commerce AddToWishlist)</Button>
          <Button onPress={this.logStandardEventContentSearch}>BranchEvent.logEvent (Content Search)</Button>
          <Button onPress={this.logStandardEventLifecycleRegister}>BranchEvent.logEvent (Lifecycle Complete Registration)</Button>
          {/* <Button onPress={this.logCustomEvent}>BranchEvent.logEvent (Custom)</Button> */}
          {/* <Button onPress={this.disableTracking}>disableTracking (switch on/off)</Button> */}
          {/* <Button onPress={this.isTrackingDisabled}>isTrackingDisabled</Button> */}
          {/* <Button onPress={this.createBranchUniversalObject}>Create Branch Default Object</Button> */}
          {/* <Button onPress={this.checkDataFromBranchSDK}>Check Object from Branch</Button> */}
          {/* <Button onPress={this.sendCommerceEvent}>OpenCommerceEvent</Button> */}
          {/* <Button onPress={this.listOnSpotlight}>listOnSpotlight</Button> */}
          {/* <Button onPress={this.showShareSheet}>showShareSheet</Button> */}
        </ScrollView>
      </View>
    );
  }
}

export default AnotherBranch;

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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
});