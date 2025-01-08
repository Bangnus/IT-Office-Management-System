import { Drawer } from "@material-tailwind/react";  
import PropTypes from "prop-types";

const DrawerRigthComponent = ({ IsOpend, children }) => {
    return(
        <Drawer
            placement="right"
            open={IsOpend}
            size={400}
            className="p-4 rounded-l-lg"
        >
            <div className="w-full">
                {children}  {/* Your components here */}
            </div>
        </Drawer>
    );
};

DrawerRigthComponent.propTypes = {
    IsOpend: PropTypes.bool,
    children: PropTypes.any,
};

export default DrawerRigthComponent;