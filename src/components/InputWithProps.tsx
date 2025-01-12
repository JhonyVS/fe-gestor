// src/components/InputWithProps.tsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface InputWithPropsProps {
  id: string;
  type: string;
  placeholder: string;
  label: string;
  icon: IconDefinition;
  pattern?: string;
  errorMessage?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputWithProps: React.FC<InputWithPropsProps> = ({ id, type, placeholder, label, icon, pattern, errorMessage, defaultValue, onChange }) => {
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (pattern) {
      const regex = new RegExp(pattern);
      setIsValid(regex.test(e.target.value));
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="mb-4 relative">
      <label htmlFor={id} className="block text-sm font-bold mb-2 text-white">{label}</label>
      <FontAwesomeIcon icon={icon} className="absolute top-10 left-3 text-gray-400" />
      <input
        className={`shadow appearance-none border ${isValid ? 'border-gray-600' : 'border-red-500'} rounded w-full py-2 pl-10 pr-3 text-white leading-tight bg-gray-600 focus:outline-none focus:shadow-outline`}
        id={id}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete="current-password" 
        onChange={handleChange}
      />
      {!isValid && errorMessage && <p className="text-red-500 text-xs italic">{errorMessage}</p>}
    </div>
  );
};

export default InputWithProps;
