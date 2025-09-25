import React, { useState, useEffect } from "react";
import {
  PaymentForm,
  CreditCard,
} from 'react-square-web-payments-sdk';

import { useDispatch } from "react-redux";

import { postSquareCardDetails } from "./squarepayment.slice";
import { post } from "jquery";
export default function Squarepayment(props) {
    const dispatch = useDispatch();
  return (
    <PaymentForm
      applicationId="sandbox-sq0idb-GdrzwxKax17WM_Do9aW20g"
      locationId="L9ATZYQD3KEM4"
      cardTokenizeResponseReceived={(token, buyer) => {
        console.log('Nonce:', token); // This is the nonce
        // Send `token` to your backend to store or charge
        dispatch(postSquareCardDetails(token));
      }}
      createVerificationDetails={() => ({
        amount: '1.00',
        billingContact: {
          familyName: 'Doe',
          givenName: 'John',
          countryCode: 'US',
          city: 'New York',
          addressLines: ['123 Main St'],
        },
        currencyCode: 'USD',
        intent: 'STORE', // Use 'STORE' to save card details
      })}
    >
      <CreditCard />
    </PaymentForm>
  );
}
