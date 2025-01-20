import React, { useEffect, useState } from 'react';
import DashMasterLayout from '../../layouts/master';
import { useDispatch, useSelector } from 'react-redux';
import { fetchclassVC, fetchClassRoom, createClassRoom, deleteClassRoom } from '../../../../slicers/classSlicer';
import { Link, useNavigate } from 'react-router-dom';
import InputComponet from '../../../../components/content-input/input-full';
import ButtonFullComponent from '../../../../components/content-buttons/full-button';
import { ToastifyError, ToastifySuccess } from '../../../../components/content-alert/toastify';
import { RiEdit2Fill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { IoIosCloseCircle } from 'react-icons/io';
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal';

const ViewClassHvc = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isModelOpen, setIsModelOpen] = useState(false)
    const [className, setClassName] = useState('');
    const [vcID, setVcID] = useState('');
    const [roomID, setRoomID] = useState('')
    // Selectors
    const fetchclass = useSelector((state) => state.class.class);
    const fetchclassroom = useSelector((state) => state.class.classroom);

    // Filter classrooms based on vcID
    const filteredClassrooms = fetchclassroom?.filter((classroom) => classroom.vcID === vcID) || [];




    // Handle creating a new classroom
    const handleCreateClass = async () => {
        try {
            setIsLoading(true);
            if (!className || !vcID) throw new Error('All fields are required');

            const data = { className, vcID };
            const response = await dispatch(createClassRoom(data));

            if (response.payload?.status === true) {
                ToastifySuccess({ lable: 'สร้างห้องสำเร็จ' });
                setClassName('');
                setVcID('');
                setIsOpen(null);
                await dispatch(fetchclassVC());
                await dispatch(fetchClassRoom()); // Refresh classrooms
            } else {
                ToastifyError({ lable: 'สร้างห้องไม่สำเร็จ' });
            }
        } catch (error) {
            ToastifyError({ lable: 'เกิดข้อผิดพลาด' });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        dispatch(fetchclassVC());
        dispatch(fetchClassRoom());
    }, [dispatch]);

    // Filter current class data
    const currenclass = Array.isArray(fetchclass)
        ? fetchclass.filter((item) => item.classroom && item.classroom.includes('ปวส'))
        : [];

    // Handle menu toggle
    const handleOpenMenu = (index, id) => {
        setIsOpen(isOpen === index ? null : index);
        setVcID(id);
    };

    const handleDeleteClick = (id) => {
        setRoomID(id)
        setIsModelOpen(true)
    }
    const handleDelete = async () => {
        try {
            if (!roomID) {
                throw new Error('ไม่พบ ID ห้องเรียนที่ต้องการลบ');
            }
            const response = await dispatch(deleteClassRoom(roomID))

            if (response.payload.status === true) {
                ToastifySuccess({ lable: 'ลบสำเร็จ' });
                setRoomID('')
                setIsModelOpen(false)
                await dispatch(fetchClassRoom())
            } else {
                ToastifyError({ lable: 'ลบไม่สำเร็จ' });
            }
        } catch (error) {
            ToastifyError({ lable: 'เกิดข้อผิดพลาด' });
        }
    }

    const studentidPath = (Path) => {
        Cookies.set('StudentPath', Path)
    }
    return (
        <DashMasterLayout title="เพิ่มห้องเรียน ปวช.">
            {currenclass.length > 0 ? (
                currenclass.map((item, index) => (
                    <div
                        key={item.id}
                        className="cursor-pointer border border-gray-300 rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition duration-300 ease-in-out mb-4"
                        onClick={() => handleOpenMenu(index, item.id)}
                    >
                        <button className="text-[20px] font-medium text-black font-primaryRegula">
                            ห้องเรียน {item.classroom}
                        </button>

                        {isOpen === index && (
                            <div
                                className="mt-4 animate-fade-down animate-once animate-ease-out animate-normal animate-fill-forwards"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="space-y-3">
                                    <InputComponet
                                        label="เพิ่มห้องเรียน"
                                        color="blue"
                                        value={className}
                                        OnChange={setClassName}
                                    />
                                    <ButtonFullComponent
                                        lable="เพิ่มห้องเรียน"
                                        color="blue"
                                        func={handleCreateClass}
                                        isLoading={isLoading}
                                    />
                                </div>
                                {filteredClassrooms && filteredClassrooms.length > 0 ?
                                    [...filteredClassrooms]
                                        .sort((a, b) => a.className.localeCompare(b.className))
                                        .map((classroom) => (
                                            <div key={classroom.id} className="my-5 flex justify-between items-center space-x-4 p-2 hover:bg-blue-50 transition-all duration-300 rounded-md border border-gray-300">
                                                <Link to={`/class/student/${classroom.id}`} className="w-full">
                                                    <div className=" text-lg font-medium text-gray-800 hover:text-blue-500 py-2 px-4 rounded-md transition-colors duration-200"
                                                        onClick={() => studentidPath(`/class/student/${classroom.id}`)}
                                                    >
                                                        {classroom.className}
                                                    </div>
                                                </Link>

                                                <div className="flex items-center gap-x-4">

                                                    <Link to={`/editingClassRoom/${classroom.id}`}>
                                                        <div className="p-2 bg-yellow-600 rounded-md text-white hover:bg-yellow-700 transition-colors duration-300">
                                                            <RiEdit2Fill size={24} />
                                                        </div>
                                                    </Link>

                                                    <button
                                                        onClick={() => handleDeleteClick(classroom.id)}
                                                        className="p-2 bg-red-600 rounded-md text-white hover:bg-red-700 transition-colors duration-300 cursor-pointer">
                                                        <TiDelete size={24} />
                                                    </button>

                                                </div>
                                            </div>

                                        ))
                                    : <div className="text-center mt-5">ไม่มีห้องเรียน</div>
                                }

                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center text-gray-500 ">loading...</div>
            )}
            <ConfirmDeleteModal
                isOpen={isModelOpen}
                onClose={() => setIsModelOpen(false)}
                onConfirm={handleDelete}
            />
        </DashMasterLayout>
    );
};

export default ViewClassHvc
