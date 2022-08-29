export type IDiagnosisRequest = {
  symptoms: {
    symptoms: string;
    gender: string;
    year_of_birth: number;
  };
  userId: string;
};
