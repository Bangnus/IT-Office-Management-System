import PropTypes from 'prop-types';

const RedirusFullLoading = ({ otherStyle }) => {
    return(
        <div className={`${ otherStyle ? otherStyle : 'w-[40px] h-[40px]' } bg-gray-300  animate-pulse animate-infinite animate-duration-1000 animate-ease-in-out rounded-full`}></div>
    );
};

RedirusFullLoading.propTypes = {
    otherStyle: PropTypes.string,
};

export default RedirusFullLoading;