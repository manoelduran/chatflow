import { SignUpDTO } from '@/src/dtos/user/SignUpDTO';
import * as Yup from 'yup';

 const canCreateUser = async (data: SignUpDTO): Promise<void> => {
    const schema = Yup.object().shape({
        username: Yup.string().required('username required!'),
        email: Yup.string().email().required('email required!'),
        password: Yup.string().min(6).required('Password with minimum of 6 characters is required!'),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
}

export default canCreateUser;