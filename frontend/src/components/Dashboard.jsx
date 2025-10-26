// imports
import { usePulsy } from 'pulsy';
import { logout } from '../services/auth.service';

const Dashboard = () => {
  const [auth] = usePulsy('auth');

  const handleLogout = () => {
    logout();
    window.location.reload(); // Simple page refresh to redirect to login
  };

  return (
    <div>
      <h2>Welcome, {auth.user.username}!</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;