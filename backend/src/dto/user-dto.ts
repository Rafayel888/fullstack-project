export class UserDto {
  id: number;
  firstName: string;
  lastName: string;

  constructor(model: any) {
    this.id = model.id;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
  }
}
