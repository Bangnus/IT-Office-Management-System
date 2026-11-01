import MasterLayout from "../layouts/master";
import { useParams } from "react-router-dom";
import SignupForm from "./forms/signupForm";
import SigninForm from "./forms/signinForm";
import LogoComponent from "../../components/Logo/logo";
import { LuUsers, LuGraduationCap, LuDoorOpen, LuMonitor } from "react-icons/lu";

const FEATURES = [
    { icon: LuUsers, text: "ข้อมูลอาจารย์และการลา" },
    { icon: LuGraduationCap, text: "นักเรียน ปวช. ปวส. และ ป.ตรี" },
    { icon: LuDoorOpen, text: "ห้องเรียนของแผนก" },
    { icon: LuMonitor, text: "อุปกรณ์และจำนวนคงเหลือ" },
];

const SigninView = () => {
    const { type } = useParams();
    const isSignup = type === "signup";

    return (
        <MasterLayout title={isSignup ? "สร้างบัญชีใหม่" : "เข้าสู่ระบบ"}>
            <div className="flex min-h-screen bg-white font-sans text-ink-800">
                {/* Brand panel: desktop and tablet only */}
                <aside className="flex w-[42%] max-w-[560px] shrink-0 flex-col justify-between bg-brand-700 px-12 py-12 text-white lg:px-9 md:hidden">
                    <p className="text-sm font-medium text-brand-100">แผนกเทคโนโลยีสารสนเทศ</p>
                    <div>
                        <h2 className="text-[32px] font-semibold leading-tight tracking-tight lg:text-[26px]">
                            IT Office<br />Management System
                        </h2>
                        <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-brand-100">
                            ระบบจัดการงานสำนักงานแผนกเทคโนโลยีสารสนเทศ
                        </p>
                        <ul className="mt-10 space-y-3.5">
                            {FEATURES.map(({ icon: Icon, text }) => (
                                <li key={text} className="flex items-center gap-3 text-sm text-brand-50">
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                                        <Icon className="h-4 w-4" />
                                    </span>
                                    {text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-xs text-brand-200">© {new Date().getFullYear()} IT Office Management System</p>
                </aside>

                <main className="flex min-w-0 flex-1 flex-col items-center justify-center px-8 py-12 md:justify-start md:px-5 md:py-10">
                    <div className="w-full max-w-[400px] animate-fade-up animate-once animate-duration-300 animate-ease-out">
                        <div className="mb-10 md:mb-8">
                            <LogoComponent to="/" />
                        </div>
                        {isSignup ? <SignupForm /> : <SigninForm />}
                    </div>
                </main>
            </div>
        </MasterLayout>
    );
};

export default SigninView;
