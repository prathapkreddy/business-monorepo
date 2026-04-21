import { Link, Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="bg-muted/50 flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground">
            Manage your business operations
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
