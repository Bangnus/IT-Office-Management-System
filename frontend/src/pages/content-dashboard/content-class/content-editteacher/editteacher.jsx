import React, { useEffect, useState } from 'react'
import DashMasterLayout from '../../layouts/master'
import { FetchTeacherID, EditTeacher } from '../../../../slicers/teacherSlicer'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import InputComponet from '../../../../components/content-input/input-full'
import ButtonFullComponent from '../../../../components/content-buttons/full-button'
import { ToastifyError, ToastifySuccess } from '../../../../components/content-alert/toastify'
import Cookies from 'js-cookie'

const EditEeacher = () => {

    const { id } = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [fullName, setFullName] = useState('')
    const [position, setPosition] = useState('');
    const [TeacherImage, setTeacherImage] = useState(null);

    const fetchTeacher = useSelector((state) => state.teacher.teacher)
    console.log(fetchTeacher)


    useEffect(() => {
        dispatch(FetchTeacherID(id))
    }, [dispatch, id])

    useEffect(() => {
        if (Array.isArray(fetchTeacher) && fetchTeacher.length > 0) {
            const teacherData = fetchTeacher[0];
            setFullName(teacherData.fullName || '');
            setPosition(teacherData.position || '');
            setTeacherImage(teacherData.TeacherImage || '');
        }

    }, [fetchTeacher])

    const handleSubmit = async () => {
        try {
            const menupath = Cookies.get('MenuPath')

            const formData = new FormData();
            formData.append('fullName', fullName)
            formData.append('position', position)
            formData.append('TeacherImage', TeacherImage)

            const response = await dispatch(EditTeacher({ formData, id }))

            if (response.payload.status === true) {
                ToastifySuccess({ lable: "เเกไขข้อมูลสำเร็จ" })
                setFullName('')
                setPosition('')
                setTeacherImage(null)

                await dispatch(FetchTeacherID(id));

                navigate(menupath || '/dashboard');
            } else {
                ToastifyError({ lable: "เเก้ไขข้อมูลไม่สำเร็จ" });
            }
        } catch (error) {
            ToastifyError({ lable: "เกิดข้อผิดพลาด" })
        }
    }
    const Menupath = () => {
        const menupath = Cookies.get('MenuPath')
        navigate(menupath)
    }

    return (
        <DashMasterLayout>
            <div className="p-5 space-y-4 bg-white p-7 rounded-lg shadow-md">
                <InputComponet
                    label={"ชื่อ"}
                    color={"blue"}
                    value={fullName}
                    OnChange={(value) => setFullName(value)}
                />
                <InputComponet
                    label={"ตำเเหน่ง"}
                    color={"blue"}
                    value={position}
                    OnChange={(value) => setPosition(value)}
                />
                <input
                    type="file"
                    onChange={(e) => setTeacherImage(e.target.files[0])}
                />

                <div className="flex gap-x-5">
                    <ButtonFullComponent lable={"บันทึก"} color={"blue"} func={handleSubmit} />
                    <ButtonFullComponent lable={"ยกเลิก"} color={"red"} func={Menupath} />
                </div>
            </div>
        </DashMasterLayout>
    )
}

export default EditEeacher
