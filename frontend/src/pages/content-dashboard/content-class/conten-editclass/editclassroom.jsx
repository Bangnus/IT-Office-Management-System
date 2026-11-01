import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { LuArrowLeft } from 'react-icons/lu';
import { editclassroom, fetchClassRoomID } from '../../../../slicers/classSlicer';
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify';
import DashMasterLayout from '../../layouts/master';
import InputComponet from '../../../../components/content-input/input-full';
import { levelOfName } from '../group-class/classLevels';

const Editclassroom = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [className, setClassName] = useState('');
    const [advisor, setAdvisor] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const fetchclassroom = useSelector((state) => state.class.classroom);
    // The slice may still hold the full class list from the previous page, so pick this class by id
    const room = Array.isArray(fetchclassroom) ? fetchclassroom.find((r) => String(r.id) === String(id)) : null;

    useEffect(() => {
        dispatch(fetchClassRoomID(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (room) {
            setClassName(room.className ?? '');
            setAdvisor(room.advisor ?? '');
        }
    }, [room]);

    // Where to go back to: the list page that opened this one, else the MenuPath cookie, else the level page of this class
    const level = levelOfName(room?.className ?? '');
    const backPath = location.state?.from || Cookies.get('MenuPath') || level?.path || '/dashboard';
    const backLabel = level ? `กลับไปหน้านักเรียน ${level.label}` : 'กลับ';

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!className.trim()) {
            ToastifyWarning({ lable: 'กรุณากรอกชื่อห้อง' });
            return;
        }
        try {
            setIsSaving(true);
            const response = await dispatch(editclassroom({ id, className: className.trim(), advisor: advisor.trim() }));
            if (response.payload?.status === true) {
                navigate(backPath);
                setTimeout(() => {
                    ToastifySuccess({ lable: 'แก้ไขข้อมูลสำเร็จ' });
                }, 500);
            } else {
                ToastifyError({ lable: 'เกิดข้อผิดพลาดในการแก้ไขห้องเรียน' });
            }
        } catch {
            ToastifyError({ lable: 'เกิดข้อผิดพลาด' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashMasterLayout
            title="แก้ไขห้องเรียน"
            description={room?.className ? `ห้อง ${room.className}` : undefined}
            back={
                <Link to={backPath} className="mb-2 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-brand-700">
                    <LuArrowLeft className="h-4 w-4" /> {backLabel}
                </Link>
            }
        >
            <form onSubmit={handleSubmit} noValidate className="card max-w-2xl animate-fade-up animate-duration-300 animate-ease-out">
                <div className="card-pad space-y-4">
                    <InputComponet label="ชื่อห้อง" value={className} OnChange={setClassName} placeholder="เช่น ปวช.1/1" required />
                    <InputComponet label="อาจารย์ที่ปรึกษา" value={advisor} OnChange={setAdvisor} placeholder="ชื่อ-นามสกุล" />
                </div>
                <div className="flex justify-end gap-2 border-t border-ink-200 px-5 py-4 md:px-4">
                    <Link to={backPath} className="btn-secondary">ยกเลิก</Link>
                    <button type="submit" disabled={isSaving} className="btn-primary">
                        {isSaving ? 'กำลังบันทึก…' : 'บันทึก'}
                    </button>
                </div>
            </form>
        </DashMasterLayout>
    );
};

export default Editclassroom;
