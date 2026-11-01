import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import DashMasterLayout from '../../layouts/master'
import { createEquipment, fetchEquipment, deleteEquipment } from '../../../../slicers/equipmentSlicer'
import { useDispatch, useSelector } from 'react-redux'
import InputComponet from '../../../../components/content-input/input-full';
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify';
import { Link } from 'react-router-dom'
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal';
import Modal from '../../../../components/content-alert/Modal';
import { fileUrl } from '../../../../hooks/fileUrl';
import { LuImagePlus, LuMonitor, LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu';

const toQty = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
};

/** 48px thumbnail; opens the larger view when clicked. */
const Thumb = ({ item, onOpen }) => (
    item.image ? (
        <button
            type="button"
            onClick={() => onOpen(item)}
            className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-ink-50 ring-1 ring-inset ring-ink-200 transition hover:ring-brand-300"
            aria-label={`ดูรูป ${item.name}`}
            title="ดูรูปขนาดใหญ่"
        >
            <img src={fileUrl(item.image)} alt="" className="h-full w-full object-cover" loading="lazy" />
        </button>
    ) : (
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-ink-50 text-ink-300 ring-1 ring-inset ring-ink-200" aria-hidden="true">
            <LuMonitor className="h-5 w-5" />
        </span>
    )
);

const RowActions = ({ item, onDelete }) => (
    <div className="flex justify-end gap-1">
        <Link
            to={`/editEquipment/${item.id}`}
            className="icon-btn-brand"
            aria-label={`แก้ไข ${item.name}`}
            title="แก้ไขอุปกรณ์"
        >
            <LuPencil className="h-[18px] w-[18px]" />
        </Link>
        <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="icon-btn-danger"
            aria-label={`ลบ ${item.name}`}
            title="ลบอุปกรณ์"
        >
            <LuTrash2 className="h-[18px] w-[18px]" />
        </button>
    </div>
);

const itemShape = PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), name: PropTypes.string, image: PropTypes.string });
Thumb.propTypes = { item: itemShape.isRequired, onOpen: PropTypes.func };
RowActions.propTypes = { item: itemShape.isRequired, onDelete: PropTypes.func };

const ViewManageEquipment = () => {
    const dispatch = useDispatch()
    const [isOpenModelCreate, setIsOpenModelCreate] = useState(false)
    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [id, setId] = useState('')
    const [zoomItem, setZoomItem] = useState(null)
    const [isOpenModelDelete, setIsOpemModelDelete] = useState(false)
    const [saving, setSaving] = useState(false)
    const EquipmentData = useSelector((state) => state.equipment.equipnent)

    useEffect(() => {
        dispatch(fetchEquipment())
    }, [dispatch])

    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

    const items = Array.isArray(EquipmentData) ? [...EquipmentData].sort((a, b) => a.id - b.id) : []
    const totalQty = items.reduce((sum, item) => sum + (toQty(item.number) ?? 0), 0)

    const closeCreate = () => {
        setIsOpenModelCreate(false)
        setName('')
        setNumber('')
        setImage(null)
        setPreview(null)
    }

    const handleCreate = async (event) => {
        event.preventDefault()
        // Both fields are required (was `!name && !number`, which let one of them be empty)
        if (!name.trim() || number === '') {
            ToastifyWarning({ label: 'กรุณากรอกชื่ออุปกรณ์และจำนวนให้ครบ' })
            return;
        }
        const qty = toQty(number)
        if (qty === null || qty < 0 || !Number.isInteger(qty)) {
            ToastifyWarning({ label: 'จำนวนต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป' })
            return;
        }
        setSaving(true)
        try {
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('number', String(qty));
            if (image) formData.append('image', image)

            const response = await dispatch(createEquipment(formData))
            if (response.payload.status === true) {
                ToastifySuccess({ label: 'เพิ่มอุปกรณ์สำเร็จ' })
                closeCreate()
                await dispatch(fetchEquipment())
            } else {
                ToastifyWarning({ label: 'เพิ่มอุปกรณ์ไม่สำเร็จ' })
            }
        } catch {
            ToastifyError({ label: 'เกิดข้อผิดพลาด' })
        } finally {
            setSaving(false)
        }
    }

    const handleIamgeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                ToastifyWarning({ label: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น' })
                return;
            }
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    };

    const handleOpenModelDelete = (itemId) => {
        setId(itemId)
        setIsOpemModelDelete(true)
    }

    const handleDelete = async () => {
        try {
            if (!id) {
                throw new Error('ไม่พบ ID ของอุปกรณ์ที่ต้องการลบ')
            }
            const response = await dispatch(deleteEquipment(id))
            if (response.payload.status === true) {
                ToastifySuccess({ label: 'ลบอุปกรณ์สำเร็จ' })
                setId('')
                setIsOpemModelDelete(false)
                await dispatch(fetchEquipment())
            } else {
                ToastifyWarning({ label: 'ลบอุปกรณ์ไม่สำเร็จ' })
            }
        } catch {
            ToastifyError({ label: 'เกิดข้อผิดพลาด' })
        }
    }

    const addButton = (
        <button type="button" onClick={() => setIsOpenModelCreate(true)} className="btn-primary">
            <LuPlus className="h-4 w-4" /> เพิ่มอุปกรณ์
        </button>
    )

    return (
        <DashMasterLayout
            title="จัดการอุปกรณ์"
            description={`ทั้งหมด ${items.length.toLocaleString('th-TH')} รายการ · รวม ${totalQty.toLocaleString('th-TH')} ชิ้น`}
            actions={addButton}
        >
            <section className="card animate-fade-up animate-once animate-duration-300 animate-ease-out">
                {items.length === 0 ? (
                    <div className="empty-state">
                        <LuMonitor className="h-8 w-8 text-ink-300" />
                        <p className="font-medium text-ink-700">ยังไม่มีอุปกรณ์ในแผนก</p>
                        <p>เพิ่มรายการอุปกรณ์พร้อมจำนวนและรูปภาพ</p>
                        <div className="mt-2">{addButton}</div>
                    </div>
                ) : (
                    <>
                        {/* Table: tablet and up */}
                        <div className="table-wrap md:hidden">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th className="w-14 text-right">ลำดับ</th>
                                        <th className="w-20">รูปภาพ</th>
                                        <th>รายการ</th>
                                        <th className="text-right">จำนวน</th>
                                        <th className="w-28 text-right">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="num text-right text-ink-500">{index + 1}</td>
                                            <td className="py-2"><Thumb item={item} onOpen={setZoomItem} /></td>
                                            <td className="font-medium text-ink-900">{item.name}</td>
                                            <td className="num whitespace-nowrap text-right">
                                                {toQty(item.number)?.toLocaleString('th-TH') ?? item.number}
                                                <span className="ml-1 text-ink-500">ชิ้น</span>
                                            </td>
                                            <td className="py-2"><RowActions item={item} onDelete={handleOpenModelDelete} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* List: phones */}
                        <ul className="hidden divide-y divide-ink-100 md:block">
                            {items.map((item) => (
                                <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                                    <Thumb item={item} onOpen={setZoomItem} />
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-ink-900">{item.name}</p>
                                        <p className="num text-sm text-ink-500">
                                            {toQty(item.number)?.toLocaleString('th-TH') ?? item.number} ชิ้น
                                        </p>
                                    </div>
                                    <RowActions item={item} onDelete={handleOpenModelDelete} />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </section>

            {/* Create */}
            <Modal
                isOpen={isOpenModelCreate}
                onClose={closeCreate}
                title="เพิ่มอุปกรณ์"
                description="ระบุชื่อ จำนวน และรูปภาพของอุปกรณ์"
                footer={
                    <>
                        <button type="button" className="btn-secondary" onClick={closeCreate}>ยกเลิก</button>
                        <button type="submit" form="create-equipment-form" className="btn-primary" disabled={saving}>
                            {saving ? 'กำลังบันทึก…' : 'บันทึก'}
                        </button>
                    </>
                }
            >
                <form id="create-equipment-form" onSubmit={handleCreate} noValidate className="space-y-4">
                    <div className="grid grid-cols-[minmax(0,1fr)_140px] gap-4 sm:grid-cols-1">
                        <InputComponet
                            label="ชื่ออุปกรณ์"
                            value={name}
                            OnChange={(value) => setName(value)}
                            placeholder="เช่น โปรเจกเตอร์"
                            required
                        />
                        <div>
                            <label htmlFor="create-equipment-qty" className="label">
                                จำนวน (ชิ้น)<span className="ml-0.5 text-red-600" aria-hidden="true">*</span>
                            </label>
                            <input
                                id="create-equipment-qty"
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
                        <label htmlFor="create-equipment-image" className={`file-drop ${preview ? 'p-2' : ''}`}>
                            {preview ? (
                                <>
                                    <img src={preview} alt="ตัวอย่างรูปที่เลือก" className="max-h-56 w-full rounded-md bg-white object-contain" />
                                    <span className="text-[13px]">คลิกเพื่อเลือกรูปอื่น</span>
                                </>
                            ) : (
                                <>
                                    <LuImagePlus className="h-7 w-7 text-ink-400" />
                                    <span className="font-medium text-ink-700">คลิกเพื่อเลือกรูปภาพ</span>
                                    <span className="text-[13px]">ไฟล์ PNG หรือ JPG</span>
                                </>
                            )}
                            <input
                                type="file"
                                id="create-equipment-image"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleIamgeChange}
                            />
                        </label>
                    </div>
                </form>
            </Modal>

            {/* Larger image */}
            <Modal
                isOpen={Boolean(zoomItem)}
                onClose={() => setZoomItem(null)}
                title={zoomItem?.name}
                description={zoomItem ? `จำนวน ${zoomItem.number} ชิ้น` : undefined}
                size="lg"
            >
                {zoomItem?.image && (
                    <img
                        src={fileUrl(zoomItem.image)}
                        alt={zoomItem.name}
                        className="max-h-[60vh] w-full rounded-lg bg-ink-50 object-contain"
                    />
                )}
            </Modal>

            <ConfirmDeleteModal
                isOpen={isOpenModelDelete}
                onClose={() => setIsOpemModelDelete(false)}
                onConfirm={handleDelete}
                title="ลบอุปกรณ์"
                message="ลบแล้วจะกู้คืนไม่ได้ ต้องการลบอุปกรณ์รายการนี้ใช่ไหม?"
            />
        </DashMasterLayout>
    )
}

export default ViewManageEquipment
