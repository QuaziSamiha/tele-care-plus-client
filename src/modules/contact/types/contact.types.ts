export interface IContactInfo {
  id: number;
  hotline: string;
  lineId?: string;
  email: string;
  heading: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IContactMessage {
  id: number;
  name: string;
  phone?: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface IUpdateContactInfoForm {
  hotline: string;
  lineId?: string;
  email: string;
  heading: string;
  description: string;
}
