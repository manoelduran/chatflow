import * as Yup from 'yup';

interface FormCredentials {
  text: string;
}

export const canCreateMessage = async (data: FormCredentials): Promise<void> => {
    const schema = Yup.object().shape({
        text: Yup.string().required('A message is required!'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
}