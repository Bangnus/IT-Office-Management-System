import { useEffect, useState } from 'react'
import DashMasterLayout from '../../layouts/master'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { editEquipment, fetchEquipmentID } from '../../../../slicers/equipmentSlicer'
import InputComponet from '../../../../components/content-input/input-full'
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify'
import { fileUrl } from '../../../../hooks/fileUrl'
import { LuArrowLeft, LuImagePlus, LuMonitor } from 'react-icons/lu'

const LIST_PATH = '/home/manage-equipment'

const EditEquipment = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [currentImage, setCurrentImage] = useState(null) // stored path, e.g. "uploads/123.png"
    const [image, setImage] = useState(null) // newly picked File
    const [preview, setPreview] = useState(null)
    const [saving, setSaving] = useState(false)

    const EquipmentData = useSelector((state) => state.equipment.equipnent)

    useEffect(() => {
        dispatch(fetchEquipmentID(id))
    }, [dispatch, id])

    useEffect(() => {
        if (EquipmentData && EquipmentData.length > 0) {
            // The slice is shared with the list page, so pick this item by id
            const equipmentdata = EquipmentData.find((e) => String(e.id) === String(id))
            if (!equipmentdata) return
            setName(equipmentdata.name || '')
            setNumber(equipmentdata.number ?? '')
            setCurrentImage(equipmentdata.image || null)
        }
    }, [EquipmentData, id])

    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return
        if (!file.type.startsWith('image/')) {
            ToastifyWarning({ label: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น' })
            return
        }
        setImage(file);
        setPreview(URL.createObjectURL(file))
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!name.trim() || String(number).trim() === '') {
            ToastifyWarning({ label: 'กรุณากรอกชื่ออุปกรณ์และจำนวนให้ครบ' })
            return
        }
        const qty = Number(number)
        if (!Number.isInteger(qty) || qty < 0) {
            ToastifyWarning({ label: 'จำนวนต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป' })
            return
        }
        setSaving(true)
        try {
            const formData = new FormData();
            formData.append('name', name.trim())
            formData.append('number', String(qty))

            // Only send an image when a new one was picked; the API keeps the current image otherwise
            if (image) formData.append('image', image)

            const response = await dispatch(editEquipment({ formData, id }))
            if (response.payload.status === true) {
                ToastifySuccess({ label: 'แก้ไขข้อมูลอุปกรณ์สำเร็จ' })
                navigate(LIST_PATH);
            } else {
                ToastifyWarning({ label: 'แก้ไขข้อมูลไม่สำเร็จ' })
            }
        } catch {
            ToastifyError({ label: 'เกิดข้อผิดพลาด' })
        } finally {
            setSaving(false)
        }
    }

    const shownImage = preview || fileUrl(currentImage)

    return (
        <DashMasterLayout
            title="แก้ไขอุปกรณ์"
            description="แก้ไขชื่อ จำนวน หรือเปลี่ยนรูปภาพ"
            back={
                <Link to={LIST_PATH} className="mb-2 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700">
                    <LuArrowLeft className="h-4 w-4" /> กลับไปหน้าจัดการอุปกรณ์
                </Link>
            }
        >
            <form onSubmit={handleSubmit} noValidate className="card max-w-2xl animate-fade-up animate-once animate-duration-300 animate-ease-out">
                <div className="card-pad space-y-4">
                    <div className="grid grid-cols-[minmax(0,1fr)_160px] gap-4 sm:grid-cols-1">
                        <InputComponet
                            label="ชื่ออุปกรณ์"
                            value={name}
                            OnChange={(value) => setName(value)}
                            required
                        />
                        <div>
                            <label htmlFor="edit-equipment-qty" className="label">
                                จำนวน (ชิ้น)<span className="ml-0.5 text-red-600" aria-hidden="true">*</span>
                            </label>
                            <input
                                id="edit-equipment-qty"
                                type="number"
                                min="0"
                                step="1"
                                inputMode="numeric"
                                className="field num"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <span className="label">รูปภาพ</span>
                        <div className="flex items-stretch gap-4 sm:flex-col">
                            <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-50 ring-1 ring-inset ring-ink-200 sm:h-44 sm:w-full">
                                {shownImage ? (
                                    <img src={shownImage} alt={preview ? 'รูปใหม่ที่เลือก' : `รูปปัจจุบันของ ${name}`} className="h-full w-full object-contain" />
                                ) : (
                                    <LuMonitor className="h-8 w-8 text-ink-300" aria-hidden="true" />
                                )}
                            </div>
                            <label htmlFor="edit-equipment-image" className="file-drop flex-1">
                                <LuImagePlus className="h-6 w-6 text-ink-400" />
                                <span className="font-medium text-ink-700">{preview ? 'เลือกรูปอื่น' : 'เลือกรูปใหม่เพื่อแทนที่'}</span>
                                <span className="text-[13px]">
                                    {preview ? image?.name : 'ไม่เลือกก็ได้ ระบบจะใช้รูปเดิม'}
                                </span>
                                <input
                                    type="file"
                                    id="edit-equipment-image"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 border-t border-ink-200 px-5 py-4 md:px-4">
                    <button type="button" className="btn-secondary" onClick={() => navigate(LIST_PATH)}>ยกเลิก</button>
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'กำลังบันทึก…' : 'บันทึก'}
                    </button>
                </div>
            </form>
        </DashMasterLayout>
    )
}

export default EditEquipment
