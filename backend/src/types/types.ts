export interface StudentRegistrationInput {
	email: string;
	password: string;
	name: string;
	lastName: string;
	indexNumber: string;
	yearOfEnrollment: number;
	role: string;
	image: string;
	username: string;
}
export interface CompanyRegistrationInput {
	username: string;
	email: string;
	password: string;
	image?: string | undefined;
	companyName: string;
	phoneNumber: string;
}
