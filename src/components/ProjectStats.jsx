const ProjectStats = ({ projects }) => {
  const stats = {
    todo: projects.filter(p => p.status === 'todo').length,
    doing: projects.filter(p => p.status === 'doing').length,
    done: projects.filter(p => p.status === 'done').length,
    total: projects.length,
    overdue: projects.filter(p => new Date(p.deadline) < new Date() && p.status !== 'done').length
  };

  const totalTime = projects.reduce((total, project) => total + project.timeSpent, 0);
  const avgTime = stats.total > 0 ? totalTime / stats.total : 0;

  const getPercentage = (count) => {
    return stats.total > 0 ? (count / stats.total) * 100 : 0;
  };

  const formatTotalTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="project-stats">
      <h3>📊 Statistiques des Projets</h3>
      
      <div className="stats-grid">
        <div className="stat-card todo">
          <div className="stat-number">{stats.todo}</div>
          <div className="stat-label">À faire</div>
          <div className="stat-percentage">{getPercentage(stats.todo).toFixed(1)}%</div>
        </div>
        
        <div className="stat-card doing">
          <div className="stat-number">{stats.doing}</div>
          <div className="stat-label">En cours</div>
          <div className="stat-percentage">{getPercentage(stats.doing).toFixed(1)}%</div>
        </div>
        
        <div className="stat-card done">
          <div className="stat-number">{stats.done}</div>
          <div className="stat-label">Terminés</div>
          <div className="stat-percentage">{getPercentage(stats.done).toFixed(1)}%</div>
        </div>
        
        <div className="stat-card total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-segment todo" 
            style={{ width: `${getPercentage(stats.todo)}%` }}
            title={`À faire: ${stats.todo}`}
          ></div>
          <div 
            className="progress-segment doing" 
            style={{ width: `${getPercentage(stats.doing)}%` }}
            title={`En cours: ${stats.doing}`}
          ></div>
          <div 
            className="progress-segment done" 
            style={{ width: `${getPercentage(stats.done)}%` }}
            title={`Terminés: ${stats.done}`}
          ></div>
        </div>
      </div>

      <div className="additional-stats">
        <div className="additional-stat">
          <span className="stat-icon">⏱️</span>
          <div>
            <div className="stat-title">Temps total passé</div>
            <div className="stat-value">{formatTotalTime(totalTime)}</div>
          </div>
        </div>
        
        <div className="additional-stat">
          <span className="stat-icon">📅</span>
          <div>
            <div className="stat-title">Projets en retard</div>
            <div className="stat-value">{stats.overdue}</div>
          </div>
        </div>
        
        <div className="additional-stat">
          <span className="stat-icon">⚡</span>
          <div>
            <div className="stat-title">Temps moyen/projet</div>
            <div className="stat-value">{formatTotalTime(avgTime)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;