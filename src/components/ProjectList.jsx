import { useState } from 'react';
import PomodoroTimer from './PomodoroTimer';

const ProjectList = ({ 
  projects, 
  onStatusUpdate, 
  onDelete, 
  onEdit,
  onTimeUpdate,
  activeTimerProject,
  setActiveTimerProject 
}) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [editingProject, setEditingProject] = useState(null);

  const filteredProjects = projects.filter(project => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.deadline) - new Date(b.deadline);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'timeSpent') {
      return b.timeSpent - a.timeSpent;
    } else if (sortBy === 'createdAt') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  const handleEdit = (project) => {
    setEditingProject(project);
  };

  const handleSaveEdit = (projectData) => {
    onEdit(editingProject.id, projectData);
    setEditingProject(null);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#dc3545';
      case 'doing': return '#ffc107';
      case 'done': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'todo': return '📝 À faire';
      case 'doing': return '⚡ En cours';
      case 'done': return '✅ Terminé';
      default: return status;
    }
  };

  const formatTimeSpent = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const isOverdue = (deadline) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="project-list">
      <div className="project-controls">
        <div className="control-group">
          <label>🔍 Filtrer par statut</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="todo">À faire</option>
            <option value="doing">En cours</option>
            <option value="done">Terminé</option>
          </select>
        </div>

        <div className="control-group">
          <label>Rechercher</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Titre ou description..."
          />
        </div>

        <div className="control-group">
          <label>Trier par</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="deadline">Date limite</option>
            <option value="title">Titre</option>
            <option value="timeSpent">Temps passé</option>
            <option value="createdAt">Date de création</option>
          </select>
        </div>

        <div className="project-count">
          {sortedProjects.length} projet(s)
        </div>
      </div>

      <div className="projects-grid">
        {sortedProjects.map(project => (
          <div key={project.id} className="project-card">
            {editingProject?.id === project.id ? (
              <ProjectForm
                editProject={editingProject}
                onSubmit={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                <div className="project-header">
                  <div className="project-info">
                    <h4 className="project-title">{project.title}</h4>
                    <p className="project-description">{project.description}</p>
                    
                    <div className="project-meta">
                      <span className={`deadline ${isOverdue(project.deadline) ? 'overdue' : ''}`}>
                        {new Date(project.deadline).toLocaleDateString('fr-FR')}
                        {isOverdue(project.deadline) && ' ⚠️ En retard'}
                      </span>
                      <span className="time-spent">
                         {formatTimeSpent(project.timeSpent)}
                      </span>
                      <span 
                        className="project-status"
                        style={{ color: getStatusColor(project.status) }}
                      >
                        {getStatusText(project.status)}
                      </span>
                    </div>
                  </div>

                  <div className="project-actions">
                    <select
                      value={project.status}
                      onChange={(e) => onStatusUpdate(project.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="todo">À faire</option>
                      <option value="doing">En cours</option>
                      <option value="done">Terminé</option>
                    </select>
                    
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(project)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        
                      </button>
                      <button
                        onClick={() => setActiveTimerProject(
                          activeTimerProject === project.id ? null : project.id
                        )}
                        className={`btn btn-sm ${
                          activeTimerProject === project.id ? 'btn-warning' : 'btn-outline-warning'
                        }`}
                      >
                        
                      </button>
                      <button
                        onClick={() => onDelete(project.id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        
                      </button>
                    </div>
                  </div>
                </div>

                {activeTimerProject === project.id && (
                  <PomodoroTimer
                    projectId={project.id}
                    onTimeUpdate={onTimeUpdate}
                    isActive={activeTimerProject === project.id}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {sortedProjects.length === 0 && (
        <div className="empty-state">
          {projects.length === 0 ? 'Aucun projet créé pour le moment' : '🔍 Aucun projet trouvé'}
        </div>
      )}
    </div>
  );
};

export default ProjectList;