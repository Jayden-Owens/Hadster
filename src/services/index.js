import axios from "axios"
import { google_api_key } from "../Constant"

export const getLocation = ({ latitude, longitude }) => {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${google_api_key}`)
}

export const getLocationfromAddress = ( address ) => {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${google_api_key}`)
}


