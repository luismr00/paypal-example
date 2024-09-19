import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState, useRef, useEffect } from "react";

const PaymentComponent = () => {
    const [subType, setSubType] = useState("basic");
    const [paymentFrequency, setPaymentFrequency] = useState("monthly");
    const subTypeRef = useRef(subType);  // Hold the latest value of subType in a ref
    const paymentFrequencyRef = useRef(paymentFrequency);

    const handleSubscriptionCreate = async (data, actions) => {
        let planId;
        if (subType === "basic") {
            planId = paymentFrequency === "monthly" ? "P-4RY214569J5152447M3OHIQY" : "P-9YT87785T9430173DM3OQRWQ";
        } else {
            planId = paymentFrequency === "monthly" ? "P-5A7812209H7735713M3OHJTQ" : "WILL ADD LATER";
        }

        console.log("Plan ID", planId);
        console.log("subType", subType);
        console.log("paymentFrequency", paymentFrequency);
        // console.log("subType from ref", subTypeRef.current);
        return actions.subscription.create({
            'plan_id': planId
        });

        // const response = await fetch("http://localhost:4000/paypal/create-subscription", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ planId })
        // });
        // const data = await response.json();
        // return data.id;
    };

        useEffect(() => {
            subTypeRef.current = subType;  // Update the ref when subType changes
            console.log("Current subType:", subType);
            console.log("Current paymentFrequency:", paymentFrequency);
        }, [subType, paymentFrequency]);

    return (
        <PayPalScriptProvider options={{ 
            "client-id": "AXwydiu6eZHahbsEwEdvtvfO-15SHLeJo3IX18VIn0zMLWzyUL02_D-K_dqQgsIFUXoS-6Yim1d2K2xo",
            "vault": true, 
        }}>
            <div>
                <h2>Choose Subscription Type:</h2>
                <select value={subType} onChange={(e) => setSubType(e.target.value)}>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                </select>

                <h2>Choose Payment Frequency:</h2>
                <select value={paymentFrequency} onChange={(e) => setPaymentFrequency(e.target.value)}>
                    <option value="monthly">Monthly</option>
                    <option value="one-time">One-time</option>
                </select>

                <h3>Subscription Payment</h3>
                <PayPalButtons
                    key={`${subType}-${paymentFrequency}`} // Ensure re-render when state changes
                    style={{
                        shape: "rect",
                        layout: "vertical",
                        color: "gold",
                        label: "subscribe",
                    }}
                    createSubscription={handleSubscriptionCreate}
                    onApprove={(data, actions) => {
                        alert("Subscription Successful!");
                    }}
                />
            </div>
        </PayPalScriptProvider>
    );
}

export default PaymentComponent;