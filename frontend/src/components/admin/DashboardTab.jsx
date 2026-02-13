export default function DashboardTab() {
  return (
    <div className="bg-white/5 border-2 border-[#ff0096] rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#ff0096]">📊 Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#ff0096] to-[#c90070] p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Films</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-gradient-to-br from-[#00d4ff] to-[#0088aa] p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Total Jury</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-gradient-to-br from-[#00ff00] to-[#00aa00] p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Approuvés</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
