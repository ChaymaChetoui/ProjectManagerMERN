export const projectReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, {
          id: Date.now(),
          title: action.payload.title,
          description: action.payload.description,
          status: 'todo',
          deadline: action.payload.deadline,
          createdAt: new Date().toISOString(),
          timeSpent: 0,
          completedAt: null
        }]
      };

    case 'UPDATE_PROJECT_STATUS':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id
            ? { 
                ...project, 
                status: action.payload.status,
                completedAt: action.payload.status === 'done' ? new Date().toISOString() : project.completedAt
              }
            : project
        )
      };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload.id)
      };

    case 'UPDATE_TIME_SPENT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.projectId
            ? { ...project, timeSpent: project.timeSpent + action.payload.seconds }
            : project
        )
      };

    case 'EDIT_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id
            ? { 
                ...project,
                title: action.payload.title,
                description: action.payload.description,
                deadline: action.payload.deadline
              }
            : project
        )
      };

    default:
      return state;
  }
};

export const initialState = {
  projects: []
};