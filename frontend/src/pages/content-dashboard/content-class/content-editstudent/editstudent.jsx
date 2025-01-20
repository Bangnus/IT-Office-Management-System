import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import DashMasterLayout from '../../layouts/master';
import InputComponet from '../../../../components/content-input/input-full';
import ButtonFullComponent from '../../../../components/content-buttons/full-button';
import Cookies from 'js-cookie'
import { editStudent, fetchEditStudentID } from '../../../../slicers/studentSlicer';
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify';

const EditStudent = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [studentID, setStudentID] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')

    const fetchStudentid = useSelector((state) => state.student.student)
    console.log(fetchStudentid)

    useEffect(() => {
        dispatch(fetchEditStudentID(id))
    }, [dispatch, id])

    useEffect(() => {
        if (fetchStudentid && fetchStudentid.length > 0) {
            const studentData = fetchStudentid[0]; // เข้าถึง Object แรกใน Array
            setStudentID(studentData.studentID || '');
            setFirstname(studentData.firstname || '');
            setLastname(studentData.lastname || '');
        }
    }, [fetchStudentid]);



    const handleSubmit = async () => {
        try {
            const studentPath = Cookies.get('StudentPath')
            const data = {
                studentID,
                firstname,
                lastname
            }
            const response = await dispatch(editStudent({ id, data }))

            if (response.payload.status === true) {
                ToastifySuccess({ lable: "เเก้ไขข้อมูลเสร็จสิน" })
                setStudentID('')
                setFirstname('')
                setLastname('')

                if (studentPath) {
                    navigate(studentPath)
                } else {
                    navigate('/dashboard')
                }
            } else {
                ToastifyWarning({ lable: "เเก้ไขข้อมูลไม่สำเร็จ" })
            }
        } catch (error) {
            ToastifyError({ lable: "เกิดข้อผิดพลาด" })
        }
    }
    const MenuPath = () => {
        const studentPath = Cookies.get('StudentPath')
        navigate(studentPath)
    }
    return (
        <DashMasterLayout title={'เเก้ไขข้อมูล'}>
            <div className="p-5 space-y-4 bg-white p-7 rounded-lg shadow-md">
                <InputComponet
                    label={"เเก้ไขรหัสนักเรียน"}
                    color={"blue"}
                    value={studentID}
                    OnChange={(value) => setStudentID(value)}
                />
                <InputComponet
                    label={"เเก้ไขชื่อ"}
                    color={"blue"}
                    value={firstname}
                    OnChange={(value) => setFirstname(value)}
                />
                <InputComponet
                    label={"เเก้ไขนามสกุล"}
                    color={"blue"}
                    value={lastname}
                    OnChange={(value) => setLastname(value)}
                />
                <div className="flex gap-x-5">
                    <ButtonFullComponent lable={"บันทึก"} color={"blue"} func={handleSubmit} />
                    <ButtonFullComponent lable={"ยกเลิก"} color={"red"} func={MenuPath} />
                </div>
            </div>
        </DashMasterLayout>
    )
}

export default EditStudent
