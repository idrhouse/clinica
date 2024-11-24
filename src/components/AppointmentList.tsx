import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import AppointmentForm from './AppointmentForm';
import AppointmentCard from './AppointmentCard';
import api from '../services/api';
import { Appointment } from '../models/Appointment';

const AppointmentList: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Logged in user in AppointmentList:', user);
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await api.getAppointments();
          console.log('Fetched appointments:', data); // Verificar qué se recibe aquí
          if (Array.isArray(data)) {
            setAppointments(data);
          } else {
            throw new Error('Los datos recibidos no son un array');
          }
        } catch (error) {
          console.error('Error fetching appointments', error);
        } finally {
          setLoading(false);
        }
      };
      fetchAppointments();
    }
  }, [user]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
      <p>Phone: {user?.phone}</p>
      <AppointmentForm setAppointments={setAppointments} />
      <div>
        {appointments.length === 0 ? (
          <div>No hay citas disponibles</div>
        ) : (
          appointments.map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} setAppointments={setAppointments} />
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
