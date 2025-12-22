export default function DashboardPage() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-base-content/70">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm opacity-70">Total Lessons</h2>
              <p className="text-3xl font-bold">24</p>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm opacity-70">Completed</h2>
              <p className="text-3xl font-bold">18</p>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm opacity-70">In Progress</h2>
              <p className="text-3xl font-bold">6</p>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-sm opacity-70">Saved</h2>
              <p className="text-3xl font-bold">12</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-base-100 rounded-lg">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-12">
                    <span>L1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Introduction to React</h3>
                  <p className="text-sm opacity-70">Completed 2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-base-100 rounded-lg">
                <div className="avatar placeholder">
                  <div className="bg-secondary text-secondary-content rounded-full w-12">
                    <span>L2</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">JavaScript Fundamentals</h3>
                  <p className="text-sm opacity-70">In progress</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-base-100 rounded-lg">
                <div className="avatar placeholder">
                  <div className="bg-accent text-accent-content rounded-full w-12">
                    <span>L3</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">CSS Grid Layout</h3>
                  <p className="text-sm opacity-70">Saved for later</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}