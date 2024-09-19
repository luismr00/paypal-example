import React, { useState } from 'react';
import './App.css';
import PaymentComponent from './components/PaymentComponent';
import CancelPaymentComponent from './components/CancelPaymentComponent';
import Tabs from './components/Tabs';

function App() {

  const [tab, setTab] = useState("pay");

  return (
    <div>
      <Tabs setTab={setTab} />
      {tab === "pay" && <PaymentComponent />}
      {tab === "cancel" && <CancelPaymentComponent />}
    </div>
  );
}

export default App;
