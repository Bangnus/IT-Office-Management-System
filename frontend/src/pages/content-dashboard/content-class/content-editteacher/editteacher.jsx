import { useEffect, useState } from 'react'
import DashMasterLayout from '../../layouts/master'
import { FetchTeacherID, EditTeacher } from '../../../../slicers/teacherSlicer'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, Link } from 'react-router-dom'
import InputComponet from '../../../../components/content-input/input-full'
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify'
import Cookies from 'js-cookie'
import { LuArrowLeft, LuImagePlus, LuRotateCcw, LuUser } from 'react-icons/lu'
import fileUrl from '../../../../hooks/fileUrl'

const LIST_PATH = '/home/teacher'

const EditEeacher = () => {

    const { id } = useParams()
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [fullName, setFullName] = useState('')
    const [position, setPosition] = useState('');
    const [currentImage, setCurrentImage] = useState(null); // stored path, e.g. "uploads/123.jpg"
    const [newImage, setNewImage] = useState(null);         // File picked to replace it
    const [preview, setPreview] = useState(null)
    const [saving, setSaving] = useState(false)
    const [savedName, setSavedName] = useState('')

    const fetchTeacher = useSelector((state) => state.teacher.teacher)

    useEffect(() => {
        dispatch(FetchTeacherID(id))
    }, [dispatch, id])

    useEffect(() => {
        // The store may still hold the full list from the previous page, so pick the teacher by id
        const teacherData = Array.isArray(fetchTeacher) ? fetchTeacher.find((t) => String(t.id) === String(id)) : null;
        if (teacherData) {
            setFullName(teacherData.fullName || '');
            setSavedName(teacherData.fullName || '');
            setPosition(teacherData.position || '');
            setCurrentImage(teacherData.TeacherImage || null);
        }
    }, [fetchTeacher, id])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        e.target.value = '';
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            ToastifyWarning({ label: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น' });
            return;
        }
        setNewImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const resetImage = () => {
        setNewImage(null)
        setPreview(null)
    }

    const handleSubmit = async (e) => {
        e?.preventDefault()
        if (!fullName.trim() || !position.trim()) {
            ToastifyWarning({ label: 'กรุณากรอกชื่อและตำแหน่งให้ครบ' });
            return;
        }
        setSaving(true)
        try {
            const menupath = Cookies.get('MenuPath')

            const formData = new FormData();
            formData.append('fullName', fullName.trim())
            formData.append('position', position.trim())
            // Without a new photo the API keeps the current one
            if (newImage) formData.append('TeacherImage', newImage)

            const response = await dispatch(EditTeacher({ formData, id }))

            if (response.payload.status === true) {
                ToastifySuccess({ label: "แก้ไขข้อมูลสำเร็จ" })
                setFullName('')
                setPosition('')
                resetImage()

                await dispatch(FetchTeacherID(id));

                navigate(menupath || LIST_PATH);
            } else {
                ToastifyError({ label: "แก้ไขข้อมูลไม่สำเร็จ" });
            }
        } catch {
            ToastifyError({ label: "เกิดข้อผิดพลาด" })
        } finally {
            setSaving(false)
        }
    }

    const shownImage = preview || fileUrl(currentImage)

    return (
        <DashMasterLayout
            title="แก้ไขข้อมูลอาจารย์"
            description={savedName || undefined}
            back={
                <Link to={LIST_PATH} className="mb-2 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700">
                    <LuArrowLeft className="h-4 w-4" /> กลับไปหน้ารายชื่ออาจารย์
                </Link>
            }
        >
            <form onSubmit={handleSubmit} noValidate className="card max-w-2xl animate-fade-up animate-once animate-duration-300 animate-ease-out">
                <div className="card-pad space-y-5">
                    <InputComponet
                        label="ชื่อ-นามสกุล"
                        value={fullName}
                        OnChange={setFullName}
                        required
                    />
                    <InputComponet
                        label="ตำแหน่ง"
                        value={position}
                        OnChange={setPosition}
                        required
                    />
                    <div>
                        <span className="label">รูปภาพ</span>
                        <div className="flex items-stretch gap-4 sm:flex-col">
                            <div className="flex shrink-0 flex-col items-center gap-2">
                                {shownImage ? (
                                    <img src={shownImage} alt={preview ? 'รูปใหม่ที่เลือก' : 'รูปปัจจุบัน'} className="h-32 w-32 rounded-xl object-cover ring-1 ring-ink-200" />
                                ) : (
                                    <span className="flex h-32 w-32 items-center justify-center rounded-xl bg-ink-100 text-ink-400">
                                        <LuUser className="h-10 w-10" />
                                    </span>
                                )}
                                <span className="text-xs text-ink-500">{preview ? 'รูปใหม่ (ยังไม่บันทึก)' : 'รูปปัจจุบัน'}</span>
                            </div>
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                                <label htmlFor="edit-teacher-file" className="file-drop flex-1">
                                    <LuImagePlus className="h-7 w-7 text-ink-400" />
                                    <span><span className="font-medium text-brand-700">เลือกรูปใหม่</span> เพื่อเปลี่ยนรูป</span>
                                    <span className="text-xs text-ink-400">ไม่เลือกก็ได้ ระบบจะใช้รูปเดิม</span>
                                    <input id="edit-teacher-file" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                </label>
                                {preview && (
                                    <button type="button" onClick={resetImage} className="btn-ghost btn-sm self-start">
                                        <LuRotateCcw className="h-4 w-4" /> ใช้รูปเดิม
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-ink-200 px-5 py-4 md:px-4">
                    <Link to={LIST_PATH} className="btn-secondary">ยกเลิก</Link>
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'กำลังบันทึก…' : 'บันทึก'}
                    </button>
                </div>
            </form>
        </DashMasterLayout>
    )
}

export default EditEeacher
