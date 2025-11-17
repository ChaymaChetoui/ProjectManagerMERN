import { useReducer, useEffect, useState } from 'react';
import { projectReducer, initialState } from './reducers/projectReducer';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import ProjectStats from './components/ProjectStats';
import './index.css';

function App() {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const [activeTimerProject, setActiveTimerProject] = useState(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    if (savedProjects) {
      try {
        const parsedProjects = JSON.parse(savedProjects);
        parsedProjects.forEach(project => {
          dispatch({
            type: 'ADD_PROJECT',
            payload: project
          });
        });
      } catch (error) {
        console.error('Error loading projects from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(state.projects));
  }, [state.projects]);

  const addProject = (projectData) => {
    dispatch({
      type: 'ADD_PROJECT',
      payload: projectData
    });
  };

  const updateProjectStatus = (id, status) => {
    dispatch({
      type: 'UPDATE_PROJECT_STATUS',
      payload: { id, status }
    });
  };

  const deleteProject = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      dispatch({
        type: 'DELETE_PROJECT',
        payload: { id }
      });
      if (activeTimerProject === id) {
        setActiveTimerProject(null);
      }
    }
  };

  const updateTimeSpent = (projectId, seconds) => {
    dispatch({
      type: 'UPDATE_TIME_SPENT',
      payload: { projectId, seconds }
    });
  };

  const editProject = (id, projectData) => {
    dispatch({
      type: 'EDIT_PROJECT',
      payload: { id, ...projectData }
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Gestionnaire de Projets</h1>
        
      </header>

      <main className="app-main">
        <div className="app-layout">
          <div className="sidebar">
            <ProjectForm onSubmit={addProject} />
            <ProjectStats projects={state.projects} />
          </div>

          <div className="main-content">
            <ProjectList
              projects={state.projects}
              onStatusUpdate={updateProjectStatus}
              onDelete={deleteProject}
              onEdit={editProject}
              onTimeUpdate={updateTimeSpent}
              activeTimerProject={activeTimerProject}
              setActiveTimerProject={setActiveTimerProject}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>📊 {state.projects.length} projets au total | 🍅 Méthode Pomodoro intégrée</p>
      </footer>
    </div>
  );
}

export default App;