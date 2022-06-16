import React from 'react';

import './Input.css';

type Props={
  label?: string;
  id: string;
  control: "input";
  valid?: boolean;
  touched?: boolean;
  type?: "text"|"password"|"email";
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (prop:InputChangeProps)=>void;
  onBlur?: () =>void;
  rows?: number;
}|
{
  label?: string;
  id: string;
  control: 'textarea';
  valid?: boolean;
  touched?: boolean;
  type?: "text"|"password"|"email";
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (prop:TextareaChangeProps)=>void;
  onBlur?: () =>void;
  rows?: number;
}
export interface  InputChangeProps{
  id: string;
  value: string;
  files: FileList|null;
}
export interface  TextareaChangeProps{
  id: string;
  value: string;

}

const input : React.FC<Props> = props => (
  <div className="input">
    {props.label && <label htmlFor={props.id}>{props.label}</label>}
    {props.control === 'input' && (
      <input
        className={[
          !props.valid ? 'invalid' : 'valid',
          props.touched ? 'touched' : 'untouched'
        ].join(' ')}
        type={props.type}
        id={props.id}
        required={props.required}
        value={props.value}
        placeholder={props.placeholder}
        onChange={e => props.onChange({id:props.id,value: e.target.value,files: e.target.files})}
        onBlur={props.onBlur}
      />
    )}
    {props.control === 'textarea' && (
      <textarea
        className={[
          !props.valid ? 'invalid' : 'valid',
          props.touched ? 'touched' : 'untouched'
        ].join(' ')}
        id={props.id}
        rows={props.rows}
        required={props.required}
        value={props.value}
        onChange={e => props.onChange( { id: props.id, value: e.target.value})}
        onBlur={props.onBlur}
      />
    )}
  </div>
);

export default input;
