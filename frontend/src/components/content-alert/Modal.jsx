import { useEffect, useId } from 'react';
import PropTypes from 'prop-types';
import { LuX } from 'react-icons/lu';

/** Dialog for create/edit forms. Closes on backdrop click, the X button and Escape. */
const Modal = ({ isOpen, onClose, title, description, children, footer, size = 'md' }) => {
    const titleId = useId();

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const width = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-2xl' }[size] ?? 'max-w-md';

    return (
        <div className="modal-backdrop animate-fade animate-duration-150" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(e) => e.stopPropagation()}
                className={`modal-panel ${width} animate-fade-up animate-duration-200 animate-ease-out`}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2 id={titleId} className="modal-title">{title}</h2>
                        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
                    </div>
                    <button type="button" onClick={onClose} className="icon-btn -mr-2 -mt-1" aria-label="ปิด">
                        <LuX className="h-5 w-5" />
                    </button>
                </div>
                {children}
                {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.node,
    description: PropTypes.node,
    children: PropTypes.node,
    footer: PropTypes.node,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
};

export default Modal;
