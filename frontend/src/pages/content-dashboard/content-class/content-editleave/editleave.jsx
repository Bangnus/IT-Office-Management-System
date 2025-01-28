import React, { useEffect, useState } from 'react'
import DashMasterLayout from '../../layouts/master'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { fetchLeaveID, editLeave } from '../../../../slicers/leaveteacherSlicer'
import InputComponet from '../../../../components/content-input/input-full'
import ButtonFullComponent from '../../../../components/content-buttons/full-button'
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify'



const EditLeave = () => {
    const { id } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')

    const LeaveData = useSelector((state) => state.leave.leave)
    console.log(LeaveData)
    useEffect(() => {
        dispatch(fetchLeaveID(id));
    }, [dispatch, id]);




    const handleSubmit = async () => {
        try {
            const menupath = Cookies.get('MenuPath')
            const data = {
                description,
                date
            }
            const response = await dispatch(editLeave({ id, data }))
            if (response.payload.status === true) {
                ToastifySuccess({ lable: "เเกไขข้อมูลสำเร็จ" })
                setDescription('')
                setDate('')

                await dispatch(fetchLeaveID(id))
                navigate(menupath || '/dashboard');

            } else {
                ToastifyWarning({ lable: "เเก้ไขข้อมูลไม่สำเร็จ" })
            }
        } catch (error) {
            ToastifyError({ lable: "เกิดข้อผิดพลาด" })
        }
    }

    const Menupath = () => {
        const menupath = Cookies.get('MenuPath')
        navigate(menupath)
    }

     useEffect(() => {
            if (LeaveData && LeaveData.length > 0) {
                const leavedata = LeaveData[0];
                setDescription(leavedata.description);
                setDate(leavedata.date)
            }
        }, [LeaveData]);
    return (
        <DashMasterLayout title={"เเก้ไขข้อมูลการลา"}>
            <div className="p-5 space-y-4 bg-white  rounded-lg shadow-md">
                <InputComponet
                    label={"เเก้ไขชื่อ"}
                    color={"blue"}
                    value={description}
                    OnChange={(value) => setDescription(value)}
                />
                <InputComponet
                    label={"เเก้ไขจำนวน"}
                    color={"blue"}
                    type={'date'}
                    value={date}
                    OnChange={(value) => setDate(value)}
                />
                <div className="flex gap-x-5">
                    <ButtonFullComponent lable={"บันทึก"} color={"blue"} func={handleSubmit} />
                    <ButtonFullComponent lable={"ยกเลิก"} color={"red"} func={Menupath} />
                </div>
            </div>
        </DashMasterLayout>
    )
}

export default EditLeave
