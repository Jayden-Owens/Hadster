export const colors = {
  primary: '#30a763',
  white: '#fff',
  grey: '#ccc',
  red: 'red',
};
export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
export const categories = [
  {
    name: 'Auto',
    image: require('../Assets/Images/car.png'),
    value: 'Auto',
  },
  {
    name: 'Bikes',
    image: require('../Assets/Images/motorcycle.png'),
    value: 'Bikes',
  },
  {
    name: 'UTV/ATV',
    image: require('../Assets/Images/atv.png'),
    value: 'UTV/ATV',
  },
  {
    name: 'Watercraft',
    image: require('../Assets/Images/jet-ski.png'),
    value: 'Jetski',
  },
  {
    name: 'Snowmobile',
    image: require('../Assets/Images/snowmobile.png'),
    value: 'Snowmobile',
  },
  {
    name: 'Others',
    image: require('../Assets/Images/wheel.png'),
    value: 'Others',
  },
];

export const google_api_key = 'AIzaSyDZ3lYp0eQMuc3rTiTnfzNl8hiuk1eeg4c';
