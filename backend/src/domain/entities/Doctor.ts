import { User } from "./User";

export class Doctor extends User {
  private speciality: string;
  private isMedicalSupervisor: boolean;
  private specialisation: string;
  private salary: number;
  constructor(
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    speciality: string
  ) {
    super(id, email, firstName, lastName, "doctor");
    this.speciality = speciality;
    this.isMedicalSupervisor = false;
    this.specialisation = "general";
  }
  setIsMedicalSupervisor(isMedicalSupervisor: boolean) {
    this.isMedicalSupervisor = isMedicalSupervisor;
  }
  IsMedicalSupervisor(): boolean {
    return this.isMedicalSupervisor;
  }
  setSpecialisation(specialisation: string) {
    this.specialisation = specialisation;
  }
  getSpecialisation(): string {
    return this.specialisation;
  }
  setSpeciality(speciality: string) {
    this.speciality = speciality;
  }
  getSpeciality(): string {
    return this.speciality;
  }
  getSalary(): number {
    return this.salary;
  }
  setSalary(salary: number) {
    this.salary = salary;
  }
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      speciality: this.speciality,
      isMedicalSupervisor: this.isMedicalSupervisor,
      specialisation: this.specialisation,
    };
  }
}
