import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { RegisterFormInputs } from '../models/Register';

const RegisterForm: React.FC = () => {
  const { register, handleSubmit } = useForm<RegisterFormInputs>();
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      await api.register(data);
      navigate('/login');
    } catch (error) {
      console.error('Error registrando', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} placeholder="Username" required />
      <input {...register('password')} type="password" placeholder="Password" required />
      <input {...register('name')} placeholder="Name" required />
      <input {...register('email')} placeholder="Email" required />
      <input {...register('phone')} placeholder="Phone" required />      
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
