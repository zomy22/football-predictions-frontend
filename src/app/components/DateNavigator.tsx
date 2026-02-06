// webapp/src/app/components/DateNavigator.tsx
import React from 'react';

interface DateNavigatorProps {
  selectedDate: string; // YYYY-MM-DD format
  onDateChange: (date: string) => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({ selectedDate, onDateChange }) => {
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(event.target.value);
  };

  return (
    <div className="flex justify-center space-x-4 mb-6">
      <input
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        className="p-2 border rounded-md"
      />
    </div>
  );
};

export default DateNavigator;
