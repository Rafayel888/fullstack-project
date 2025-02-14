export class FullUserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;

  constructor(model: any) {
    this.id = model.id;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.email = model.email;
    this.birthDate = model.birthDate;
    this.profilePicture = model.profilePicture;
    this.createdAt = model.createdAt;
    this.updatedAt = model.updatedAt;
  }
}
