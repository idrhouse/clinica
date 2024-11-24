import React, { useContext } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import api from '../services/api';
import { Appointment } from '../models/Appointment';
import { AuthContext } from '../context/AuthContext';
import { FormData } from '../models/AppointmentForm';

interface AppointmentFormProps {
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  appointment?: Appointment;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ setAppointments, appointment }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const { user } = useContext(AuthContext);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!user) {
      console.error('User is not logged in');
      return;
    }

    console.log('User in form:', user); // Log the user object
    console.log('User ID:', user.id); // Log the user ID

    try {
      const appointmentData: Omit<Appointment, 'id' | 'status'> = {
        date: new Date(data.date).toISOString(),
        location: data.location,
        appointmentType: data.appointmentType,
        userId: user.id 
      };

      console.log('Appointment Data:', appointmentData); // Log the appointment data being sent

      const response = await api.createAppointment(appointmentData);

      console.log('API Response:', response); // Log the response from the API

      setAppointments(prev => [...prev, response]);
      reset();
    } catch (error) {
      console.error('Error creating appointment:', error); // Log any error that occurs
    }
  };

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    const hours = (`0${d.getHours()}`).slice(-2);
    const minutes = (`0${d.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Date</label>
        <input 
          {...register('date', { required: 'Date is required' })} 
          type="datetime-local" 
          defaultValue={appointment ? formatDate(appointment.date) : ''} 
        />
        {errors.date && <span>{errors.date.message}</span>}
      </div>
      
      <div>
        <label>Sucursal</label>
        <select {...register('location', { required: 'Location is required' })} defaultValue={appointment?.location}>
          <option value="">Selecciona una sucursal</option>
          <option value="Nicoya">Nicoya</option>
          <option value="Santa Cruz">Santa Cruz</option>
          <option value="Liberia">Liberia</option>
        </select>
        {errors.location && <span>{errors.location.message}</span>}
      </div>
      
      <div>
        <label>Tipo de Cita</label>
        <select {...register('appointmentType', { required: 'Appointment Type is required' })}>
          <option value="">Selecciona una sucursal</option>
          <option value="Medicina General">Medicina General</option>
          <option value="Odontologia">Odontologia</option>
          <option value="Pediatria">Pediatria</option>
          <option value="Neurologia">Neurologia</option>
        </select>
        {errors.appointmentType && <span>{errors.appointmentType.message}</span>}
      </div>

      <button type="submit">Reserve</button>
    </form>
  );
};

export default AppointmentForm;
