import { useState, useEffect } from 'react';

function BirdForm({ onAddBird, onUpdateBird, onDeleteBird, editingBird, onCancelEdit }) {

  //formData: everything admin types or selects; setForData: the function to update it
  const [formData, setFormData] = useState({ 
    name: '',
    scientificname: '',
    description: '',
    image: ''
  });


  const [touched, setTouched] = useState({
    name: false,
    scientificname: false,
    description: false,
    image: false
  });

  const [submitted, setSubmitted] = useState(false);

  const [success, setSuccess] = useState(false);

  //If admin in Admin.jsx clicked on a bird, editingBird becomes true and this code prefills the form with the existing info of the bird; if not the case, then it'll be "null" meaning we are creating a new bird. Finally, we reset the form (regardless of editing or creating)
  useEffect(() => {
    if (editingBird) {
      setFormData({
        name: editingBird.name,
        scientificname: editingBird.scientificname,
        description: editingBird.description,
        image: editingBird.image || ''
      });
    } else {
      setFormData({ name: '', scientificname: '', description: '', image: '' });
    }
    setTouched({ name: false, scientificname: false, description: false, image: false });
    setSubmitted(false);
  }, [editingBird]);

  const errors = {
    name: formData.name.trim() === '' ? 'Por favor ingresa el nombre del ave.' : /\d/.test(formData.name) ? 'El nombre del ave no puede contener números!' : '',
    scientificname: formData.scientificname.trim() === '' ? 'Por favor ingresa el nombre científico del ave.' : /\d/.test(formData.scientificname) ? 'El nombre científico del ave no puede contener números!' : '',
    description: formData.description.trim() === '' ? 'Por favor ingresa la descripción!' : '',
    image: !formData.image || formData.image.trim() === '' ? 'Por favor ingresa la URL de la imagen!' : '' 
  };

  //"A field is valid if there is no error message for it"
  //errors[field] gets the erorr message for the specific field, so we check if the errors object has no message for that field.
  const isValid = (field) => !errors[field];

 //Return the correct CSS class for each field: nth, green or red
  const fieldClass = (field) => {
    const show = touched[field] || submitted;
    if (!show) return 'form-control';
    return isValid(field) ? 'form-control is-valid' : 'form-control is-invalid';
  };

   //... means we update only that specific property without erasing the others (the user can fill the form in any order)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //when user leaves a field, mark it as touched so its validation message can be shown
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };



  //when user submits form...
  const handleSubmit = (e) => {
    e.preventDefault();  //stop page reload
    setSubmitted(true);

    if (isValid('name') && isValid('scientificname') && isValid('description') && isValid('image')) {
      const birdData = {
        name: formData.name.trim(),
        scientificname: formData.scientificname.trim(),
        description: formData.description.trim(),
        image: formData.image.trim() 
      };

      if (editingBird) {
        onUpdateBird(editingBird.id, birdData);
        onCancelEdit();
      } else {
        onAddBird(birdData);
      }

      setFormData({ name: '', scientificname: '', description: '', image: '' });
      setTouched({ name: false, scientificname: false, description: false, image: false });
      setSubmitted(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleDelete = () => {
    if (editingBird && window.confirm(`¿Seguro que quieres eliminar "${editingBird.name}"?`)) {
      onDeleteBird(editingBird.id);
      onCancelEdit();
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {success && (
        <div className="alert alert-success" role="alert">
          Ave {editingBird ? 'actualizada' : 'guardada'} exitosamente!
        </div>
      )}

      {/* Name */}
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nombre del ave:</label>
        <input
          type="text"
          className={fieldClass('name')}
          id="name"
          name="name"
          placeholder="Ingrese nombre del ave"
          value={formData.name}
          onChange={handleInputChange}
          onBlur={handleBlur}
          required
        />
        {(touched.name || submitted) && errors.name && (
          <div className="invalid-feedback d-block">{errors.name}</div>
        )}
      </div>

      {/* Scientific Name */}
      <div className="mb-3">
        <label htmlFor="scientificname" className="form-label">Nombre Científico del ave:</label>
        <input
          type="text"
          className={fieldClass('scientificname')}
          id="scientificname"
          name="scientificname"
          placeholder="Ingrese nombre científico del ave"
          value={formData.scientificname}
          onChange={handleInputChange}
          onBlur={handleBlur}
          required
        />
        {(touched.scientificname || submitted) && errors.scientificname && (
          <div className="invalid-feedback d-block">{errors.scientificname}</div>
        )}
      </div>

      {/* Description */}
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Descripción:</label>
        <textarea
          className={fieldClass('description')}
          id="description"
          name="description"
          rows="5"
          placeholder="Ingrese detalles del ave"
          value={formData.description}
          onChange={handleInputChange}
          onBlur={handleBlur}
          required
        />
        {(touched.description || submitted) && errors.description && (
          <div className="invalid-feedback d-block">{errors.description}</div>
        )}
      </div>


      {/* Image URL input - CHANGED FROM FILE UPLOAD */}
      <div className="mb-3">
        <label htmlFor="image" className="form-label">URL de la imagen:</label>
        <input
          type="url"
          className={fieldClass('image')}
          id="image"
          name="image"
          placeholder="https://ejemplo.com/imagen.jpg"
          value={formData.image || ''}  // Changed: use empty string if null
          onChange={handleInputChange}  // Changed:use text input handler
          onBlur={handleBlur}
          required
        />
        {(touched.image || submitted) && errors.image && (
          <div className="invalid-feedback d-block">{errors.image}</div>
        )}
        <small className="text-muted">
          Ingresa la URL completa de la imagen (ej: desde Wikimedia Commons)
        </small>
        
        {/* Image preview */}
        {formData.image && formData.image.startsWith('http') && (
          <div className="mt-3">
            <p className="text-muted">Vista previa:</p>
            <img 
              src={formData.image} 
              alt="Preview" 
              style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }}
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="d-flex">
        <button type="submit" className="btn btn-primary">
          {editingBird ? 'Actualizar Ave' : 'Guardar Ave'}
        </button>
        {editingBird && (
          <>
            <button type="button" className="btn btn-secondary ms-2" onClick={onCancelEdit}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger ms-2" onClick={handleDelete}>
              Eliminar
            </button>
          </>
        )}
      </div>
    </form>
  );
}

export default BirdForm;
