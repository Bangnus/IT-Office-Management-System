import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { LuTrash2 } from 'react-icons/lu';

/** Delete confirmation dialog. Closes on backdrop click and Escape. */
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title = 'ยืนยันการลบข้อมูล', message = 'ลบแล้วจะกู้คืนไม่ได้ ต้องการลบข้อมูลนี้ใช่ไหม?' }) => {
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop animate-fade animate-duration-150" onClick={onClose}>
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-delete-title"
                onClick={(e) => e.stopPropagation()}
                className="modal-panel max-w-sm animate-fade-up animate-duration-200 animate-ease-out"
            >
                <div className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <LuTrash2 className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                        <h2 id="confirm-delete-title" className="modal-title">{title}</h2>
                        <p className="mt-1 text-sm text-ink-500">{message}</p>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="btn-secondary" autoFocus>
                        ยกเลิก
                    </button>
                    <button type="button" onClick={onConfirm} className="btn-danger">
                        ลบข้อมูล
                    </button>
                </div>
            </div>
        </div>
    );
};

ConfirmDeleteModal.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    title: PropTypes.string,
    message: PropTypes.string,
};

export default ConfirmDeleteModal;
