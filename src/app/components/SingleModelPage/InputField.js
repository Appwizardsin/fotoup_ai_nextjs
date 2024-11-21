'use client';

import React, { useState } from 'react';
import {
  ImageInput,
  TextInput,
  NumberInput,
  BooleanInput,
  PreDefinedImagesInput,
  VideoInput,
  AudioInput
} from './InputComponents';

const InputField = ({ field, value, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  switch (field.type) {
    case "image":
      return <ImageInput 
        field={field} 
        value={value} 
        onChange={onChange} 
        isUploading={isUploading}
        setIsUploading={setIsUploading}
      />;
    case "text":
      return <TextInput field={field} value={value} onChange={onChange} />;
    case "number":
      return <NumberInput field={field} value={value} onChange={onChange} />;
    case "boolean":
      return <BooleanInput field={field} value={value} onChange={onChange} />;
    case "preDefinedImages":
      return <PreDefinedImagesInput field={field} value={value} onChange={onChange} />;
    case "video":
      return <VideoInput field={field} value={value} onChange={onChange} />;
    case "audio":
      return <AudioInput field={field} value={value} onChange={onChange} />;
    default:
      return null;
  }
};

export default InputField; 