import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { Appointment } from '../models/Appointment';

interface AppointmentCardProps {
  appointment: Appointment;
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, setAppointments }) => {
  const { user } = useContext(AuthContext);

  const handleDelete = async () => {
    if (!user) {
      alert('User is not defined.');
      return;
    }
    
    if (user.role !== 'ADMIN') {
      alert('No está autorizado para eliminar la cita.');
      return;
    }
    
    try {
      await api.deleteAppointment(appointment.id.toString());
      setAppointments(prevAppointments => prevAppointments.filter(appt => appt.id !== appointment.id));
    } catch (error: any) {
      console.error('Error al eliminar la cita:', error.message);
      alert('Se produjo un error al eliminar la cita. Por favor, inténtelo de nuevo más tarde.');
    }
  };



  const handleCancel = async () => {
  if (!user) {
    alert('User is not defined.');
    console.log('User:', user);
    return;
  }

  try {
    await api.cancelAppointment(appointment.id.toString());
    setAppointments(prevAppointments =>
      prevAppointments.map(appt => (appt.id === appointment.id ? { ...appt, status: 'CANCELADA' } : appt))
    );
  } catch (error: any) {
    console.error('Error al cancelar la cita:', error.message);
    alert('Se produjo un error al cancelar la cita. Por favor, inténtelo de nuevo más tarde.');
  }
};

  
  
  

  return (
    <div>
      <p>Date: {appointment.date}</p>
      <p>Status: {appointment.status}</p>
      <button onClick={handleCancel}>Cancel</button>
      {user && user.role === 'ADMIN' && <button onClick={handleDelete}>Delete</button>}
    </div>
  );
};

export default AppointmentCard;
