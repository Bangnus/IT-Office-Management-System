import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import DashMasterLayout from '../../layouts/master'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchleaveTeacherID, CreateLeaveTeacher, deleteLeave } from '../../../../slicers/leaveteacherSlicer'
import { FetchTeacher } from '../../../../slicers/teacherSlicer'
import InputComponet from '../../../../components/content-input/input-full'
import Modal from '../../../../components/content-alert/Modal'
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify'
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal'
import { LuArrowLeft, LuCalendarDays, LuCalendarOff, LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu'

/** "2026-10-06" -> "6 ต.ค. 2569"; falls back to the raw value if it is not a valid date. */
const thaiDate = (d) => {
    if (!d) return '-';
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return d;
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
};

const RowActions = ({ leave, onDelete }) => (
    <div className="flex items-center justify-end gap-1">
        <Link to={`/editLeave/${leave.id}`} className="icon-btn-brand" aria-label="แก้ไข" title="แก้ไข">
            <LuPencil className="h-[18px] w-[18px]" />
        </Link>
        <button type="button" className="icon-btn-danger" aria-label="ลบ" title="ลบ" onClick={() => onDelete(leave.id)}>
            <LuTrash2 className="h-[18px] w-[18px]" />
        </button>
    </div>
);

RowActions.propTypes = { leave: PropTypes.object.isRequired, onDelete: PropTypes.func.isRequired };

const LeaveTeacher = () => {
    const dispatch = useDispatch()
    const { id } = useParams()
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [teacherID, setTeacherID] = useState(id)
    const [leaveID, setLeaveID] = useState('')
    const [isOpenModel, setIsOpenModel] = useState(false)
    const [isOpenModelDelete, setIsOpenModelDelete] = useState(false)
    const [saving, setSaving] = useState(false)

    const fetchleaveData = useSelector((state) => state.leave.leave)
    const loading = useSelector((state) => state.leave.loading)
    const teacherData = useSelector((state) => state.teacher.teacher)

    const teacher = Array.isArray(teacherData) ? teacherData.find((t) => String(t.id) === String(id)) : null

    useEffect(() => {
        dispatch(fetchleaveTeacherID(id))
    }, [dispatch, id])

    // Teacher name for the header: use the list already in the store, otherwise load it
    useEffect(() => {
        if (!teacher) dispatch(FetchTeacher())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, id])

    // The store can briefly hold a single record (after create, or coming back from the edit page)
    const leaves = useMemo(
        () => (Array.isArray(fetchleaveData) ? fetchleaveData.filter((l) => String(l.teacherID) === String(id)) : []),
        [fetchleaveData, id]
    )

    const handleCreate = async (e) => {
        e?.preventDefault()
        if (!description.trim() || !date || !teacherID) {
            ToastifyWarning({ label: "กรุณากรอกเหตุผลและวันที่ลาให้ครบ" });
            return;
        }
        setSaving(true)
        try {
            const data = {
                description: description.trim(),
                date,
                teacherID
            }
            const response = await dispatch(CreateLeaveTeacher(data))
            if (response.payload.status === true) {
                ToastifySuccess({ label: "เพิ่มข้อมูลสำเร็จ" })
                setDescription('')
                setDate('')
                setTeacherID(id)
                setIsOpenModel(false)
                await dispatch(fetchleaveTeacherID(id))
            } else {
                ToastifyWarning({ label: "เพิ่มข้อมูลไม่สำเร็จ" });
            }
        } catch {
            ToastifyError({ label: "เกิดข้อผิดพลาด" })
        } finally {
            setSaving(false)
        }
    }

    const handleOpenModelDelete = (id) => {
        setLeaveID(id)
        setIsOpenModelDelete(true)
    }
    const handleDelete = async () => {
        try {
            if (!leaveID) {
                throw new Error('ไม่พบ ID ที่ต้องการลบ')
            }
            const response = await dispatch(deleteLeave(leaveID))

            if (response.payload.status === true) {
                ToastifySuccess({ label: "ลบข้อมูลสำเร็จ" })
                setLeaveID('')
                setIsOpenModelDelete(false)
                await dispatch(fetchleaveTeacherID(id))
            } else {
                ToastifyWarning({ label: "ลบข้อมูลไม่สำเร็จ" });
            }
        } catch {
            ToastifyError({ label: "เกิดข้อผิดพลาด" })
        }
    }

    const createButton = (
        <button type="button" onClick={() => setIsOpenModel(true)} className="btn-primary">
            <LuPlus className="h-4 w-4" />
            เพิ่มการลา
        </button>
    )

    const subtitle = [teacher?.position, `ลาทั้งหมด ${leaves.length} ครั้ง`].filter(Boolean).join(' · ')

    return (
        <DashMasterLayout
            title={teacher?.fullName ? `ประวัติการลาของ ${teacher.fullName}` : 'ประวัติการลา'}
            description={subtitle}
            actions={createButton}
            back={
                <Link to="/home/teacher" className="mb-2 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700">
                    <LuArrowLeft className="h-4 w-4" /> กลับไปหน้ารายชื่ออาจารย์
                </Link>
            }
        >
            <div className="card animate-fade-up animate-once animate-duration-300 animate-ease-out">
                {leaves.length === 0 ? (
                    loading ? (
                        <div className="empty-state">กำลังโหลดข้อมูล…</div>
                    ) : (
                        <div className="empty-state">
                            <LuCalendarOff className="h-10 w-10 text-ink-300" />
                            <p className="text-base font-medium text-ink-700">ยังไม่มีประวัติการลา</p>
                            <p>เมื่ออาจารย์ขอลา ให้บันทึกเหตุผลและวันที่ลาไว้ที่นี่</p>
                            <div className="mt-2">{createButton}</div>
                        </div>
                    )
                ) : (
                    <>
                        {/* Tablet / desktop: table */}
                        <div className="table-wrap md:hidden">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th className="w-16">ลำดับ</th>
                                        <th>เหตุผลในการลา</th>
                                        <th className="w-44">วันที่ลา</th>
                                        <th className="w-28 text-right">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaves.map((data, index) => (
                                        <tr key={data.id}>
                                            <td className="num text-ink-500">{index + 1}</td>
                                            <td className="font-medium text-ink-900">{data.description || '-'}</td>
                                            <td className="num whitespace-nowrap text-ink-600">{thaiDate(data.date)}</td>
                                            <td><RowActions leave={data} onDelete={handleOpenModelDelete} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Phones: stacked list */}
                        <ul className="hidden divide-y divide-ink-100 md:block">
                            {leaves.map((data) => (
                                <li key={data.id} className="flex items-center gap-3 px-4 py-3">
                                    <div className="min-w-0 flex-1">
                                        <p className="break-words font-medium leading-snug text-ink-900">{data.description || '-'}</p>
                                        <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-ink-500">
                                            <LuCalendarDays className="h-4 w-4" />
                                            <span className="num">{thaiDate(data.date)}</span>
                                        </p>
                                    </div>
                                    <RowActions leave={data} onDelete={handleOpenModelDelete} />
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>

            {/* modelCreate */}
            <Modal
                isOpen={isOpenModel}
                onClose={() => setIsOpenModel(false)}
                title="เพิ่มการลา"
                description={teacher?.fullName ? `บันทึกการลาของ ${teacher.fullName}` : 'บันทึกเหตุผลและวันที่ลา'}
                footer={
                    <>
                        <button type="button" className="btn-secondary" onClick={() => setIsOpenModel(false)}>ยกเลิก</button>
                        <button type="submit" form="create-leave-form" className="btn-primary" disabled={saving}>
                            {saving ? 'กำลังบันทึก…' : 'บันทึก'}
                        </button>
                    </>
                }
            >
                <form id="create-leave-form" onSubmit={handleCreate} className="space-y-4" noValidate>
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
                </form>
            </Modal>

            <ConfirmDeleteModal
                isOpen={isOpenModelDelete}
                onClose={() => setIsOpenModelDelete(false)}
                onConfirm={handleDelete}
                title="ลบประวัติการลา"
                message="ลบแล้วจะกู้คืนไม่ได้ ต้องการลบรายการนี้ใช่ไหม?"
            />
        </DashMasterLayout>
    )
}

export default LeaveTeacher
