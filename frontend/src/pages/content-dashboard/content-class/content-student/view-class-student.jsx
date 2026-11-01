import { useEffect, useMemo, useState } from 'react';
import DashMasterLayout from '../../layouts/master';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentID, createStudent, deleteStudent } from '../../../../slicers/studentSlicer';
import { fetchImageID, uploadimage } from '../../../../slicers/imageSlicer';
import { fetchClassRoomID, fetchclassVC } from '../../../../slicers/classSlicer';
import InputComponet from '../../../../components/content-input/input-full';
import { ToastifySuccess, ToastifyError, ToastifyWarning } from '../../../../components/content-alert/toastify';
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal';
import Modal from '../../../../components/content-alert/Modal';
import { fileUrl } from '../../../../hooks/fileUrl';
import { LuArrowLeft, LuImagePlus, LuPencil, LuSearch, LuSearchX, LuTrash2, LuUpload, LuUserPlus, LuUsers } from 'react-icons/lu';

// Level pages, matched against the vc name (e.g. "ปวช.2")
const LEVELS = [
    { key: 'ปวช', path: '/home/Vocational-Certificate', label: 'นักเรียน ปวช.' },
    { key: 'ปวส', path: '/home/Higher-Vocational-Certificate', label: 'นักเรียน ปวส.' },
    { key: 'ป.ตรี', path: '/home/Bachelors-Degree', label: 'นักเรียน ป.ตรี' },
];

const backLinkClass = 'mb-2 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700';

const ViewClassStudent = () => {
    const { id } = useParams(); // id ของห้อง (classroomNumber)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [studentID, setStudentID] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [isOpenModel, setIsOpenModel] = useState(false);
    const [isOpenModelImage, setIsOpenModelImage] = useState(false);
    const [isOpenModelDelete, setIsOpenModelDelete] = useState(false);
    const [deleteID, setDeleteID] = useState('');
    const [query, setQuery] = useState('');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    // Image
    const [upImage, setUpImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const StudentData = useSelector((state) => state.student.student);
    const FetchImage = useSelector((state) => state.image.image);
    const classList = useSelector((state) => state.class.classroom);
    const vcList = useSelector((state) => state.class.class);

    useEffect(() => {
        dispatch(fetchStudentID(id));
        dispatch(fetchImageID(id));
        dispatch(fetchClassRoomID(id)); // ชื่อห้อง/อาจารย์ที่ปรึกษา แม้ห้องยังไม่มีนักเรียน
        dispatch(fetchclassVC());
    }, [dispatch, id]);

    // Only use records that belong to this class (the slices are shared with other pages)
    const students = useMemo(
        () => (Array.isArray(StudentData) ? StudentData.filter((s) => String(s.classroom) === String(id)) : []),
        [StudentData, id]
    );
    const photo = Array.isArray(FetchImage)
        ? FetchImage.find((img) => String(img.classroomNumberID) === String(id))?.image
        : null;

    const classInfo =
        students[0]?.classroomNumber ||
        (Array.isArray(classList) ? classList.find((c) => String(c.id) === String(id)) : null) ||
        null;
    const className = classInfo?.className || '';
    const advisor = classInfo?.advisor || '';
    const vcName =
        classInfo?.vc?.classroom ||
        (Array.isArray(vcList) ? vcList.find((v) => v.id === classInfo?.vcID)?.classroom : '') ||
        '';
    const level = LEVELS.find((l) => vcName.includes(l.key) || className.includes(l.key));

    const sortedStudents = useMemo(
        () => [...students].sort((a, b) => String(a.studentID ?? '').localeCompare(String(b.studentID ?? ''))),
        [students]
    );
    const q = query.trim().toLowerCase();
    const visibleStudents = q
        ? sortedStudents.filter((s) =>
            [s.studentID, s.firstname, s.lastname, `${s.firstname ?? ''} ${s.lastname ?? ''}`]
                .some((v) => String(v ?? '').toLowerCase().includes(q)))
        : sortedStudents;

    // Lock page scroll while a form dialog is open
    useEffect(() => {
        if (!isOpenModel && !isOpenModelImage) return;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [isOpenModel, isOpenModelImage]);

    // Free the preview object URL when it changes
    useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

    const closeCreate = () => {
        setIsOpenModel(false);
        setStudentID('');
        setFirstname('');
        setLastname('');
    };

    const closeUpload = () => {
        setIsOpenModelImage(false);
        setUpImage(null);
        setPreview(null);
    };

    const handleCreatetudent = async (event) => {
        event.preventDefault();
        if (!studentID.trim() || !firstname.trim() || !lastname.trim()) {
            ToastifyWarning({ label: 'กรุณากรอกรหัสนักศึกษา ชื่อ และนามสกุลให้ครบ' });
            return;
        }
        setSaving(true);
        try {
            const data = {
                studentID: studentID.trim(),
                firstname: firstname.trim(),
                lastname: lastname.trim(),
                classroom: id,
            };
            const response = await dispatch(createStudent(data));
            if (response.payload.status === true) {
                ToastifySuccess({ label: 'เพิ่มนักเรียนสำเร็จ' });
                closeCreate();
                await dispatch(fetchStudentID(id));
            } else {
                ToastifyWarning({ label: 'เพิ่มนักเรียนไม่สำเร็จ รหัสนักศึกษานี้อาจมีอยู่แล้ว' });
            }
        } catch {
            ToastifyError({ label: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล' });
        } finally {
            setSaving(false);
        }
    };

    const handleOpenModelDelete = (studentId) => {
        setDeleteID(studentId);
        setIsOpenModelDelete(true);
    };

    const handleDelete = async () => {
        try {
            if (!deleteID) {
                throw new Error('ไม่พบ ID ของนักเรียนที่ต้องการลบ');
            }
            const response = await dispatch(deleteStudent(deleteID));
            if (response.payload.status === true) {
                ToastifySuccess({ label: 'ลบข้อมูลสำเร็จ' });
                setDeleteID('');
                setIsOpenModelDelete(false);
                await dispatch(fetchStudentID(id));
            } else {
                ToastifyError({ label: 'ลบข้อมูลไม่สำเร็จ' });
            }
        } catch {
            ToastifyError({ label: 'เกิดข้อผิดพลาด' });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                ToastifyWarning({ label: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น' });
                return;
            }
            setUpImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!upImage) {
            ToastifyWarning({ label: 'กรุณาเลือกรูปภาพก่อนอัปโหลด' });
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', upImage);
            formData.append('classroomNumberID', id);

            const response = await dispatch(uploadimage(formData));
            if (response.payload.status === true) {
                ToastifySuccess({ label: 'อัปโหลดรูปห้องเรียนสำเร็จ' });
                closeUpload();
                await dispatch(fetchImageID(id));
            } else {
                ToastifyWarning({ label: 'อัปโหลดรูปภาพไม่สำเร็จ' });
            }
        } catch {
            ToastifyError({ label: 'เกิดข้อผิดพลาด' });
        } finally {
            setUploading(false);
        }
    };

    const back = level ? (
        <Link to={level.path} className={backLinkClass}>
            <LuArrowLeft className="h-4 w-4" /> กลับไปหน้า{level.label}
        </Link>
    ) : (
        <button type="button" onClick={() => navigate(-1)} className={backLinkClass}>
            <LuArrowLeft className="h-4 w-4" /> ย้อนกลับ
        </button>
    );

    const description = [
        advisor && `อาจารย์ที่ปรึกษา: ${advisor}`,
        `นักเรียน ${students.length.toLocaleString('th-TH')} คน`,
    ].filter(Boolean).join(' · ');

    const actions = (
        <>
            <button type="button" className="btn-secondary" onClick={() => setIsOpenModelImage(true)}>
                <LuImagePlus className="h-4 w-4" /> อัปโหลดรูปห้อง
            </button>
            <button type="button" className="btn-primary" onClick={() => setIsOpenModel(true)}>
                <LuUserPlus className="h-4 w-4" /> เพิ่มนักเรียน
            </button>
        </>
    );

    return (
        <DashMasterLayout
            title={className ? `ห้อง ${className}` : 'ห้องเรียน'}
            description={description}
            actions={actions}
            back={back}
        >
            <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-6 animate-fade-up animate-once animate-duration-300 animate-ease-out xl:grid-cols-[minmax(0,1fr)_280px] lg:grid-cols-1 md:gap-4">
                {/* Class photo: right column on desktop, above the list on smaller screens, side by side on tablets */}
                <aside className="card col-start-2 row-start-1 overflow-hidden lg:col-start-1">
                    {photo ? (
                        <div className="flex flex-col lg:flex-row lg:items-center sm:flex-col sm:items-stretch">
                            <img
                                src={fileUrl(photo)}
                                alt={`รูปห้องเรียน ${className}`}
                                className="aspect-[16/9] w-full bg-ink-100 object-cover lg:w-64 lg:shrink-0 sm:w-full"
                            />
                            <div className="flex items-center justify-between gap-3 px-4 py-3 lg:flex-1">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-ink-900">รูปห้องเรียน</p>
                                    <p className="text-[13px] text-ink-500">อัปโหลดรูปใหม่เพื่อแทนรูปเดิม</p>
                                </div>
                                <button type="button" className="btn-secondary btn-sm" onClick={() => setIsOpenModelImage(true)}>
                                    <LuUpload className="h-4 w-4" /> เปลี่ยนรูป
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4">
                            <button
                                type="button"
                                onClick={() => setIsOpenModelImage(true)}
                                className="file-drop aspect-[16/9] lg:aspect-auto lg:flex-row lg:gap-3 lg:py-4"
                            >
                                <LuImagePlus className="h-6 w-6 text-ink-400" />
                                <span className="lg:text-left">
                                    <span className="block font-medium text-ink-700">ยังไม่มีรูปห้องเรียน</span>
                                    <span className="block text-[13px]">คลิกเพื่ออัปโหลดรูปห้อง</span>
                                </span>
                            </button>
                        </div>
                    )}
                </aside>

                {/* Student list */}
                <section className="card col-start-1 row-start-1 min-w-0 lg:row-start-2">
                    <div className="card-head">
                        <div className="flex items-center gap-2">
                            <h2 className="card-title">รายชื่อนักเรียน</h2>
                            <span className="badge-neutral num">{students.length}</span>
                        </div>
                        {students.length > 0 && (
                            <div className="relative w-64 md:w-full">
                                <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
                                <input
                                    type="search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="ค้นหารหัสหรือชื่อนักเรียน"
                                    aria-label="ค้นหานักเรียน"
                                    className="field min-h-[38px] pl-9 text-sm"
                                />
                            </div>
                        )}
                    </div>

                    {students.length === 0 ? (
                        <div className="empty-state">
                            <LuUsers className="h-8 w-8 text-ink-300" />
                            <p className="font-medium text-ink-700">ยังไม่มีนักเรียนในห้องนี้</p>
                            <p>เพิ่มรายชื่อนักเรียนเพื่อเริ่มต้นใช้งาน</p>
                            <button type="button" className="btn-primary mt-2" onClick={() => setIsOpenModel(true)}>
                                <LuUserPlus className="h-4 w-4" /> เพิ่มนักเรียน
                            </button>
                        </div>
                    ) : visibleStudents.length === 0 ? (
                        <div className="empty-state">
                            <LuSearchX className="h-8 w-8 text-ink-300" />
                            <p>ไม่พบนักเรียนที่ตรงกับ “{query.trim()}”</p>
                            <button type="button" className="btn-ghost btn-sm" onClick={() => setQuery('')}>ล้างการค้นหา</button>
                        </div>
                    ) : (
                        <>
                        <div className="table-wrap md:hidden">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th className="w-14 text-right">ลำดับ</th>
                                        <th>รหัสนักศึกษา</th>
                                        <th>ชื่อ</th>
                                        <th>นามสกุล</th>
                                        <th className="w-28 text-right">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visibleStudents.map((student, index) => {
                                        const fullName = `${student.firstname ?? ''} ${student.lastname ?? ''}`.trim();
                                        return (
                                            <tr key={student.id}>
                                                <td className="num text-right text-ink-500">{index + 1}</td>
                                                <td className="num font-medium text-ink-900">{student.studentID}</td>
                                                <td>{student.firstname}</td>
                                                <td>{student.lastname}</td>
                                                <td className="py-2">
                                                    <div className="flex justify-end gap-1">
                                                        <Link
                                                            to={`/editStudent/${student.id}`}
                                                            className="icon-btn-brand"
                                                            aria-label={`แก้ไขข้อมูล ${fullName}`}
                                                            title="แก้ไขข้อมูล"
                                                        >
                                                            <LuPencil className="h-[18px] w-[18px]" />
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            className="icon-btn-danger"
                                                            onClick={() => handleOpenModelDelete(student.id)}
                                                            aria-label={`ลบ ${fullName}`}
                                                            title="ลบนักเรียน"
                                                        >
                                                            <LuTrash2 className="h-[18px] w-[18px]" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Phones: stacked list so the actions stay in view */}
                        <ul className="hidden divide-y divide-ink-100 md:block">
                            {visibleStudents.map((student, index) => {
                                const fullName = `${student.firstname ?? ''} ${student.lastname ?? ''}`.trim();
                                return (
                                    <li key={student.id} className="flex items-center gap-3 py-2.5 pl-4 pr-2">
                                        <span className="num w-6 shrink-0 text-right text-sm text-ink-400">{index + 1}</span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium text-ink-900">{fullName || '-'}</p>
                                            <p className="num text-[13px] text-ink-500">{student.studentID}</p>
                                        </div>
                                        <Link
                                            to={`/editStudent/${student.id}`}
                                            className="icon-btn-brand"
                                            aria-label={`แก้ไขข้อมูล ${fullName}`}
                                            title="แก้ไขข้อมูล"
                                        >
                                            <LuPencil className="h-[18px] w-[18px]" />
                                        </Link>
                                        <button
                                            type="button"
                                            className="icon-btn-danger"
                                            onClick={() => handleOpenModelDelete(student.id)}
                                            aria-label={`ลบ ${fullName}`}
                                            title="ลบนักเรียน"
                                        >
                                            <LuTrash2 className="h-[18px] w-[18px]" />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        </>
                    )}
                </section>
            </div>

            {/* Add student */}
            <Modal
                isOpen={isOpenModel}
                onClose={closeCreate}
                title="เพิ่มนักเรียน"
                description={className ? `เพิ่มเข้าห้อง ${className}` : undefined}
                footer={
                    <>
                        <button type="button" className="btn-secondary" onClick={closeCreate}>ยกเลิก</button>
                        <button type="submit" form="add-student-form" className="btn-primary" disabled={saving}>
                            {saving ? 'กำลังบันทึก…' : 'บันทึก'}
                        </button>
                    </>
                }
            >
                <form id="add-student-form" onSubmit={handleCreatetudent} className="space-y-4" noValidate>
                    <InputComponet
                        label="รหัสนักศึกษา"
                        value={studentID}
                        OnChange={(value) => setStudentID(value)}
                        inputMode="numeric"
                        placeholder="เช่น 672010001"
                        required
                    />
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                        <InputComponet label="ชื่อ" value={firstname} OnChange={(value) => setFirstname(value)} required />
                        <InputComponet label="นามสกุล" value={lastname} OnChange={(value) => setLastname(value)} required />
                    </div>
                </form>
            </Modal>

            {/* Upload class photo */}
            <Modal
                isOpen={isOpenModelImage}
                onClose={closeUpload}
                title="อัปโหลดรูปห้องเรียน"
                description={photo ? 'รูปใหม่จะแทนที่รูปเดิมของห้องนี้' : 'รูปนี้จะแสดงในหน้าห้องเรียน'}
                footer={
                    <>
                        <button type="button" className="btn-secondary" onClick={closeUpload}>ยกเลิก</button>
                        <button type="button" className="btn-primary" onClick={handleUpload} disabled={uploading}>
                            <LuUpload className="h-4 w-4" /> {uploading ? 'กำลังอัปโหลด…' : 'อัปโหลด'}
                        </button>
                    </>
                }
            >
                <label htmlFor="class-photo-upload" className={`file-drop ${preview ? 'p-2' : 'aspect-[16/9]'}`}>
                    {preview ? (
                        <>
                            <img src={preview} alt="ตัวอย่างรูปที่เลือก" className="aspect-[16/9] w-full rounded-md object-cover" />
                            <span className="text-[13px]">คลิกเพื่อเลือกรูปอื่น</span>
                        </>
                    ) : (
                        <>
                            <LuImagePlus className="h-7 w-7 text-ink-400" />
                            <span className="font-medium text-ink-700">คลิกเพื่อเลือกรูปภาพ</span>
                            <span className="text-[13px]">ไฟล์ PNG หรือ JPG แนะนำภาพแนวนอน</span>
                        </>
                    )}
                    <input
                        type="file"
                        id="class-photo-upload"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                    />
                </label>
            </Modal>

            <ConfirmDeleteModal
                isOpen={isOpenModelDelete}
                onClose={() => setIsOpenModelDelete(false)}
                onConfirm={handleDelete}
                title="ลบนักเรียน"
                message="ลบแล้วจะกู้คืนไม่ได้ ต้องการลบนักเรียนคนนี้ออกจากห้องใช่ไหม?"
            />
        </DashMasterLayout>
    );
};

export default ViewClassStudent;
