import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import DashMasterLayout from '../../layouts/master';
import InputComponet from '../../../../components/content-input/input-full';
import Cookies from 'js-cookie'
import { editStudent, fetchEditStudentID } from '../../../../slicers/studentSlicer';
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify';
import { LuArrowLeft } from 'react-icons/lu';

const backLinkClass = 'mb-2 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700';

const EditStudent = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [studentID, setStudentID] = useState('')
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [classroomId, setClassroomId] = useState(null)
    const [saving, setSaving] = useState(false)

    const fetchStudentid = useSelector((state) => state.student.student)

    useEffect(() => {
        dispatch(fetchEditStudentID(id))
    }, [dispatch, id])

    useEffect(() => {
        if (fetchStudentid && fetchStudentid.length > 0) {
            // The slice is shared with the class page, so pick this student by id
            const studentData = fetchStudentid.find((s) => String(s.id) === String(id));
            if (!studentData) return;
            setStudentID(studentData.studentID || '');
            setFirstname(studentData.firstname || '');
            setLastname(studentData.lastname || '');
            setClassroomId(studentData.classroom ?? null);
        }
    }, [fetchStudentid, id]);

    // Where to go after saving or cancelling: the student's class, else the last class page visited
    const classPath = classroomId ? `/class/student/${classroomId}` : Cookies.get('StudentPath') || null;

    const goBack = () => {
        if (classPath) navigate(classPath)
        else navigate(-1)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!studentID.trim() || !firstname.trim() || !lastname.trim()) {
            ToastifyWarning({ label: 'กรุณากรอกรหัสนักศึกษา ชื่อ และนามสกุลให้ครบ' })
            return
        }
        setSaving(true)
        try {
            const data = {
                studentID: studentID.trim(),
                firstname: firstname.trim(),
                lastname: lastname.trim(),
            }
            const response = await dispatch(editStudent({ id, data }))

            if (response.payload.status === true) {
                ToastifySuccess({ label: 'แก้ไขข้อมูลนักเรียนสำเร็จ' })
                navigate(classPath || '/dashboard')
            } else {
                ToastifyWarning({ label: 'แก้ไขข้อมูลไม่สำเร็จ' })
            }
        } catch {
            ToastifyError({ label: 'เกิดข้อผิดพลาด' })
        } finally {
            setSaving(false)
        }
    }

    const back = classPath ? (
        <Link to={classPath} className={backLinkClass}>
            <LuArrowLeft className="h-4 w-4" /> กลับไปหน้าห้องเรียน
        </Link>
    ) : (
        <button type="button" onClick={() => navigate(-1)} className={backLinkClass}>
            <LuArrowLeft className="h-4 w-4" /> ย้อนกลับ
        </button>
    )

    return (
        <DashMasterLayout
            title="แก้ไขข้อมูลนักเรียน"
            description="แก้ไขรหัสนักศึกษาและชื่อ-นามสกุล"
            back={back}
        >
            <form onSubmit={handleSubmit} noValidate className="card max-w-2xl animate-fade-up animate-once animate-duration-300 animate-ease-out">
                <div className="card-pad space-y-4">
                    <InputComponet
                        label="รหัสนักศึกษา"
                        value={studentID}
                        OnChange={(value) => setStudentID(value)}
                        inputMode="numeric"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                        <InputComponet label="ชื่อ" value={firstname} OnChange={(value) => setFirstname(value)} required />
                        <InputComponet label="นามสกุล" value={lastname} OnChange={(value) => setLastname(value)} required />
                    </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-ink-200 px-5 py-4 md:px-4">
                    <button type="button" className="btn-secondary" onClick={goBack}>ยกเลิก</button>
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'กำลังบันทึก…' : 'บันทึก'}
                    </button>
                </div>
            </form>
        </DashMasterLayout>
    )
}

export default EditStudent
