import { RouterProvider, createBrowserRouter } from "react-router";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { CompareProvider } from "@/app/contexts/CompareContext";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";
import { HomePage } from "@/app/pages/HomePage";
import { MapPage } from "@/app/pages/MapPage";
import { RegisterPage } from "@/app/pages/RegisterPage";
import { PostRoomPage } from "@/app/pages/PostRoomPage";
import { BlogPage } from "@/app/pages/BlogPage";
import { PolicyPage } from "@/app/pages/PolicyPage";
import { ContactPage } from "@/app/pages/ContactPage";
import { LoginPage } from "@/app/pages/LoginPage";
import { AdminPage } from "@/app/pages/AdminPage";
import { LandlordDashboard } from "@/app/pages/LandlordDashboard";
import { UserDashboard } from "@/app/pages/UserDashboard";
import { RoomDetailPage } from "@/app/pages/RoomDetailPage";
import { ComparePage } from "@/app/pages/ComparePage";

const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/map", Component: MapPage },
  { path: "/room/:id", Component: RoomDetailPage },
  { path: "/compare", Component: ComparePage },
  { path: "/register", Component: RegisterPage },
  { path: "/post-room", Component: PostRoomPage },
  { path: "/blog", Component: BlogPage },
  { path: "/policy", Component: PolicyPage },
  { path: "/contact", Component: ContactPage },
  { path: "/login", Component: LoginPage },
  { path: "/admin/login", Component: LoginPage },
  { path: "/admin/dashboard", Component: AdminPage },
  { path: "/landlord/dashboard", Component: LandlordDashboard },
  { path: "/user/dashboard", Component: UserDashboard },
]);

export default function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </CompareProvider>
    </AuthProvider>
  );
}
