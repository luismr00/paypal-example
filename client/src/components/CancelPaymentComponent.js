import React, {useState} from 'react'

const CancelPaymentComponent = () => {

    const [subscriptionId, setSubscriptionId] = useState("");

    const handleCancellation = async () => {
        // Add code to cancel subscription
        console.log("Subscription ID", subscriptionId);

        const response = await fetch("http://localhost:4000/paypal/cancel-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscriptionId })
        });

        const data = await response.json();
        console.log(data);

        if (data.status === "CANCELLED" || data.status === "Cancellation initiated") {
            alert("Subscription cancelled successfully");
        } else {
            alert("Failed to cancel subscription");
        }
    }

  return (
    <div>
        <h1>Cancel Payment</h1>
        <input type="text" placeholder="Enter Subscription ID" onChange={(e) => setSubscriptionId(e.target.value)} />
        <button onClick={handleCancellation}>Cancel Subscription</button>
    </div>
  )
}

export default CancelPaymentComponent