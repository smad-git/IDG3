import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './components/common/router/AppRouter';
import { UserProvider } from './components/contexts/UserContext';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter basename={'idg'}>
          <AppRouter />
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

export default App;
