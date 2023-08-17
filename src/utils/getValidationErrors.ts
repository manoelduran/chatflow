import { ValidationError } from 'yup';

interface Errors {
  [key: string]: string;
}

export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = [] as any;

  err.inner.forEach(error => {
    console.log('error 31231', error)
    validationErrors[String(error.path)] = error.message;
  });

  return validationErrors;
}
