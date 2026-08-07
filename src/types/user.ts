export interface ResponseFromEPFLApiSpecific {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  account: {
    username: string,
  }
  phones: {
    number: string;
  }[];
}

export interface ResponseFromEPFLApi {
  persons: ResponseFromEPFLApiSpecific[];
}