import axios from "axios";
import { Parking } from "../types/parkingTypes";

 export const updateAddresses = async (parkings: Parking[]) => {
    const updatedParkings = await Promise.all(
      parkings.map(async (parking) => {
        const address = await coordsToAddress(parking);
        console.log(address)
        const updatedParking: Parking = { ...parking, address };
        return updatedParking;
      })
    );
  
    return updatedParkings;
};


export const coordsToAddress = async (parking: Parking): Promise<string | null> => {
    const latitude = parking.latitude; // Reemplaza con la latitud real
    const longitude = parking.longitude; // Reemplaza con la longitud real
    const apiKey = "anJGEw6wvbEyM5IY8P_4hUzpvQCFB6LLuuXX86WTd-M"; // Reemplaza con tu clave de API de HERE
  
    try {
      const response = await axios.get(
        `https://geocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&apiKey=${apiKey}`
      );
  
      const address = response.data.items[0].address.label;
      return address;
    } catch (error) {
      // handleOpenAlert(()=>{}, Status.ERROR, 'Error al obtener la dirección', false);
      console.log('fallo here')
      return coordsToAddressOpenCage(parking);
    }
    
      
};


const coordsToAddressOpenCage = async (parking: Parking): Promise<string | null> => {
    const latitude = parking.latitude; // Reemplaza con la latitud real
    const longitude = parking.longitude; // Reemplaza con la longitud real
    const apiKey = "c013d8127681425397fb8821b71b8333"; // Reemplaza con tu clave de API de HERE
  
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
      );
  
      const address = response.data.results[0].formatted;;
      return address;
    } catch (error) {
      // handleOpenAlert(()=>{}, Status.ERROR, 'Error al obtener la dirección', false);
      console.log('fallo el nuevo')
      return null;
    }
    
      
};