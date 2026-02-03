import React from "react";


function Card() {
    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-neutral-800 transition">
            <p className="text-sm text-neutral-400"></p>
            <p className="text-2xl font-bold mt-2 text-white"></p>
        </div>
    );
}

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-neutral-950 text-white p-8 space-y-10">
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-400 uppercase tracking-widest">Administrateur</span>
                </div>
            </header>

            <section>
                <h1 className="text-4xl font-bold">
                    <span className="text-violet-500">Dashboard Administrateur</span>
                </h1>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <Card label="Soumissions" value="624" />
                <Card label="Score moyen" value="4.8" />
                <Card label="Votes total" value="12.4k" />
                <Card label="En attente" value="142" />
            </section>

            
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                    <h2 className="text-lg font-semibold mb-4 text-violet-400">Performance du Festival</h2>
                    <div className="h-56 flex items-center justify-center text-neutral-500 border-2 border-dashed border-neutral-700 rounded-lg">
                        Caractéristique
                    </div>
                </div>

                <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                    <h2 className="text-lg font-semibold mb-4 text-violet-400">Top catégories</h2>
                    <div className="h-56 flex items-center justify-center text-neutral-500 border-2 border-dashed border-neutral-700 rounded-lg">
                        Couverture
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
