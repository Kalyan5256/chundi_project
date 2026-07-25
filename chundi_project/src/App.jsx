import Maintenance from './pages/Maintenance'
import Home from './pages/Home'

function App() {
  // Check if '?preview=true' is in the URL query parameters
  const showPreview = new URLSearchParams(window.location.search).get('preview') === 'true'

  if (showPreview) {
    return <Home />
  }

  return <Maintenance />
}

export default App
