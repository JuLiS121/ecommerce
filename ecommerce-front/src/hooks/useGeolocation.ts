import { useState, useEffect } from 'react';

interface Location {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  streetName: string | null;
  country: string | null;
}

export const useGeolocation = (): {
  location: Location | null;
  error: string | null;
} => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDSJ_0pzmXDvo0PX9b2SeixQF6ts9Kx_ak`
              );
              if (!response.ok) {
                throw new Error('Reverse geocoding request failed');
              }
              const data = await response.json();
              const addressComponents = data.results[0].address_components;
              const city = addressComponents.find((component: any) =>
                component.types.includes('locality')
              )?.long_name;
              const state = addressComponents.find((component: any) =>
                component.types.includes('administrative_area_level_1')
              )?.short_name;
              const zipCode = addressComponents.find((component: any) =>
                component.types.includes('postal_code')
              )?.long_name;
              const streetName =
                data.results[0]?.address_components?.find(
                  (component: any) =>
                    component.types.includes('route') ||
                    component.types.includes('street_address')
                )?.long_name || 'Unkwown';

              const country = addressComponents.find((component: any) =>
                component.types.includes('country')
              )?.long_name;
              setLocation({
                latitude,
                longitude,
                city,
                state,
                zipCode,
                streetName,
                country,
              });
            } catch (error) {
              setError('Failed to fetch location information');
            }
          },
          (error) => {
            setError(error.message);
          }
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    };

    getLocation();
  }, []);

  return { location, error };
};
