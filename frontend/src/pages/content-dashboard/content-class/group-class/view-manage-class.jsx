import { useEffect, useId, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LuBuilding2, LuDoorOpen, LuPlus, LuTrash2 } from 'react-icons/lu';
import DashMasterLayout from '../../layouts/master';
import { fetchClassroom, deleteClassroom, createClassroom } from '../../../../slicers/classroomSlicer';
import Modal from '../../../../components/content-alert/Modal';
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal';
import InputComponet from '../../../../components/content-input/input-full';
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify';
import { byThaiName } from './classLevels';

// "IT-321 ห้องปฏิบัติการคอมพิวเตอร์ 1" -> code "IT-321", name "ห้องปฏิบัติการคอมพิวเตอร์ 1"
const splitRoomName = (roomname = '') => {
    const m = (roomname ?? '').trim().match(/^([A-Za-z0-9][A-Za-z0-9./-]*)\s+(.+)$/);
    return m && /\d/.test(m[1]) ? { code: m[1], name: m[2] } : { code: roomname || 'ไม่มีชื่อห้อง', name: '' };
};

const ViewManageClass = () => {
    const dispatch = useDispatch();
    const fieldId = useId();
    const rooms = useSelector((state) => state.classroom.classroom);
    const [loaded, setLoaded] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [roomID, setRoomID] = useState('');
    const [roomname, setRoomname] = useState('');
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        dispatch(fetchClassroom()).finally(() => setLoaded(true));
    }, [dispatch]);

    // Group rooms by roomID (building / floor)
    const list = Array.isArray(rooms) ? rooms : [];
    const grouped = Object.entries(
        list.reduce((acc, room) => {
            const key = room.roomID || 'ไม่ระบุอาคาร';
            (acc[key] ||= []).push(room);
            return acc;
        }, {})
    )
        .sort(([a], [b]) => byThaiName(a, b))
        .map(([key, items]) => [key, [...items].sort((a, b) => byThaiName(a.roomname, b.roomname))]);

    const openCreate = (presetRoomID = '') => {
        setRoomID(presetRoomID);
        setRoomname('');
        setIsCreateOpen(true);
    };
    const closeCreate = () => !isSaving && setIsCreateOpen(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!roomID.trim() || !roomname.trim()) {
            ToastifyWarning({ lable: 'กรุณากรอกอาคาร/ชั้น และชื่อห้องให้ครบ' });
            return;
        }
        try {
            setIsSaving(true);
            const response = await dispatch(createClassroom({ roomID: roomID.trim(), roomname: roomname.trim() }));
            if (response.payload?.status === true) {
                ToastifySuccess({ lable: 'เพิ่มห้องสำเร็จ' });
                setIsCreateOpen(false);
                await dispatch(fetchClassroom());
            } else {
                ToastifyWarning({ lable: 'เพิ่มห้องไม่สำเร็จ' });
            }
        } catch {
            ToastifyError({ lable: 'เกิดข้อผิดพลาด' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await dispatch(deleteClassroom(deleting.id));
            if (response.payload?.status === true) {
                ToastifySuccess({ lable: 'ลบห้องสำเร็จ' });
                setDeleting(null);
                await dispatch(fetchClassroom());
            } else {
                ToastifyWarning({ lable: 'ลบห้องไม่สำเร็จ' });
            }
        } catch {
            ToastifyError({ lable: 'เกิดข้อผิดพลาด' });
        }
    };

    return (
        <DashMasterLayout
            title="จัดการห้องเรียน"
            description={list.length > 0 ? `ห้องทั้งหมด ${list.length} ห้อง ใน ${grouped.length} อาคาร/ชั้น` : 'ห้องเรียนและห้องปฏิบัติการ แยกตามอาคารและชั้น'}
            actions={
                <button type="button" onClick={() => openCreate()} className="btn-primary">
                    <LuPlus className="h-4 w-4" /> เพิ่มห้อง
                </button>
            }
        >
            <div className="animate-fade-up animate-duration-300 animate-ease-out">
                {grouped.length === 0 ? (
                    <div className="card empty-state">
                        {loaded ? (
                            <>
                                <LuDoorOpen className="h-8 w-8 text-ink-400" />
                                <p>ยังไม่มีห้องในระบบ</p>
                                <button type="button" onClick={() => openCreate()} className="btn-primary btn-sm mt-2">
                                    <LuPlus className="h-4 w-4" /> เพิ่มห้อง
                                </button>
                            </>
                        ) : (
                            'กำลังโหลดข้อมูล…'
                        )}
                    </div>
                ) : (
                    <div className="space-y-8 md:space-y-6">
                        {grouped.map(([group, items]) => (
                            <section key={group} aria-label={group}>
                                <div className="mb-3 flex items-center gap-2">
                                    <LuBuilding2 className="h-[18px] w-[18px] shrink-0 text-ink-400" />
                                    <h2 className="min-w-0 truncate text-base font-semibold text-ink-900">{group}</h2>
                                    <span className="badge-neutral num">{items.length} ห้อง</span>
                                    <button
                                        type="button"
                                        onClick={() => openCreate(group)}
                                        className="btn-ghost btn-sm ml-auto text-brand-700 hover:text-brand-800"
                                        aria-label={`เพิ่มห้องใน ${group}`}
                                    >
                                        <LuPlus className="h-4 w-4" /> เพิ่มห้อง
                                    </button>
                                </div>
                                <ul className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-3">
                                    {items.map((room) => {
                                        const { code, name } = splitRoomName(room.roomname);
                                        return (
                                            <li key={room.id} className="card flex min-w-0 items-start gap-3 p-4">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                                                    <LuDoorOpen className="h-5 w-5" />
                                                </span>
                                                <div className="min-w-0 flex-1 pt-0.5">
                                                    <p className="break-words font-semibold leading-snug text-ink-900 [text-wrap:pretty]">{code}</p>
                                                    {name && <p className="mt-0.5 break-words text-[13px] leading-snug text-ink-500 [text-wrap:pretty]">{name}</p>}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleting(room)}
                                                    className="icon-btn-danger -mr-1.5 -mt-1.5"
                                                    aria-label={`ลบห้อง ${room.roomname}`}
                                                    title="ลบห้อง"
                                                >
                                                    <LuTrash2 className="h-[18px] w-[18px]" />
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>
                        ))}
                    </div>
                )}
            </div>

            <Modal isOpen={isCreateOpen} onClose={closeCreate} title="เพิ่มห้อง" description="ระบุอาคาร/ชั้น และชื่อห้อง">
                <form onSubmit={handleCreate} className="space-y-4" noValidate>
                    <div>
                        <label htmlFor={`${fieldId}-roomid`} className="label">
                            อาคาร / ชั้น<span className="ml-0.5 text-red-600" aria-hidden="true">*</span>
                        </label>
                        <input
                            id={`${fieldId}-roomid`}
                            className="field"
                            list={`${fieldId}-groups`}
                            value={roomID}
                            onChange={(e) => setRoomID(e.target.value)}
                            placeholder="เช่น อาคาร 3 ชั้น 2"
                            autoComplete="off"
                            required
                        />
                        <datalist id={`${fieldId}-groups`}>
                            {grouped.map(([group]) => <option key={group} value={group} />)}
                        </datalist>
                    </div>
                    <InputComponet
                        label="ชื่อห้อง"
                        value={roomname}
                        OnChange={setRoomname}
                        placeholder="เช่น IT-321 ห้องปฏิบัติการคอมพิวเตอร์ 1"
                        hint="ขึ้นต้นด้วยรหัสห้อง ตามด้วยชื่อห้อง"
                        required
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={closeCreate} className="btn-secondary">ยกเลิก</button>
                        <button type="submit" disabled={isSaving} className="btn-primary">
                            {isSaving ? 'กำลังบันทึก…' : 'บันทึก'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmDeleteModal
                isOpen={deleting !== null}
                onClose={() => setDeleting(null)}
                onConfirm={handleDelete}
                title="ลบห้อง"
                message={deleting ? `ลบห้อง ${deleting.roomname} แล้วจะกู้คืนไม่ได้ ต้องการลบใช่ไหม?` : undefined}
            />
        </DashMasterLayout>
    );
};

export default ViewManageClass;
