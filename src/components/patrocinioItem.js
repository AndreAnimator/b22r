import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const PatrocinioItem = ({patrocinio, onRemove, onUpdate }) => {
  const handleChange = (e) => {
    patrocinio.name = e.target.value;
  };

  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        defaultValue={patrocinio.name}
        onChange={handleChange}
      />
      <FontAwesomeIcon icon={faTrash} onClick={onRemove} className="btn btn-danger mt-2">Remover</FontAwesomeIcon>
    </div>
  );
};

export default PatrocinioItem;
