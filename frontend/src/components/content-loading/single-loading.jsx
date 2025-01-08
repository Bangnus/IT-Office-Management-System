import PropTpyes from 'prop-types';

const SingleLaoding = ({ otherStyle }) => {
    return(
        <div className={`${otherStyle} bg-gray-300 animate-pulse animate-infinite animate-duration-1000 animate-ease-in-out rounded-md`}></div>
    );
};

SingleLaoding.propTypes = {
    otherStyle: PropTpyes.string,
};

export default SingleLaoding;