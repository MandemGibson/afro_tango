export type User = {
  id?: string;
  firstName?: string | null | undefined;
  otherName?: string | null | undefined;
  lastName?: string | null | undefined;
  username?: string | null | undefined;
  email: string;
  password?: string;
  bio?: string | null | undefined;
  phoneNumber?: string | null | undefined;
  websiteLink?: string | null | undefined;
  facebookLink?: string | null | undefined;
  instagramLink?: string | null | undefined;
  snapChatLink?: string | null | undefined;
  whatsAppLink?: string | null | undefined;
  profilePic?: string | null | undefined;
  coverPic?: string | null | undefined;
  gender?: string | null | undefined;
  nationality?: string | null | undefined;
  dob?: Date | null | undefined;
  createdAt?: string | Date | undefined;
  updatedAt?: string | Date | undefined;
};
