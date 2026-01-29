import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() { 
  const [backendStatus, setBackendStatus] = useState('Vérification...')
  const [users, setUsers] = useState([])

  // Test de connexion au backend
  useEffect(() => {
    // Test route principale
    axios.get('/api/')
      .then(res => {
        setBackendStatus('Connecté: ' + res.data)
      })
      .catch(err => {
        setBackendStatus('Erreur: ' + err.message)
      })

    // Test route base de données
    axios.get('/api/test-db')
      .then(res => {
        setUsers(res.data.data || [])
      })
      .catch(err => {
        console.error('Erreur DB:', err)
      })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Backend Status:</h2>
        <p className="text-lg text-gray-700 mb-8">{backendStatus}</p>
        
        <h3 className="text-xl font-semibold mb-6">Utilisateurs de la DB:</h3>
        {users.length > 0 ? (
          <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-indigo-600 text-white">
                {Object.keys(users[0]).map((key) => (
                  <th key={key} className="px-4 py-3 text-left font-semibold border-b-2 border-indigo-700">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  {Object.values(user).map((value, i) => (
                    <td key={i} className="px-4 py-3 border-b border-gray-200 text-gray-800 text-sm">
                      {value !== null ? String(value) : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600 italic">Aucun utilisateur trouvé</p>
        )}

        <p className="text-center text-gray-600 mt-8">
          Frontend: http://localhost:5173 → Backend: http://localhost:3000
        </p>
      </div>
    </div>
  )
}

export default App
