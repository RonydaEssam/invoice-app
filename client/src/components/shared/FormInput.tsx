import type React from "react";
import './FormInput.css';

interface FormInputProps {
    value: string | number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    label: string,
    type: 'text' | 'email' | 'number',
    name: string
}

export function FormInput({ value, onChange, label, type, name }: FormInputProps) {
    return (
        <div className="form-field">
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                name={name}
                value={value}
                type={type}
                min={type === 'number' ? 0 : undefined}
                onChange={onChange}
            />
        </div>
    )
}
