import { IonApp, setupIonicReact } from '@ionic/react';
import { useState } from 'react';
import { PhonePePaymentPlugin } from 'ionic-capacitor-phonepe-pg';

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
  IonInput, 
  IonItem, 
  IonList
} from '@ionic/react';

/* Theme variables */
import './theme/variables.css';
import { Capacitor } from '@capacitor/core';

setupIonicReact();

const App = () => {

  const [message, setMessage] = useState<string>('Message: ');

  const [merchantId, setMerchantId] = useState('');
  const [request, setRequest] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [flowId, setFlowId] = useState('');

  const handleFlowIdChange = (e: any) => {
    setFlowId(e.detail.value);
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleOptionChange = (e: any) => {
    setSelectedOption(e.detail.value);
  };

  const handleMerchantIdChange = (e: any) => {
    setMerchantId(e.detail.value);
  };

  const handelRequestChange = (e: any) => {
    setRequest(e.detail.value);
  };

  const initSDK = () => {
    initPhonePeSDK();
  };

  const startTransaction = () =>  {
      handleStartTransaction();
  }

  const handleStartTransaction = async () => {
        await PhonePePaymentPlugin.startTransaction({
          request: request,
          appSchema: 'ionicDemoApp',
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
      isChecked);
    PhonePePaymentPlugin.init({
      environment: selectedOption,
      merchantId: merchantId,
      flowId: flowId,
      enableLogging: isChecked
    }).then(result => {
      console.log('VS: '+ JSON.stringify(result));
      setMessage("Message: SDK Initialisation ->" + JSON.stringify(result));
    }).catch(error => {
      console.log('VS: error:'+ error.message);
      setMessage("error:" + error.message);
    })
  };

  const getUpiApps = () => {
    if (Capacitor.getPlatform() === 'android') { 
        getUpiAppsForAndroid();
    } else {
        getUpiAppsForIos();
    }
  }

  const getUpiAppsForAndroid = () => {
      PhonePePaymentPlugin.getUpiAppsForAndroid().then(result => {
        if (result['status'] != null)
          setMessage(JSON.stringify(JSON.parse(result['status'])));
      }).catch(error => {
        setMessage("error:" + error.message);
      })
  };

  const getUpiAppsForIos = () => {
      PhonePePaymentPlugin.getUpiAppsForIos().then(result => {
        if (result['status'] != null)
          setMessage(JSON.stringify(result['status']));
      }).catch(error => {
        setMessage("error:" + error.message);
      })
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
      <IonLabel position="floating">Flow Id</IonLabel>
      <IonInput
        type="text"
        value={flowId}
        onIonChange={handleFlowIdChange}
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
      <IonLabel position="floating">Request Json</IonLabel>
      <IonInput
        type="text"
        value={request}
        onIonChange={handelRequestChange}
      />
    </IonItem>
  </IonList>

  <IonButton expand="full" onClick={ startTransaction }>
        Start Transaction
      </IonButton>

  <IonLabel className="ion-padding">Check Installed Apps:</IonLabel>

  <IonButton expand="full" onClick={ getUpiApps }>
        Get UPI Apps
      </IonButton>

  <IonLabel>{message}</IonLabel>
</IonContent>
    </IonApp>
  );
}

export default App;
