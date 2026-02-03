import React from 'react'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8 space-y-8">
        <header>
            <h1 className="text-3xl font-bold mb-4 text-violet-500">Dashboard</h1>
            <p className="text-neutral-400">Bienvenue sur le tableau de bord administrateur.</p>
            <p className ="text-neutral-400">Modération des Films - Gestion du Jury</p>
        </header>
        <main>
            <section className ="bg-neutral-950 p-6 rounded-xl p-6 shadow">
                <h2 className="text-xl font-semibold mb-4 text-violet-400">Films en Attente :</h2>
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-black px-3 py-1 rounded">Approuver</button>
                
            </section>
            <section className="bg-neutral-950 p-6 rounded-xl p-6 shadow">
                <h2 className="text-xl font-semibold mb-4 text-violet-400">Gestion du Jury :</h2>
                <button className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1 rounded">Reject</button>
            </section>            
        </main>
    </div>
  );
}

export default Dashboard