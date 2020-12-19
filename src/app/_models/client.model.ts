import { Person } from './person.model';
import { Director } from './director.model';
import { CompLocation } from './compLocation.model';

export class Client {
  compName: string;
  addr1: string;
  addr2: string;
  city: string;
  state: string;
  pincode: string;
  phone1: string;
  phone2: string;
  compCat: string;
  compSubcat: string;
  compClass: string;
  dateInc: Date;
  email: string;
  website: string;
  PAN: string;
  GSTN: string;
  CIN: string;
  LLPIN: string;
  ROC: string;
  regNo: string;
  TAN: string;
  corpOffice: CompLocation;
  contacts: Person[];
  directors: Director[];
}
