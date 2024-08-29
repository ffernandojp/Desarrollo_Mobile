const APIKEY = "AF5EE303-6287-4F19-8255-C8E9F0AECB19"


// Fetching data from the API
export const fetchApi = async () => {
  try {
    const response = await fetch(
      `https://rest.coinapi.io/v1/exchanges?apikey=${APIKEY}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};