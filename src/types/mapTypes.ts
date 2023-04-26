export type searchArea = {
    "mLon": number,
    "mLat": number,
    "MLon": number,
    "MLat": number
};

export type currentPossition = { lat: number, lng: number };

declare global {
    interface Position {
      coords: {
        latitude: number;
        longitude: number;
      };
    }
  }