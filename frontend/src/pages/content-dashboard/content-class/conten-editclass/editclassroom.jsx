import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { editclassroom, fetchClassRoomID } from '../../../../slicers/classSlicer';
import { ToastifyError, ToastifySuccess } from '../../../../components/content-alert/toastify';
import DashMasterLayout from '../../layouts/master';
import InputComponet from '../../../../components/content-input/input-full';
import ButtonFullComponent from '../../../../components/content-buttons/full-button';
import Cookies from 'js-cookie'
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal';
const Editclassroom = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [className, setClassName] = useState('');

    const fetchclassroom = useSelector((state) => state.class.classroom);
    useEffect(() => {
        dispatch(fetchClassRoomID(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (fetchclassroom && fetchclassroom.length > 0) {
            const room = fetchclassroom[0];
            setClassName(room.className);
        }
    }, [fetchclassroom]);
    
    const MenuPath = () => {
        const menuPath = Cookies.get('MenuPath')
        navigate(menuPath)
    }
    const handleSubmit = async () => {
        try {
            const menuPath = Cookies.get('MenuPath')

            const response = await dispatch(editclassroom({ id, className }));

            if (response.payload.status === true) {
                setClassName('');
                if (menuPath) {
                    navigate(menuPath)
                } else {
                    navigate('/dashboard')
                }
                setTimeout(() => {
                    ToastifySuccess({ lable: 'แก้ไขข้อมูลสำเร็จ' });
                }, 500);
            } else {
                ToastifyError({ lable: 'เกิดข้อผิดพลาดในการแก้ไขห้องเรียน' });
            }
        } catch (error) {
            ToastifyError({ label: 'เกิดข้อผิดพลาด' });
        }
    };


  
    return (
        <DashMasterLayout title={"เเก้ไขห้องเรียน"}>

            <div className="p-5 space-y-4 bg-white p-7 rounded-lg shadow-md">
                <InputComponet
                    label={"เเก้ไขห้อง"}
                    color={"blue"}
                    value={className}
                    OnChange={(value) => setClassName(value)}
                />
                <div className="flex gap-x-5">
                    <ButtonFullComponent lable={"บันทึก"} color={"blue"} func={handleSubmit} />
                    <ButtonFullComponent lable={"ยกเลิก"} color={"red"} func={MenuPath} />
                </div>
            </div>
        </DashMasterLayout>
    );
};

export default Editclassroom;
