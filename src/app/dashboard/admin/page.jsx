export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-semibold">—</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Total Lessons</p>
          <p className="text-2xl font-semibold">—</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Reported Lessons</p>
          <p className="text-2xl font-semibold">—</p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">New Lessons Today</p>
          <p className="text-2xl font-semibold">—</p>
        </div>
      </div>
    </div>
  );
}
