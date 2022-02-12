const URL = 'http://localhost:3000/data';
let flats = [];
export const getAssociation = () => fetch(URL)
  .then(response => {
    if (!response.ok) {
      throw new Error('No response from server');
    }
    return response.json();
  })
  .then(result => {
    flats = result;
    return flats;
  });
