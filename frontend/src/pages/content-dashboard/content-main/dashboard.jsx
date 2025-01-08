import DashMasterLayout from "../layouts/master";
import HereDashboard from "./content/Hero";
import MemberTypeComponent from "./content/member-type";

const ViewDashboardComponent = () => {

    const path = [
        {
            label: "Home",
            active: false,
        },
        {
            label: "Seller Center",
            active: true,
        }
    ];

    return(
      <DashMasterLayout title="Seller Center" path={path}>
        <HereDashboard />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
        <MemberTypeComponent />
      </DashMasterLayout>
    );
};

export default ViewDashboardComponent;