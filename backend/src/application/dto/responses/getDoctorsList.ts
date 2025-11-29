interface singleDoctor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  specialization: string;
}

export interface GetDoctorsList {
  total: number;
  doctors: singleDoctor[];
}
