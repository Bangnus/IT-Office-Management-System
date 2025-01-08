import DashMasterLayout from "../layouts/master";
import BannerComponent from "./content/banner";

const PackageViewComponent = () => {

    const path = [
        {
            label: "Home",
            active: false,
        },
        {
            label: "Seller Center",
            active: false,
        },
        {
            label: "Package Management",
            active: true,
        }
    ];

    return(
        <DashMasterLayout title="Package Management" path={path}>
            <BannerComponent />
        </DashMasterLayout>
    );
};

export default PackageViewComponent;