import { useState } from "react";


const [preferenceId, setPreferenceId] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [orderData, setOrderData] = useState({ quantity: "1", price: laCnatidadDePlata, amount: 10, description: "Add Balance" });
  

export async function mercadoPagoWindow(){
    setIsLoading(true);
    try {
      const response = await fetch("https://localhost:3001/balance/" + elPutoMail + "/addBalance", {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(orderData),
      });

      const preference = await response.json();
      setPreferenceId(preference.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
}
  
const renderSpinner = () => {
    if (isLoading) {
      return (
        <div className="spinner-wrapper">
          <SpinnerCircular color="#009EE3" />
        </div>
      );
    }
};

const page = () =>{
    return (
        <InternalProvider context={{ preferenceId, isLoading, orderData, setOrderData }}>
        <main>
            {renderSpinner()}
            <Checkout onClick={handleClick} description />
            <Payment />
        </main>
        <Footer />
        </InternalProvider>
    );
};
  