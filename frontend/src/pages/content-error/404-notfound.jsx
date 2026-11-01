import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuHome, LuSearchX } from 'react-icons/lu';

const PageNotFound = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'ไม่พบหน้าที่ต้องการ | IT Office Management System';
    }, []);

    return (
        <main className="flex min-h-screen items-center justify-center bg-ink-50 px-5 py-12">
            <div className="w-full max-w-md text-center animate-fade-up animate-once animate-duration-300 animate-ease-out">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                    <LuSearchX className="h-7 w-7" />
                </span>
                <p className="num mt-6 text-sm font-semibold text-brand-600">ข้อผิดพลาด 404</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink-900">ไม่พบหน้าที่คุณต้องการ</h1>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
                    ลิงก์อาจไม่ถูกต้อง หรือหน้านี้ถูกย้ายหรือลบไปแล้ว
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:flex-col-reverse sm:items-stretch">
                    <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
                        <LuArrowLeft className="h-4 w-4" /> ย้อนกลับ
                    </button>
                    <Link to="/dashboard" className="btn-primary">
                        <LuHome className="h-4 w-4" /> กลับไปหน้าหลัก
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default PageNotFound;
