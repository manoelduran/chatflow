import * as Yup from 'yup';

interface formCredentials {
  text: string;
  }

export const canCreateChat = async (data: formCredentials): Promise<void> => {
    const schema = Yup.object().shape({
        text: Yup.string().required('chat name is required!'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
}