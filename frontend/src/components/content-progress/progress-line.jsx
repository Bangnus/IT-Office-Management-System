import { Progress } from 'antd';
import PropTypes from 'prop-types';

const ProgressLineComponent = ({ number }) => {
    return(
        <div className="flex justify-center w-full">
            <Progress type="line" percent={number} showInfo={false} />
        </div>
    );
};

ProgressLineComponent.propTypes = {
    number: PropTypes.number,
};

export default ProgressLineComponent;