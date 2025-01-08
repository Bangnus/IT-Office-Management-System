import DashMasterLayout from "../layouts/master";

const OrdersView = () => {

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
            label: "Orders",
            active: true,
        }
    ];

    return(
        <DashMasterLayout title="Orders" path={path}>
            <div>
                sdsdsd
            </div>
        </DashMasterLayout>
    );
};

export default OrdersView;