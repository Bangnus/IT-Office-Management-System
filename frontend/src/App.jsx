import { Routes, Route } from "react-router-dom";
import AuthProvider from "./hooks/AuthProvider";
import PrivateRoute from "./hooks/PrivateRoute";
import SigninView from "./pages/content-authenticate/signin";
import ViewDashboardComponent from "./pages/content-dashboard/content-main/dashboard";
import OrdersView from "./pages/content-dashboard/content-orders/view-orders";
import PackageViewComponent from "./pages/content-dashboard/content-package/package-view";
import PageNotFound from "./pages/content-error/404-notfound";
import ViewClassVC from "./pages/content-dashboard/content-class/group-class/view-class-vc";
import ViewClassHvc from "./pages/content-dashboard/content-class/group-class/view-class-hvc";
import Editclassroom from "./pages/content-dashboard/content-class/conten-editclass/editclassroom";
import Viewclassteacher from "./pages/content-dashboard/content-class/group-class/view-class-teacher";
import ViewClassBa from "./pages/content-dashboard/content-class/group-class/view-class-ba";
import ViewManageClass from "./pages/content-dashboard/content-class/group-class/view-manage-class";
import ViewClassStudent from "./pages/content-dashboard/content-class/content-student/view-class-student";
import EditStudent from "./pages/content-dashboard/content-class/content-editstudent/editstudent";
import EditEeacher from "./pages/content-dashboard/content-class/content-editteacher/editteacher";
import ViewManageEquipment from "./pages/content-dashboard/content-class/group-class/view-manageequipment";
import EditEquipment from "./pages/content-dashboard/content-class/content-editequipment/editequipment";
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Route  */}
        <Route path="/" index element={<SigninView />} />
        <Route path="/authenticate/:type" element={<SigninView />} />
        <Route path="*" element={<PageNotFound />} />

        {/* Private Route   */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<ViewDashboardComponent />} />
          <Route path="/home/teacher" element={<Viewclassteacher />} />
          <Route path="/home/Vocational-Certificate" element={<ViewClassVC />} />
          <Route path="/home/Higher-Vocational-Certificate" element={<ViewClassHvc />} />
          <Route path="/home/Bachelors-Degree" element={<ViewClassBa />} />
          <Route path="/home/manage-classroom" element={<ViewManageClass />} />
          <Route path="/home/manage-equipment" element={<ViewManageEquipment />} />
          <Route path="/class/student/:id" element={<ViewClassStudent />} />
          <Route path="/editingClassRoom/:id" element={<Editclassroom />} />
          <Route path="/editStudent/:id" element={<EditStudent />} />
          <Route path="/editTeachert/:id" element={<EditEeacher />} />
          <Route path="/editEquipment/:id" element={<EditEquipment />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
export default App;