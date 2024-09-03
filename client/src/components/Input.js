import React from 'react';

export default function Input({ name, type, value, setValue, required }) {
    return (<div className="generalInput">
        <label>{name}: </label>
        <input type={type} value={value} onChange={(e) => setValue(e.target.value)} required={required} />
    </div>);
}
