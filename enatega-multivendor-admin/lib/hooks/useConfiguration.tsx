/* eslint-disable no-unused-vars */
'use client';

// Core
import { useContext } from 'react';

// Context
import { IConfiguration } from '@/lib/utils/interfaces';

// Interface
import { ConfigurationContext } from '@/lib/context/global/configuration.context';
import { BACKEND_URL } from '@/lib/utils/constants';
import { Libraries } from '@react-google-maps/api';

export const useConfiguration = () => {
  const configuration: IConfiguration | undefined =
    useContext(ConfigurationContext);

  const GOOGLE_CLIENT_ID = configuration?.webClientID;
  const GOOGLE_CLIENT_ID_ANDRIOD = configuration?.androidClientID;
  const GOOGLE_CLIENT_ID_IOS = configuration?.iOSClientID;
  const GOOGLE_CLIENT_ID_EXPO = configuration?.expoClientID;
  const STRIPE_PUBLIC_KEY = configuration?.publishableKey;
  const STRIPE_SECRET_KEY = configuration?.secretKey;
  const PAYPAL_KEY = configuration?.clientId;
  const PAYPAL_SECRET = configuration?.clientSecret;
  const PAYPAL_SANDBOX = configuration?.sandbox;
  const GOOGLE_MAPS_KEY = configuration?.googleApiKey;
  const AMPLITUDE_API_KEY_WEB = configuration?.webAmplitudeApiKey;
  const AMPLITUDE_API_KEY_APP = configuration?.appAmplitudeApiKey;
  const LIBRARIES = 'places,drawing,geometry,localContext,visualization'.split(
    ','
  ) as Libraries;
  const COLORS = {
    GOOGLE: configuration?.googleColor,
  };

  const SKIP_EMAIL_VERIFICATION = configuration?.skipEmailVerification;
  const SKIP_MOBILE_VERIFICATION = configuration?.skipMobileVerification;
  const CURRENT_SYMBOL = configuration?.currencySymbol;
  const EMAIL_NAME = configuration?.emailName;
  const EMAIL = configuration?.email;
  const PASSWORD = configuration?.password;
  const ENABLE_EMAIL = configuration?.enableEmail;
  const DELIVERY_RATE = configuration?.deliveryRate;
  const COST_TYPE = configuration?.costType || 'perKM';
  const TWILIO_ACCOUNT_SID = configuration?.twilioAccountSid;
  const TWILIO_AUTH_TOKEN = configuration?.twilioAuthToken;
  const TWILIO_PHONE_NUMBER = configuration?.twilioPhoneNumber;
  const TWILIO_ENABLED = configuration?.twilioEnabled;
  const DASHBOARD_SENTRY_URL = configuration?.dashboardSentryUrl;
  const WEB_SENTRY_URL = configuration?.webSentryUrl;
  const API_SENTRY_URL = configuration?.apiSentryUrl;
  const CUSTOMER_APP_SENTRY_URL = configuration?.customerAppSentryUrl;
  const RESTAURANT_APP_SENTRY_URL = configuration?.restaurantAppSentryUrl;
  const RIDER_APP_SENTRY_URL = configuration?.riderAppSentryUrl;
  const CLOUDINARY_UPLOAD_URL = configuration?.cloudinaryUploadUrl;
  const CLOUDINARY_API_KEY = configuration?.cloudinaryApiKey;
  const FIREBASE_AUTH_DOMAIN = configuration?.authDomain;
  const FIREBASE_KEY = configuration?.firebaseKey;
  const FIREBASE_PROJECT_ID = configuration?.projectId;
  const FIREBASE_STORAGE_BUCKET = configuration?.storageBucket;
  const FIREBASE_MSG_SENDER_ID = configuration?.msgSenderId;
  const FIREBASE_APP_ID = configuration?.appId;
  const FIREBASE_MEASUREMENT_ID = configuration?.measurementId;
  const FIREBASE_VAPID_KEY = configuration?.vapidKey;
  const APP_TERMS = configuration?.termsAndConditions;
  const APP_PRIVACY = configuration?.privacyPolicy;
  const APP_TEST_OTP = configuration?.testOtp;
  const CURRENCY_CODE = configuration?.currency;
  const CURRENCY_SYMBOL = configuration?.currency;
  const ISPAID_VERSION = configuration?.isPaidVersion;

  return {
    SERVER_URL: BACKEND_URL.LIVE.SERVER_URL,
    WS_SERVER_URL: BACKEND_URL.LIVE.WS_SERVER_URL,
    COLORS,

    // EMAIL CONFIG
    EMAIL_NAME,
    EMAIL,
    PASSWORD,
    ENABLE_EMAIL,

    // STRIPE
    STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY,

    // PAYPAL
    PAYPAL_KEY,
    PAYPAL_SECRET,
    PAYPAL_SANDBOX,

    // DELIVERY RATE
    DELIVERY_RATE,
    COST_TYPE,

    // TWILIO
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER,
    TWILIO_ENABLED,

    // SENTRY
    DASHBOARD_SENTRY_URL,
    WEB_SENTRY_URL,
    API_SENTRY_URL,
    CUSTOMER_APP_SENTRY_URL,
    RESTAURANT_APP_SENTRY_URL,
    RIDER_APP_SENTRY_URL,

    // GOOGLE MAPS
    GOOGLE_MAPS_KEY,
    LIBRARIES,

    // CLOUDINARY
    CLOUDINARY_UPLOAD_URL,
    CLOUDINARY_API_KEY,

    // GOOGLE CLIENT
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_ID_ANDRIOD,
    GOOGLE_CLIENT_ID_IOS,
    GOOGLE_CLIENT_ID_EXPO,

    // FIREBASE
    FIREBASE_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MSG_SENDER_ID,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID,
    FIREBASE_VAPID_KEY,

    // APP CONFIG
    APP_TERMS,
    APP_PRIVACY,
    APP_TEST_OTP,

    // APP
    SKIP_EMAIL_VERIFICATION,
    SKIP_MOBILE_VERIFICATION,

    //CURRENCY
    CURRENCY_CODE,
    CURRENCY_SYMBOL,
    CURRENT_SYMBOL,

    // AMPLITUDE
    AMPLITUDE_API_KEY_WEB,
    AMPLITUDE_API_KEY_APP,

    // IS PAID VERSION
    ISPAID_VERSION,
  };
};
