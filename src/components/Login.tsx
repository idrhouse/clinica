import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../models/Login';

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data);
      navigate('/appointments');
      console.log('Appointments');
    } catch (error) {
      console.error('Error loguendo', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} placeholder="Username" required />
      <input {...register('password')} type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
