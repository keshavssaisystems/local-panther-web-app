import {
  PaymentForm,
  CreditCard,
} from 'react-square-web-payments-sdk';

const squarepayment = () => (
  <PaymentForm
    applicationId="sandbox-sq0idb-GdrzwxKax17WM_Do9aW20g"
    locationId="YOUR_LOCATION_ID"
    cardTokenizeResponseReceived={(token, buyer) => {
      console.log('Nonce:', token); // This is the nonce
      // Send `token` to your backend to store or charge
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
