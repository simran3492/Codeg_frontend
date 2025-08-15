import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';

export default function Paywall() {
    const { user } = useSelector(state => state.auth);

    const handlePayment = async () => {
        try {
            // Step 1: Call your backend to create the payment order
            console.log("Creating payment order...");
            const { data: order } = await axiosClient.post('/pay/create-order');
            
            console.log("Order created:", order);

            // Check if Razorpay is loaded
            if (!window.Razorpay) {
                throw new Error("Razorpay SDK not loaded. Please add the script tag to your HTML.");
            }

            // Step 2: Configure the Razorpay Checkout options
            const options = {
                key: order.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID, // Use key from backend response or fallback
                amount: order.amount, // Use amount from order response
                currency: order.currency || "INR",
                name: "CodeG",
                description: "Lifetime Unlock",
                order_id: order.id, // The order_id from your backend

                // This function is called after the payment is completed
                handler: async function (response) {
                    try {
                        console.log("Payment completed:", response);
                        
                        // Step 3: Send payment details to your backend for verification
                        const verificationResult = await axiosClient.post('/pay/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });

                        console.log("Payment verified:", verificationResult.data);
                        alert(verificationResult.data.message);
                        
                        // Reload the page to refetch the user's new "subscribed" status
                        window.location.reload();

                    } catch (verifyError) {
                        console.error("Payment verification failed:", verifyError);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                
                // Handle payment failures
                modal: {
                    ondismiss: function() {
                        console.log("Payment modal dismissed");
                    }
                },
                
                prefill: {
                    name: user?.firstName || '',
                    email: user?.emailID || '',
                },
                
                theme: {
                    color: "#0B1120"
                }
            };

            console.log("Razorpay options:", options);

            // Step 4: Create a new Razorpay instance and open the checkout modal
            const rzp = new window.Razorpay(options);
            
            // Handle payment failures
            rzp.on('payment.failed', function (response) {
                console.error("Payment failed:", response.error);
                alert(`Payment failed: ${response.error.description}`);
            });
            
            rzp.open();

        } catch (error) {
            console.error("Payment initialization error:", error);
            
            // More specific error messages
            if (error.response) {
                const errorData = error.response.data;
                console.error("Server error:", errorData);
                alert(`Error: ${errorData.message || 'Server error occurred'}`);
            } else if (error.request) {
                console.error("Network error:", error.request);
                alert("Network error. Please check your connection and try again.");
            } else {
                console.error("Error:", error.message);
                alert(`Error: ${error.message}`);
            }
        }
    };

    handlePayment();
}