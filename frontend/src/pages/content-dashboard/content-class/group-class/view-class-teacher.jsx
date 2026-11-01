import { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import DashMasterLayout from '../../layouts/master'
import { CreateTeacher, FetchTeacher, deleteTeaher } from '../../../../slicers/teacherSlicer';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { LuCalendarDays, LuImagePlus, LuPencil, LuPlus, LuSearch, LuSearchX, LuTrash2, LuUser, LuUsers, LuX } from 'react-icons/lu';
import InputComponet from '../../../../components/content-input/input-full';
import Modal from '../../../../components/content-alert/Modal';
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify';
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal';
import fileUrl from '../../../../hooks/fileUrl';

/** 44px teacher photo; clickable to open the zoom view. */
const Avatar = ({ teacher, onZoom }) => {
  const src = fileUrl(teacher.TeacherImage);
  if (!src) {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        <LuUser className="h-5 w-5" />
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => onZoom(teacher)}
      className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-ink-100 ring-1 ring-ink-200 transition hover:ring-2 hover:ring-brand-400"
      aria-label={`ดูรูปของ ${teacher.fullName ?? 'อาจารย์'}`}
      title="ดูรูปขนาดใหญ่"
    >
      <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
    </button>
  );
};

Avatar.propTypes = { teacher: PropTypes.object.isRequired, onZoom: PropTypes.func.isRequired };

/** Leave records / edit / delete buttons for one teacher. */
const RowActions = ({ teacher, onDelete, className = 'justify-end' }) => (
  <div className={`flex items-center gap-1 ${className}`}>
    <Link to={`/LeaveTeacher/${teacher.id}`} className="icon-btn-brand" aria-label="ประวัติการลา" title="ประวัติการลา">
      <LuCalendarDays className="h-[18px] w-[18px]" />
    </Link>
    <Link to={`/editTeachert/${teacher.id}`} className="icon-btn-brand" aria-label="แก้ไข" title="แก้ไข">
      <LuPencil className="h-[18px] w-[18px]" />
    </Link>
    <button type="button" className="icon-btn-danger" aria-label="ลบ" title="ลบ" onClick={() => onDelete(teacher.id)}>
      <LuTrash2 className="h-[18px] w-[18px]" />
    </button>
  </div>
);

RowActions.propTypes = { teacher: PropTypes.object.isRequired, onDelete: PropTypes.func.isRequired, className: PropTypes.string };

const Viewclassteacher = () => {
  const dispatch = useDispatch()
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [TeacherImage, setTeacherImage] = useState(null);
  const [teacherID, setTacherID] = useState('')
  const [isOpenModelDelete, setIsOpenModelDelete] = useState(false)
  const [isOpenModel, setIsOpenModel] = useState(false)
  const [preview, setPreview] = useState(null)
  const [zoomTeacher, setZoomTeacher] = useState(null)
  const [saving, setSaving] = useState(false)
  const [query, setQuery] = useState('')

  const FeacherData = useSelector((state) => state.teacher.teacher)
  const loading = useSelector((state) => state.teacher.loading)

  useEffect(() => {
    dispatch(FetchTeacher())
  }, [dispatch])

  // Close the zoom view with Escape
  useEffect(() => {
    if (!zoomTeacher) return;
    const onKey = (e) => e.key === 'Escape' && setZoomTeacher(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [zoomTeacher])

  // The store briefly holds a single object after create/delete, so only trust arrays
  const teachers = useMemo(
    () => (Array.isArray(FeacherData) ? [...FeacherData].sort((a, b) => a.id - b.id) : []),
    [FeacherData]
  )
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teachers;
    return teachers.filter((t) => `${t.fullName ?? ''} ${t.position ?? ''}`.toLowerCase().includes(q));
  }, [teachers, query])

  //func addTeacherData
  const handleCreateData = async (e) => {
    e?.preventDefault()
    if (!fullName.trim() || !position.trim()) {
      ToastifyWarning({ label: "กรุณากรอกชื่อและตำแหน่งให้ครบ" })
      return;
    }
    if (!TeacherImage) {
      ToastifyWarning({ label: "กรุณาอัปโหลดรูปภาพ" });
      return;
    }
    setSaving(true)
    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('position', position.trim());
      formData.append('TeacherImage', TeacherImage);

      const response = await dispatch(CreateTeacher(formData));
      if (response.payload.status === true) {
        ToastifySuccess({ label: "เพิ่มข้อมูลสำเร็จ" })
        setFullName('')
        setPosition('')
        setTeacherImage(null)
        setIsOpenModel(false)
        setPreview(null)
        await dispatch(FetchTeacher())
      } else {
        ToastifyWarning({ label: "เพิ่มข้อมูลไม่สำเร็จ" })
      }
    } catch {
      ToastifyError({ label: "เกิดข้อผิดพลาด" })
    } finally {
      setSaving(false)
    }
  }

  //func change Image
  const handleIamgeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        ToastifyWarning({ label: "กรุณาเลือกไฟล์รูปภาพเท่านั้น" });
        return;
      }
      setTeacherImage(file)
      setPreview(URL.createObjectURL(file))
    }
  };

  //รับค่าจากไอดีของอาจารย์
  const handleOpenModelDelete = (id) => {
    setTacherID(id)
    setIsOpenModelDelete(true)
  }
  const handleDelete = async () => {
    try {
      if (!teacherID) {
        throw new Error('ไม่พบ ID ของอาจารย์ที่ต้องการลบ')
      }
      const response = await dispatch(deleteTeaher(teacherID))

      if (response.payload.status === true) {
        ToastifySuccess({ label: 'ลบข้อมูลสำเร็จ' })
        setTacherID('')
        setIsOpenModelDelete(false)
        await dispatch(FetchTeacher())
      } else {
        ToastifyWarning({ label: "ลบข้อมูลไม่สำเร็จ" })
      }
    } catch {
      ToastifyError({ label: "เกิดข้อผิดพลาด" })
    }
  }

  const createButton = (
    <button type="button" onClick={() => setIsOpenModel(true)} className="btn-primary">
      <LuPlus className="h-4 w-4" />
      เพิ่มอาจารย์
    </button>
  )

  const renderBody = () => {
    if (teachers.length === 0) {
      return loading ? (
        <div className="empty-state">กำลังโหลดข้อมูล…</div>
      ) : (
        <div className="empty-state">
          <LuUsers className="h-10 w-10 text-ink-300" />
          <p className="text-base font-medium text-ink-700">ยังไม่มีข้อมูลอาจารย์</p>
          <p>เพิ่มอาจารย์คนแรกเพื่อเริ่มบันทึกประวัติการลา</p>
          <div className="mt-2">{createButton}</div>
        </div>
      )
    }
    if (filtered.length === 0) {
      return (
        <div className="empty-state">
          <LuSearchX className="h-10 w-10 text-ink-300" />
          <p className="text-base font-medium text-ink-700">ไม่พบอาจารย์ที่ตรงกับ “{query.trim()}”</p>
          <p>ลองค้นหาด้วยชื่อหรือตำแหน่งอื่น</p>
          <button type="button" className="btn-secondary mt-2" onClick={() => setQuery('')}>ล้างคำค้นหา</button>
        </div>
      )
    }
    return (
      <>
        {/* Tablet / desktop: table */}
        <div className="table-wrap md:hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-16">ลำดับ</th>
                <th>อาจารย์</th>
                <th>ตำแหน่ง</th>
                <th className="w-40 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((data, index) => (
                <tr key={data.id}>
                  <td className="num text-ink-500">{index + 1}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar teacher={data} onZoom={setZoomTeacher} />
                      <span className="font-medium text-ink-900">{data.fullName}</span>
                    </div>
                  </td>
                  <td className="text-ink-500">{data.position || '-'}</td>
                  <td><RowActions teacher={data} onDelete={handleOpenModelDelete} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Phones: stacked list */}
        <ul className="hidden divide-y divide-ink-100 md:block">
          {filtered.map((data) => (
            <li key={data.id} className="flex items-start gap-3 px-4 pb-2 pt-3">
              <Avatar teacher={data} onZoom={setZoomTeacher} />
              <div className="min-w-0 flex-1">
                <p className="break-words font-medium leading-snug text-ink-900">{data.fullName}</p>
                <p className="break-words text-sm text-ink-500">{data.position || '-'}</p>
                <RowActions teacher={data} onDelete={handleOpenModelDelete} className="-ml-2 mt-1 justify-start" />
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  return (
    <DashMasterLayout
      title="อาจารย์"
      description={`ทั้งหมด ${teachers.length} คน`}
      actions={createButton}
    >
      <div className="card animate-fade-up animate-once animate-duration-300 animate-ease-out">
        {teachers.length > 0 && (
          <div className="card-head">
            <div className="relative w-72 md:w-full">
              <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="search"
                className="field pl-9"
                placeholder="ค้นหาชื่อหรือตำแหน่ง"
                aria-label="ค้นหาอาจารย์"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {query.trim() && <span className="muted">พบ {filtered.length} คน</span>}
          </div>
        )}
        {renderBody()}
      </div>

      {/* model create Data */}
      <Modal
        isOpen={isOpenModel}
        onClose={() => setIsOpenModel(false)}
        title="เพิ่มอาจารย์"
        description="กรอกชื่อ ตำแหน่ง และอัปโหลดรูปภาพของอาจารย์"
        footer={
          <>
            <button type="button" className="btn-secondary" onClick={() => setIsOpenModel(false)}>ยกเลิก</button>
            <button type="submit" form="create-teacher-form" className="btn-primary" disabled={saving}>
              {saving ? 'กำลังบันทึก…' : 'บันทึก'}
            </button>
          </>
        }
      >
        <form id="create-teacher-form" onSubmit={handleCreateData} className="space-y-4" noValidate>
          <InputComponet
            label="ชื่อ-นามสกุล"
            value={fullName}
            OnChange={setFullName}
            placeholder="เช่น นายสมชาย ใจดี"
            required
          />
          <InputComponet
            label="ตำแหน่ง"
            value={position}
            OnChange={setPosition}
            placeholder="เช่น ครูประจำแผนก"
            required
          />
          <div>
            <span className="label">รูปภาพ<span className="ml-0.5 text-red-600" aria-hidden="true">*</span></span>
            <label htmlFor="teacher-file-upload" className="file-drop">
              {preview ? (
                <>
                  <img src={preview} alt="ตัวอย่างรูปที่เลือก" className="h-32 w-32 rounded-lg object-cover ring-1 ring-ink-200" />
                  <span className="font-medium text-brand-700">เปลี่ยนรูป</span>
                </>
              ) : (
                <>
                  <LuImagePlus className="h-8 w-8 text-ink-400" />
                  <span><span className="font-medium text-brand-700">เลือกรูปภาพ</span> จากเครื่อง</span>
                  <span className="text-xs text-ink-400">รองรับไฟล์ JPG, PNG</span>
                </>
              )}
              <input
                type="file"
                id="teacher-file-upload"
                className="sr-only"
                accept="image/*"
                onChange={handleIamgeChange}
              />
            </label>
          </div>
        </form>
      </Modal>

      {/* Photo zoom */}
      {zoomTeacher && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/90 p-4 animate-fade animate-duration-150"
          onClick={() => setZoomTeacher(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`รูปของ ${zoomTeacher.fullName ?? 'อาจารย์'}`}
        >
          <button
            type="button"
            onClick={() => setZoomTeacher(null)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="ปิด"
            title="ปิด"
          >
            <LuX className="h-5 w-5" />
          </button>
          <figure className="flex max-w-full flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            <img
              src={fileUrl(zoomTeacher.TeacherImage)}
              alt={zoomTeacher.fullName ?? ''}
              className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-pop"
            />
            <figcaption className="text-center text-white">
              <p className="font-medium">{zoomTeacher.fullName}</p>
              {zoomTeacher.position && <p className="text-sm text-white/70">{zoomTeacher.position}</p>}
            </figcaption>
          </figure>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={isOpenModelDelete}
        onClose={() => setIsOpenModelDelete(false)}
        onConfirm={handleDelete}
        title="ลบข้อมูลอาจารย์"
        message="ลบแล้วจะกู้คืนไม่ได้ ต้องการลบอาจารย์คนนี้ใช่ไหม?"
      />
    </DashMasterLayout>
  )
}

export default Viewclassteacher
