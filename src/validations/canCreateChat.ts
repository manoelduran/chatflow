import * as Yup from 'yup';
import { formCredentials } from '../pages/create-chat';


const canCreateChat = async (data: formCredentials): Promise<void> => {
    const schema = Yup.object().shape({
        text: Yup.string().max(11).required('chat name is required!'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
}

export default canCreateChat;