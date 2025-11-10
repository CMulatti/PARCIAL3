import { useState } from 'react';

function BirdForm({ onAddBird }) {
  ///we define a state in which formData stores everything the user types or selects, and setFormData which is the function that updates it
  // at first, name and description are empty strings and image is null
  const [formData, setFormData] = useState({ 
    name: '',
    description: '',
    image: null
  });

  //here we hold the preview of the uploaded image
  const [imagePreview, setImagePreview] = useState(null);

  //we track the touched fields. Touched means the user has clicked on the field and then left it (blurred it)
  //this will help us decide when to show our validation messages, as these depend on the interaction.
  const [touched, setTouched] = useState({
    name: false,
    description: false,
    image: false
  }); 

  //Track submission & success
  //we are initialising a memory slot, submitted is the current value, setSubmitted is a function we can call later to change it.
  // we're saying "Please remember a set of data called submitted and start it off with the value 'false' (it's like a light switch which is off until the user turns it on by submitting it)
  const [submitted, setSubmitted] = useState(false); 
  const [success, setSuccess] = useState(false);

  //we define all validation errors in one single object
  const errors = {
    name: formData.name.trim() === '' ? 'Por favor ingresa el nombre del ave.': /\d/.test(formData.name) ? 'El nombre del ave no puede contener números!' : '',
    description: formData.description.trim() === '' ? 'Por favor ingresa la descripción!' : '',
    image: !imagePreview ? 'Por favor selecciona una imagen!' : ''
  };

  //"A field is valid if there is no error message for it"
  //errors[field] gets the erorr message for the specific field, so we check if the errors object has no message for that field.
  const isValid = (field) => !errors[field];

  //Return the correct CSS class for each field
  //we add Bootstrap class depending on field state (red or green border)
  const fieldClass = (field) => {
    const show = touched[field] || submitted;
    if (!show) return 'form-control';
    return isValid(field) ? 'form-control is-valid' : 'form-control is-invalid';
  };

  //... means we update only that specific property without erasing the others (the user can fill the form in any order)
  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  //when user leaves a field, mark it as touched so its validation message can be shown
  const handleBlur = (e) => {
    const name = e.target.name;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  //when user selects and image, get the selected file, save it in the form data, use FileReader to read it as base64, once reading is done, display it.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        setTouched(prev => ({ ...prev, image: true })); //mark image as touched
      };
      reader.readAsDataURL(file);
    }
  };

  //when user submits form...
  const handleSubmit = (e) => {
    e.preventDefault(); //stop page reload
    setSubmitted(true); 
    
    // Check if all fields are valid
    if (isValid('name') && isValid('description') && isValid('image')) {
      const newBird = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: imagePreview
      };

      onAddBird(newBird); //here we send bird to parent component

      // Reset form
      setFormData({ name: '', description: '', image: null });
      setImagePreview(null);
      setTouched({ name: false, description: false, image: false }); //Reset touched
      setSubmitted(false); //Reset submitted
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate> {/* noValidate to tell the browser not to show its default validation messages as we are handling the validations ourselves. */}
      
      {success && (
        <div className="alert alert-success" role="alert">
          Ave guardada exitosamente! Ahora aparecerá en la página principal.
        </div>
      )}

      {/* Name input*/}
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
        {/*if the field 'name' was touched OR the form was submitted, AND there's an error message for that field, then show the div with the error text*/}
        {(touched.name || submitted) && errors.name && (
          <div className="invalid-feedback d-block">{errors.name}</div>
        )}
      </div>

      {/*Description textarea */}
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
        {/*Show error for message*/}
        {(touched.description || submitted) && errors.description && (
          <div className="invalid-feedback d-block">{errors.description}</div>
        )}
      </div>

      {/*image input */}
      <div className="mb-3">
        <label htmlFor="image" className="form-label">Imagen del ave:</label>
        <input
          type="file"
          className={fieldClass('image')} 
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        {/*Show error for image*/}
        {(touched.image || submitted) && errors.image && (
          <div className="invalid-feedback d-block">{errors.image}</div>
        )}

        {imagePreview && (
          <div className="mt-3">
            <p className="text-muted">Vista previa:</p>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '5px' }}
            />
          </div>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Guardar Ave
      </button>
    </form>
  );
}
export default BirdForm;