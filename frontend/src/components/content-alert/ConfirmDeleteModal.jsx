import React from 'react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 "
            onClick={onClose}
        >
            <div 
            onClick={(e) => e.stopPropagation() }
            className="bg-white rounded-lg p-5 w-1/3 shadow-lg  animate-jump-in animate-once animate-ease-out animate-normal animate-fill-forwards">
                <h2 className="text-lg font-bold mb-4 xs:text-[12px] ">ยืนยันการลบข้อมูล</h2>
                <p className="mb-4 xs:text-[12px]">คุณแน่ใจหรือว่าต้องการลบข้อมูลนี้?</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 xs:px-1 xs:py-0 xs:text-[10px]"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition ease-in-out delay-150 xs:text-[10px]"
                    >
                        ยืนยันการลบ
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ConfirmDeleteModal;

