import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const url = 'https://api.thedogapi.com/v1/images/search?has_breeds=1&api_key=live_ucrOhucw4cxPfgTzX8bZoD10PNayL1VfNSVwZ6i0V4VHSmZjYUISdV3OeA51E92O';

  const [dogData, setDogData] = useState(null);
  const [banList, setBanList] = useState([]);

  const [breedName, setBreedName] = useState(''); // New state for breed name
  const [lifeSpan, setLifeSpan] = useState('');
  const [temperament, setTemperament] = useState(''); 
  const [weight, setWeight] = useState('');


  const fetchDogData = async () => {
    try {

      let validImage = null;
      while (validImage == null) {
        const response = await fetch(url);

        const data = await response.json();
        const randomImage = data[0]; // Get the first image

        const fbreedName = randomImage.breeds[0]?.name;

        const ftemperament = randomImage.breeds[0]?.temperament;
        const temperamentArray = ftemperament.split(',').map(item => item.trim());
        const firstTemperament = temperamentArray[0];

        const flifeSpan = randomImage.breeds[0]?.life_span;

        const fweight = randomImage.breeds[0]?.weight.metric;

        if (!banList.includes(fbreedName) && !banList.includes(firstTemperament) && !banList.includes(flifeSpan) && !banList.includes(fweight)) {
          validImage = randomImage;
          setBreedName(fbreedName || 'Unknown Breed');
          setTemperament(firstTemperament || 'Unknown Temperament');
          setLifeSpan(flifeSpan || 'Unknown Life Span');
          setWeight(fweight || 'Unknown Weight');
        }
      }

      setDogData(validImage);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBanAttribute = (attribute) => {
    setBanList((prevBanList) => [...prevBanList, attribute]);
  };

  const handleRemoveBan = (attribute) => {
    setBanList((prevBanList) => prevBanList.filter((item) => item !== attribute));
  };

  const handleFetchNewImage = () => {
    fetchDogData();
  };

  useEffect(() => {
    fetchDogData();
  }, []);
      
      

  return (
    <>
      <div className='title'>
        <h1>
        🐶 Doggo Playground 🐶
        </h1>
        <h3>
          Discover Beautiful Dogs! Ban Attributes To Find Your Match!
        </h3>

      </div>
      <br></br>
      <div className='card'>
        {dogData ? (
            <img src={dogData.url} alt="Dog" />
          ) : (
            <p>Loading...</p> // Display a loading message or placeholder while fetching
          )}

          <br></br>
          <button id='nextImg' onClick={handleFetchNewImage}>NEXT DOG 🐕 🐕 🐕</button>
          <br></br>
          <div className='button-layout'>
          <button id='attribute' onClick={() => handleBanAttribute(breedName)}>{breedName}</button>
          <button id='attribute' onClick={() => handleBanAttribute(lifeSpan)}>{lifeSpan}</button>
          <button id='attribute' onClick={() => handleBanAttribute(temperament)}>{temperament}</button>
          <button id='attribute' onClick={() => handleBanAttribute(weight)}>{weight} kg</button>
          </div>
      </div>

      <div className='ban-list'>
          <h3>Banned Attributes</h3>
          {banList.length > 0 ? (
            banList.map((attribute, index) => (
              <button key={index} onClick={() => handleRemoveBan(attribute)}>
                {attribute} ❌
              </button>
            ))
          ) : (
            <p>No banned attributes yet...</p>
          )}
        </div>
      
    </>
  )
}

export default App
