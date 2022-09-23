import {Branch, BranchEvent} from 'react-native-branch';

let buo = await Branch.createBranchUniversalObject(
  "item/12345",
  {
    canonicalUrl: "https://branch.io/item/12345",
    title: "My Item Title",
    contentMetadata: {
      quantity: 1,
      price: 23.20,
      sku: "1994320302",
      productName: "my_product_name1",
      productBrand: "my_prod_Brand1",
      customMetadata: {
            custom_key1: "custom_value1",
            custom_key2: "custom_value2"
            }
    }
    }
)

let params = {
  transaction_id: "tras_Id_1232343434",
  currency: "USD",
  revenue: 180.2,
  shipping: 10.5,
  tax: 13.5,
  coupon: "promo-1234",
  affiliation: "high_fi",
  description: "Preferred purchase",
  purchase_loc: "Palo Alto",
  store_pickup: "unavailable",
  custom_data: {
   "Custom_Event_Property_Key1": "Custom_Event_Property_val1",
   "Custom_Event_Property_Key2": "Custom_Event_Property_val2"
  }
}
let event = new BranchEvent(BranchEvent.Purchase, [buo], params)
event.logEvent()