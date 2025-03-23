import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Calendar from './Calendar';
import { Header } from './Header';

export function Dashboard() {
  const { saveScheduleData, user } = useAuth();
  const isDirector = user?.email === "princeekpinse97@gmail.com";

  const fields = ['SIL 1', 'RIT 2', 'MRH 3', 'SIL 3', 'SSI 4'];
  const [selectedFields, setSelectedFields] = useState<string[]>(() => {
    const savedFields = localStorage.getItem('selectedFields');
    return savedFields ? JSON.parse(savedFields) : [];
  });

  return (
    <div>
      <Header
        onSave={isDirector ? saveScheduleData  : undefined}
        fields={fields}
        onFieldsChange={setSelectedFields}
      />
      <div>
        <Calendar />
      </div>
    </div>
  );
}