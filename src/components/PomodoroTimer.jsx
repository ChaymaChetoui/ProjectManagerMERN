import { useState, useEffect, useRef } from 'react';

const PomodoroTimer = ({ projectId, onTimeUpdate, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    if (isRunning && isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            
            if (mode === 'work') {
              setCompletedPomodoros(prev => prev + 1);
              onTimeUpdate(projectId, 25 * 60);
            }

            if (Notification.permission === 'granted') {
              new Notification(
                mode === 'work' ? ' Session de travail terminée !' : ' Pause terminée !',
                {
                  body: mode === 'work' ? 'Prenez une pause de 5 minutes.' : 'Retour au travail !',
                }
              );
            }

            const newMode = mode === 'work' ? 'break' : 'work';
            setMode(newMode);
            return newMode === 'work' ? 25 * 60 : 5 * 60;
          }
          
          return prevTime - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isActive, mode, projectId, onTimeUpdate]);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-timer">
      <div className="pomodoro-header">
        <h4>Timer Pomodoro</h4>
        <span className={`pomodoro-mode ${mode}`}>
          {mode === 'work' ? 'Travail' : 'Pause'}
        </span>
      </div>
      
      <div className="time-display">
        {formatTime(timeLeft)}
      </div>

      <div className="pomodoro-info">
        <span>Pomodoros complétés: {completedPomodoros}</span>
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button onClick={startTimer} className="btn btn-success">
            ▶ Démarrer
          </button>
        ) : (
          <button onClick={pauseTimer} className="btn btn-warning">
            ⏸ Pause
          </button>
        )}
        <button onClick={resetTimer} className="btn btn-secondary">
          Reset
        </button>
      </div>

      <div className="mode-controls">
        <button 
          onClick={() => switchMode('work')} 
          className={`btn btn-sm ${mode === 'work' ? 'btn-primary' : 'btn-outline-primary'}`}
        >
          Travail (25min)
        </button>
        <button 
          onClick={() => switchMode('break')} 
          className={`btn btn-sm ${mode === 'break' ? 'btn-success' : 'btn-outline-success'}`}
        >
          Pause (5min)
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;