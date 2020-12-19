import { Director } from './director.model';

export class BmNotice {
  userId: string;
  userName: string;
  clientId: string;
  compName: string;
  bmSrNo: string;
  bmDate: Date;
  isShortNotice: Boolean;
  bmTime: string;
  bmAddr: string;
  compLawMatters: string[];
  financeMatters: string[];
  regulatoryMatters: string[];
  businessMatters: string[]
  signPlace: string;
  signDate: Date;
  invitees:  [{
    id: string;
  }];
}
