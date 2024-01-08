import { IonApp, setupIonicReact } from '@ionic/react';
import { useState } from 'react';
import { PhonePePaymentPlugin } from 'phonepe-payment-capacitor';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import {
  IonLabel,
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonRow,
  IonCol,
  IonInput, 
  IonItem, 
  IonList
} from '@ionic/react';

/* Theme variables */
import './theme/variables.css';
import { Capacitor } from '@capacitor/core';

setupIonicReact();

const App = () => {

  const [packageName, setPackageName] = useState<string>('');
  const [headers, setHeaders] = useState<any>({});
  const [headerKey, setHeaderKey] = useState<string>('');
  const [headerValue, setHeaderValue] = useState<string>('');

  const [message, setMessage] = useState<string>('Message: ');

  const [appId, setAppId] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [base64, setbase64] = useState('');
  const [checksum, setchecksum] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const handleAddHeader = () => {
    setHeaders({
      ...headers,
      [headerKey]: headerValue
    })
    setHeaderKey("");
    setHeaderValue("");
  };


  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleOptionChange = (e: any) => {
    setSelectedOption(e.detail.value);
  };


  const handleAppIdChange = (e: any) => {
    setAppId(e.detail.value);
  };
  
  const handleMerchantIdChange = (e: any) => {
    setMerchantId(e.detail.value);
  };

  const handleBase64Change = (e: any) => {
    setbase64(e.detail.value);
  };

  const handleChecksumChange = (e: any) => {
    setchecksum(e.detail.value);
  };

  const initSDK = () => {
    initPhonePeSDK();
  };

  const startTransaction = () =>  {
      handleStartTransaction();
  }

  const handlePackageNameChange = (e: any) => {
    setPackageName(e.detail.value);
  };

  const handleStartTransaction = async () => {
        await PhonePePaymentPlugin.startTransaction({
          body: base64,
          checksum: checksum,
          packageName: packageName, // Package name
          appSchema: 'ionicDemoApp'
        }).then(a => {
          console.log('VS: '+ JSON.stringify(a));
          setMessage(JSON.stringify(a));
        }).catch(error => {
          console.log('VS: error:'+ error.message);
          setMessage("error:" + error.message);
        })
  };

  const initPhonePeSDK = () => {
    console.log(selectedOption,
      merchantId,
      appId,
      isChecked);
    PhonePePaymentPlugin.init({
      environment: selectedOption,
      merchantId: merchantId,
      appId: appId,
      enableLogging: isChecked
    }).then(result => {
      console.log('VS: '+ JSON.stringify(result));
      setMessage("Message: SDK Initialisation ->" + JSON.stringify(result));
    }).catch(error => {
      console.log('VS: error:'+ error.message);
      setMessage("error:" + error.message);
    })
  };


  const handleIsPhonePeAppInstalled = () => {
    PhonePePaymentPlugin.isPhonePeInstalled().then(a => {
      console.log('VS: '+ JSON.stringify(a));
      setMessage("Message: PhonePe App Installed" + JSON.stringify(a))
    }).catch(error => {
      console.log('VS: error:'+ error.message);
      setMessage("error:" + error.message);
    })
  };

  const handleIsGPayAppInstalled = () => {
    PhonePePaymentPlugin.isGpayInstalled().then(a => {
      console.log('VS: '+ JSON.stringify(a));
      setMessage("Message: Gpay App Installed - "+ JSON.stringify(a));
    }).catch(error => {
      console.log('VS: error:'+ error.message);
      setMessage("error:" + error.message);
    })
  };

  const handleIsPaytmInstalled = () => {
    PhonePePaymentPlugin.isPaytmInstalled().then(a => {
      console.log('VS: '+ JSON.stringify(a));
      setMessage("Message: Paytm App Installed - "+ JSON.stringify(a));
    }).catch(error => {
      console.log('VS: error:'+ error.message);
      setMessage("error:" + error.message);
    })
  };

  const getPackageSignatureForAndroid = () => {
    if (Capacitor.getPlatform() === 'android') {
      PhonePePaymentPlugin.getPackageSignatureForAndroid().then(result => {
        setMessage(JSON.stringify(result['status']));
      }).catch(error => {
        setMessage("error:" + error.message);
      })
    }
  };

  const getUpiAppsForAndroid = () => {
    if (Capacitor.getPlatform() === 'android') {
      PhonePePaymentPlugin.getUpiAppsForAndroid().then(result => {
        if (result['status'] != null)
          setMessage(JSON.stringify(JSON.parse(result['status'])));
      }).catch(error => {
        setMessage("error:" + error.message);
      })
    }
  };

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>PhonePe Payment Ionic App</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
  <IonList>
    <IonItem>
      <IonLabel position="floating">App Id</IonLabel>
      <IonInput
        type="text"
        value={appId}
        onIonChange={handleAppIdChange}
      />
    </IonItem>
    <IonItem>
      <IonLabel position="floating">Merchant Id</IonLabel>
      <IonInput
        type="text"
        value={merchantId}
        onIonChange={handleMerchantIdChange}
      />
    </IonItem>

    <IonItem>
      <IonLabel>Set Environment:</IonLabel>
      <IonSelect
        value={selectedOption}
        onIonChange={handleOptionChange}
        interface="popover" 
      >
        <IonSelectOption value="SANDBOX">SANDBOX</IonSelectOption>
        <IonSelectOption value="PRODUCTION">PRODUCTION</IonSelectOption>
      </IonSelect>
    </IonItem>

    <IonItem>
      <IonLabel>Enable Logs</IonLabel>
      <IonCheckbox
        checked={isChecked}
        onIonChange={handleCheckboxChange}
        slot="start" // To align the checkbox correctly
      />
    </IonItem>
  </IonList>

  <IonButton expand="full" onClick={initSDK}>
    Init SDK
  </IonButton>

  <IonList>
    <IonItem>
      <IonLabel position="floating">Base 64 request</IonLabel>
      <IonInput
        type="text"
        value={base64}
        onIonChange={handleBase64Change}
      />
    </IonItem>
    <IonItem>
      <IonLabel position="floating">Checksum</IonLabel>
      <IonInput
        type="text"
        value={checksum}
        onIonChange={handleChecksumChange}
      />
    </IonItem>
  </IonList>

{ Capacitor.getPlatform() == 'android' &&
  <IonItem>
      <IonLabel position="floating">Package Name:</IonLabel>
      <IonInput
        type="text"
        value={packageName}
        onIonChange={handlePackageNameChange}
      />
  </IonItem>
}

  <IonButton expand="full" onClick={startTransaction}>
    Start Transaction
  </IonButton>

  <IonLabel className="ion-padding">Check Installed Apps:</IonLabel>

  <IonRow className="ion-padding">
    <IonCol size="4">
      <IonButton expand="full" onClick={handleIsPhonePeAppInstalled}>
        PhonePe
      </IonButton>
    </IonCol>
    <IonCol size="4">
      <IonButton expand="full" onClick={handleIsGPayAppInstalled}>
        GPay
      </IonButton>
    </IonCol>
    <IonCol size="4">
      <IonButton expand="full" onClick={handleIsPaytmInstalled}>
        Paytm
      </IonButton>
    </IonCol>
  </IonRow>

{ Capacitor.getPlatform() == 'android' &&
  <IonRow className="ion-padding">
    <IonCol size="6">
      <IonButton expand="full" onClick={getPackageSignatureForAndroid}>
        Package Signature
      </IonButton>
    </IonCol>
    <IonCol size="6">
      <IonButton expand="full" onClick={getUpiAppsForAndroid}>
        UPI Apps
      </IonButton>
    </IonCol>
  </IonRow>
}

  <IonLabel>{message}</IonLabel>
</IonContent>
    </IonApp>
  );
}

export default App;
