import countries from "world-countries";

const formattedCountries = countries.map((country) => ({
  value: country.cca2, //code name of country, ex: Australia => AT
  label: country.name.common, //name common in English
  flag: country.flag, //emoji flaf
  latlng: country.latlng, //latitude and longitude
  region: country.region, //region
}));

const useCountries = () => {
  const getAll = () => formattedCountries;

  //find country with cca2 value passed into this func
  const getByValue = (cca2_value: string) => {
    return formattedCountries.find((country) => country.value === cca2_value);
  };

  return { getAll, getByValue };
};

export default useCountries;
