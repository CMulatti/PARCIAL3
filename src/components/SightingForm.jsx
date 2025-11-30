import { useState } from 'react';

// Chilean regions for the dropdown
const CHILEAN_REGIONS = [
  'Arica y Parinacota',
  'Tarapacá',
  'Antofagasta',
  'Atacama',
  'Coquimbo',
  'Valparaíso',
  'Metropolitana de Santiago',
  'O\'Higgins',
  'Maule',
  'Ñuble',
  'Biobío',
  'La Araucanía',
  'Los Ríos',
  'Los Lagos',
  'Aysén',
  'Magallanes'
];

//All form fields
function SightingForm({ birdId, onAddSighting }) {
  const [formData, setFormData] = useState({
    sightingDate: '',
    region: '',
    locationName: '',
    comments: '',
    photo: null
  });

  const [photoPreview, setPhotoPreview] = useState(null); //store base64 pic preview
  const [touched, setTouched] = useState({}); //used to decide green/red validation styles
  const [submitted, setSubmitted] = useState(false); //to show error message on required fields
  const [success, setSuccess] = useState(false); //to show temporary 3" success message 'avistamirnto registrado exitosamente!'

  // Validation errors, if empty store error message; if filled, store empty string
  const errors = {
    sightingDate: formData.sightingDate === '' ? 'Por favor ingresa la fecha del avistamiento.' : '',
    region: formData.region === '' ? 'Por favor selecciona una región.' : ''
  };

  //if the error message is empty, then the field is valid
  const isValid = (field) => !errors[field];

  //user doesnt see validation styles until he's touched the field or submitted: CSS for regular/valid/invalid input.
  const fieldClass = (field) => {
    const show = touched[field] || submitted;
    if (!show) return 'form-control';
    return isValid(field) ? 'form-control is-valid' : 'form-control is-invalid';
  };

  //handle when user types in a field, example name becomes 'locationName' and value 'mi terraza'
  //we update only one field in formData, as user can fill the form in any order
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //when leaving a field, mark it as touched so its validation message can be shown
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

   //when user selects and image, get the selected file, save it in the form data, use FileReader to read it as base64, once reading is done, display it.
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //when user submits form...
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);


    // Check if all fields are valid
    if (isValid('sightingDate') && isValid('region')) {
      const newSighting = {
        birdId: Number(birdId),
        sightingDate: formData.sightingDate,
        region: formData.region,
        locationName: formData.locationName.trim(),
        comments: formData.comments.trim(),
        photo: photoPreview // Store base64 image
      };

      onAddSighting(newSighting); //here we send sightning to parent component

      // Reset form
      setFormData({
        sightingDate: '',
        region: '',
        locationName: '',
        comments: '',
        photo: null
      });
      setPhotoPreview(null);
      setTouched({});
      setSubmitted(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  

  return (
    <div className="alert alert-info mb-4">
      <div className="card-body">
        <h5 className="card-title"><strong>Registra tu avistamiento</strong></h5>
        
        {success && (
          <div className="alert alert-success" role="alert">
            ¡Avistamiento registrado exitosamente!
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Sighting Date */}
          <div className="mb-3">
            <label htmlFor="sightingDate" className="form-label">
              Fecha del avistamiento: <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className={fieldClass('sightingDate')}
              id="sightingDate"
              name="sightingDate"
              value={formData.sightingDate}
              onChange={handleInputChange}
              onBlur={handleBlur}
              max={new Date().toISOString().split('T')[0]} // Can't be future date
              required
            />
            {(touched.sightingDate || submitted) && errors.sightingDate && (
              <div className="invalid-feedback d-block">{errors.sightingDate}</div>
            )}
          </div>

          {/* Region */}
          <div className="mb-3">
            <label htmlFor="region" className="form-label">
              Región: <span className="text-danger">*</span>
            </label>
            <select
              className={fieldClass('region')}
              id="region"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              onBlur={handleBlur}
              required
            >
              <option value="">Selecciona una región</option>
              {CHILEAN_REGIONS.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
            {(touched.region || submitted) && errors.region && (
              <div className="invalid-feedback d-block">{errors.region}</div>
            )}
          </div>

          {/* Location Name (Optional) */}
          <div className="mb-3">
            <label htmlFor="locationName" className="form-label">
              Nombre del lugar (opcional)
            </label>
            <input
              type="text"
              className="form-control"
              id="locationName"
              name="locationName"
              placeholder="Ej: Parque Metropolitano"
              value={formData.locationName}
              onChange={handleInputChange}
            />
            <small className="text-muted">Puedes especificar un parque, reserva, etc.</small>
          </div>

          {/* Comments (Optional) */}
          <div className="mb-3">
            <label htmlFor="comments" className="form-label">
              Comentarios (opcional)
            </label>
            <textarea
              className="form-control"
              id="comments"
              name="comments"
              rows="3"
              placeholder="Describe tu avistamiento..."
              value={formData.comments}
              onChange={handleInputChange}
            />
          </div>

          {/* Photo (Optional) */}
          <div className="mb-3">
            <label htmlFor="photo" className="form-label">
              Foto (opcional)
            </label>
            <input
              type="file"
              className="form-control"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {photoPreview && (
              <div className="mt-3">
                <p className="text-muted">Vista previa:</p>
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }}
                />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Publicar avistamiento
          </button>
        </form>
      </div>
    </div>
  );
}

export default SightingForm;