import { useEffect, useId, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { LuChevronDown, LuGraduationCap, LuInbox, LuPencil, LuPlus, LuTrash2 } from 'react-icons/lu';
import DashMasterLayout from '../../layouts/master';
import { fetchclassVC, fetchClassRoom, createClassRoom, deleteClassRoom } from '../../../../slicers/classSlicer';
import InputComponet from '../../../../components/content-input/input-full';
import Modal from '../../../../components/content-alert/Modal';
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal';
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify';
import { CLASS_LEVELS, byThaiName } from './classLevels';

/** One year group (e.g. "ปวช.1") as a collapsible card listing its classes. */
const YearGroupCard = ({ group, classes, open, onToggle, onAdd, onDelete, editState }) => {
    const bodyId = useId();
    return (
        <section className="card overflow-hidden">
            <h2>
                <button
                    type="button"
                    onClick={onToggle}
                    aria-expanded={open}
                    aria-controls={bodyId}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-ink-50 md:px-4"
                >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                        <LuGraduationCap className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-base font-semibold text-ink-900">{group.classroom}</span>
                    <span className="badge-neutral num">{classes.length} ห้อง</span>
                    <LuChevronDown className={`h-5 w-5 shrink-0 text-ink-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                </button>
            </h2>

            {open && (
                <div id={bodyId} className="border-t border-ink-200">
                    {classes.length > 0 ? (
                        <ul className="divide-y divide-ink-100">
                            {classes.map((room) => (
                                <li key={room.id} className="flex items-center gap-2 px-5 py-2.5 transition-colors hover:bg-ink-50 md:px-4">
                                    <Link
                                        to={`/class/student/${room.id}`}
                                        onClick={() => Cookies.set('StudentPath', `/class/student/${room.id}`)}
                                        className="group min-w-0 flex-1 py-1"
                                    >
                                        <span className="block truncate font-medium text-ink-900 group-hover:text-brand-700">{room.className}</span>
                                        <span className="block truncate text-[13px] text-ink-500">
                                            {room.advisor ? `ที่ปรึกษา: ${room.advisor}` : 'ยังไม่ระบุอาจารย์ที่ปรึกษา'}
                                        </span>
                                    </Link>
                                    <Link
                                        to={`/editingClassRoom/${room.id}`}
                                        state={editState}
                                        className="icon-btn-brand"
                                        aria-label={`แก้ไขห้อง ${room.className}`}
                                        title="แก้ไขห้องเรียน"
                                    >
                                        <LuPencil className="h-[18px] w-[18px]" />
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(room)}
                                        className="icon-btn-danger"
                                        aria-label={`ลบห้อง ${room.className}`}
                                        title="ลบห้องเรียน"
                                    >
                                        <LuTrash2 className="h-[18px] w-[18px]" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="flex items-center justify-center gap-2 px-5 py-6 text-sm text-ink-500">
                            <LuInbox className="h-4 w-4" /> ยังไม่มีห้องเรียนใน {group.classroom}
                        </p>
                    )}
                    <div className="border-t border-ink-100 px-3 py-2">
                        <button type="button" onClick={onAdd} className="btn-ghost btn-sm text-brand-700 hover:text-brand-800">
                            <LuPlus className="h-4 w-4" /> เพิ่มห้องเรียน
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

YearGroupCard.propTypes = {
    group: PropTypes.object.isRequired,
    classes: PropTypes.array.isRequired,
    open: PropTypes.bool,
    onToggle: PropTypes.func,
    onAdd: PropTypes.func,
    onDelete: PropTypes.func,
    editState: PropTypes.object,
};

/**
 * Year groups of one study level (ปวช. / ปวส. / ป.ตรี) with their classes.
 * Shared by the three pages /home/Vocational-Certificate, /home/Higher-Vocational-Certificate and /home/Bachelors-Degree.
 */
const ClassLevelView = ({ level }) => {
    const { match, label } = CLASS_LEVELS[level];
    const dispatch = useDispatch();
    const location = useLocation();
    const yearGroups = useSelector((state) => state.class.class);
    const classrooms = useSelector((state) => state.class.classroom);

    const [loaded, setLoaded] = useState(false);
    const [closed, setClosed] = useState(() => new Set()); // all groups start open
    const [addTo, setAddTo] = useState(null); // year group the add-class modal is for
    const [className, setClassName] = useState('');
    const [advisor, setAdvisor] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        Promise.all([dispatch(fetchclassVC()), dispatch(fetchClassRoom())]).finally(() => setLoaded(true));
    }, [dispatch]);

    const groups = Array.isArray(yearGroups)
        ? yearGroups.filter((g) => g.classroom && g.classroom.includes(match)).sort((a, b) => byThaiName(a.classroom, b.classroom))
        : [];
    const classesOf = (groupId) =>
        (Array.isArray(classrooms) ? classrooms : [])
            .filter((room) => room.vcID === groupId)
            .sort((a, b) => byThaiName(a.className, b.className));

    const toggle = (id) =>
        setClosed((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });

    const openAdd = (group) => {
        setClassName('');
        setAdvisor('');
        setAddTo(group);
    };
    const closeAdd = () => !isSaving && setAddTo(null);

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!className.trim()) {
            ToastifyWarning({ lable: 'กรุณากรอกชื่อห้อง' });
            return;
        }
        try {
            setIsSaving(true);
            const response = await dispatch(createClassRoom({ className: className.trim(), vcID: addTo.id, advisor: advisor.trim() }));
            if (response.payload?.status === true) {
                ToastifySuccess({ lable: 'สร้างห้องสำเร็จ' });
                setAddTo(null);
                await dispatch(fetchclassVC());
                await dispatch(fetchClassRoom());
            } else {
                ToastifyError({ lable: 'สร้างห้องไม่สำเร็จ' });
            }
        } catch {
            ToastifyError({ lable: 'เกิดข้อผิดพลาด' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await dispatch(deleteClassRoom(deleting.id));
            if (response.payload?.status === true) {
                ToastifySuccess({ lable: 'ลบสำเร็จ' });
                setDeleting(null);
                await dispatch(fetchClassRoom());
            } else {
                ToastifyError({ lable: 'ลบไม่สำเร็จ' });
            }
        } catch {
            ToastifyError({ lable: 'เกิดข้อผิดพลาด' });
        }
    };

    return (
        <DashMasterLayout title={`นักเรียน ${label}`} description="เลือกห้องเพื่อดูรายชื่อนักเรียน">
            <div className="animate-fade-up animate-duration-300 animate-ease-out">
                {!loaded && groups.length === 0 ? (
                    <div className="card empty-state">กำลังโหลดข้อมูล…</div>
                ) : groups.length === 0 ? (
                    <div className="card empty-state">
                        <LuGraduationCap className="h-8 w-8 text-ink-400" />
                        <p>ยังไม่มีระดับชั้น {label} ในระบบ</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 items-start gap-5 lg:grid-cols-1 md:gap-4">
                        {groups.map((group) => (
                            <YearGroupCard
                                key={group.id}
                                group={group}
                                classes={classesOf(group.id)}
                                open={!closed.has(group.id)}
                                onToggle={() => toggle(group.id)}
                                onAdd={() => openAdd(group)}
                                onDelete={setDeleting}
                                editState={{ from: location.pathname }}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal
                isOpen={addTo !== null}
                onClose={closeAdd}
                title="เพิ่มห้องเรียน"
                description={addTo ? `ห้องใหม่จะอยู่ในระดับชั้น ${addTo.classroom}` : undefined}
            >
                <form onSubmit={handleCreateClass} className="space-y-4" noValidate>
                    <InputComponet
                        label="ชื่อห้อง"
                        value={className}
                        OnChange={setClassName}
                        placeholder={addTo ? `เช่น ${addTo.classroom}/${classesOf(addTo.id).length + 1}` : ''}
                        required
                    />
                    <InputComponet label="อาจารย์ที่ปรึกษา" value={advisor} OnChange={setAdvisor} placeholder="ชื่อ-นามสกุล" />
                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={closeAdd} className="btn-secondary">ยกเลิก</button>
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
                title="ลบห้องเรียน"
                message={deleting ? `ลบห้อง ${deleting.className} แล้วจะกู้คืนไม่ได้ ต้องการลบใช่ไหม?` : undefined}
            />
        </DashMasterLayout>
    );
};

ClassLevelView.propTypes = {
    level: PropTypes.oneOf(Object.keys(CLASS_LEVELS)).isRequired,
};

export default ClassLevelView;
