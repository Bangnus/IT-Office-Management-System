import { Breadcrumbs } from "@material-tailwind/react";
import PropTypes from "prop-types";

const BreadcrumbsWithIcon = ({ path }) => {
    return(
        <Breadcrumbs className="bg-blue-500">
            {
                path.map((items, key) => (
                    <a key={key} href="#" className={`${items.active ? '' : 'opacity-60'}`}>
                        <span>{items.label}</span>
                    </a>
                ))
            }
        </Breadcrumbs>
    );
};

BreadcrumbsWithIcon.propTypes = {
    path: PropTypes.any,
};

export default BreadcrumbsWithIcon;