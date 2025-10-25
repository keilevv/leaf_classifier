export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    [key: string]: any;
  };
  query: string | any;
  file?: any; // Multer file object
}

export interface DefaultSpecies {
  commonNameEn: string;
  commonNameEs: string;
  scientificName: string;
}
