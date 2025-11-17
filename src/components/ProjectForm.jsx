import { useState } from 'react';

const ProjectForm = ({ onSubmit, editProject, onCancel }) => {
  const [formData, setFormData] = useState({
    title: editProject?.title || '',
    description: editProject?.description || '',
    deadline: editProject?.deadline || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.deadline) {
      alert('Le titre et la deadline sont obligatoires');
      return;
    }

    onSubmit(formData);
    if (!editProject) {
      setFormData({ title: '', description: '', deadline: '' });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="project-form">
      <h3>{editProject ? 'Modifier le projet' : ' Nouveau Projet'}</h3>
      
      <div className="form-group">
        <label>Titre *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Titre du projet"
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description du projet..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Deadline *</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          min={today}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editProject ? 'Modifier' : ' Ajouter'}
        </button>
        {editProject && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default ProjectForm;