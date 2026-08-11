export interface Person {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  isaccredited: boolean;
  account: {
    username: string;
  };
  phones?: {
    number: string;
  }[];
}

export interface PersonsSearchResponse {
  persons: Person[];
}
