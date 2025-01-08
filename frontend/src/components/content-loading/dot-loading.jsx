const DotLoading = () => {
    return(
        <div className='flex space-x-2 justify-center py-1 items-center'>
            <span className='sr-only'>Loading...</span>
            <div className='h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s] animate-infinite'></div>
            <div className='h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s] animate-infinite'></div>
            <div className='h-2 w-2 bg-white rounded-full animate-bounce animate-infinite'></div>
        </div>
    );
};

export default DotLoading;