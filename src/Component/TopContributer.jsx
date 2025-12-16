export function TopContributors({ users = [] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-bold text-white mb-10">
        🏆 Top Contributors of the Week
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-green-400/20 rounded-2xl p-6 flex items-center gap-4"
          >
            <img
              src={user.avatar}
              alt={user.name || "User"}
              className="w-14 h-14 rounded-full object-cover"
            />

            <div>
              <h3 className="font-semibold text-white">{user.name}</h3>
              <p className="text-sm text-green-300">
                {user.lessons} lessons shared
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
