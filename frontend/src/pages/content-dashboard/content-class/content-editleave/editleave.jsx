import { useEffect, useState } from 'react'
import DashMasterLayout from '../../layouts/master'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie'
import { fetchLeaveID, editLeave } from '../../../../slicers/leaveteacherSlicer'
import InputComponet from '../../../../components/content-input/input-full'
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify'
import { LuArrowLeft } from 'react-icons/lu'

const EditLeave = () => {
    const { id } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [teacherID, setTeacherID] = useState(null)
    const [saving, setSaving] = useState(false)

    const LeaveData = useSelector((state) => state.leave.leave)

    useEffect(() => {
        dispatch(fetchLeaveID(id));
    }, [dispatch, id]);

    useEffect(() => {
        // The store may still hold the teacher's whole list from the previous page, so pick this record by id
        const leavedata = Array.isArray(LeaveData) ? LeaveData.find((l) => String(l.id) === String(id)) : null;
        if (leavedata) {
            setDescription(leavedata.description || '');
            setDate(leavedata.date || '')
            setTeacherID(leavedata.teacherID ?? null)
        }
    }, [LeaveData, id]);

    const backPath = teacherID ? `/LeaveTeacher/${teacherID}` : '/home/teacher'

    const handleSubmit = async (e) => {
        e?.preventDefault()
        if (!description.trim() || !date) {
            ToastifyWarning({ label: 'กรุณากรอกเหตุผลและวันที่ลาให้ครบ' })
            return;
        }
        setSaving(true)
        try {
            const menupath = Cookies.get('MenuPath')
            const data = {
                description: description.trim(),
                date
            }
            const response = await dispatch(editLeave({ id, data }))
            if (response.payload.status === true) {
                ToastifySuccess({ label: "แก้ไขข้อมูลสำเร็จ" })
                setDescription('')
                setDate('')

                await dispatch(fetchLeaveID(id))
                navigate(menupath || backPath);

            } else {
                ToastifyWarning({ label: "แก้ไขข้อมูลไม่สำเร็จ" })
            }
        } catch {
            ToastifyError({ label: "เกิดข้อผิดพลาด" })
        } finally {
            setSaving(false)
        }
    }

    return (
        <DashMasterLayout
            title="แก้ไขข้อมูลการลา"
            back={
                <Link to={backPath} className="mb-2 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700">
                    <LuArrowLeft className="h-4 w-4" /> กลับไปหน้าประวัติการลา
                </Link>
            }
        >
            <form onSubmit={handleSubmit} noValidate className="card max-w-2xl animate-fade-up animate-once animate-duration-300 animate-ease-out">
                <div className="card-pad space-y-5">
                    <InputComponet
                        label="เหตุผลในการลา"
                        value={description}
                        OnChange={setDescription}
                        placeholder="เช่น ลาป่วย, ลากิจ"
                        required
                    />
                    <InputComponet
                        label="วันที่ลา"
                        type="date"
                        value={date}
                        OnChange={setDate}
                        required
                    />
                </div>
                <div className="flex justify-end gap-2 border-t border-ink-200 px-5 py-4 md:px-4">
                    <Link to={backPath} className="btn-secondary">ยกเลิก</Link>
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'กำลังบันทึก…' : 'บันทึก'}
                    </button>
                </div>
            </form>
        </DashMasterLayout>
    )
}

export default EditLeave
