import React from 'react';

import './Input.css';
type IdType = "title"|"image"|"content";
interface Props{
  id: IdType;
  control: string;
  label: string;
  valid: boolean;
  touched: boolean;
  onChange: (arg0:{id: IdType, value: string,files: FileList|null})=>void;
  onBlur: () =>void;

}

const filePicker: React.FC<Props> = props => (
  <div className="input">
    <label htmlFor={props.id}>{props.label}</label>
    <input
      className={[
        !props.valid ? 'invalid' : 'valid',
        props.touched ? 'touched' : 'untouched'
      ].join(' ')}
      type="file"
      id={props.id}
      onChange ={e => props.onChange({id:props.id, value:( e.target as HTMLInputElement )!.value, files: ( e.target as HTMLInputElement)!.files})}
      onBlur={props.onBlur}
    />
  </div>
);

export default filePicker;
