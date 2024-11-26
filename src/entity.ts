export type Guardian = {
  id?: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
};

export type User = {
  id?: string;
  name: string;
  email: string;
  birthdate: Date;
  gender: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  guardianId?: string;
};
