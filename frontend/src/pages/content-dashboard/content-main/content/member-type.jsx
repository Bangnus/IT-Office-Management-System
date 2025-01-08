import ProgressLineComponent from "../../../../components/content-progress/progress-line";
import { MdOutlineArrowForwardIos } from "react-icons/md";

const MemberTypeComponent = () => {
    return(
        <div className="w-full flex rounded-l-md rounded-r-lg bg-primaryofdashboard my-5 animate-fade-up animate-once animate-duration-1000 animate-ease-in-out animate-delay-100">
            <div className="w-[20%] py-5 text-white px-5 text-[13px]">
                <div className="">
                    <span>Agency level</span>
                </div>
                <div className="font-primaryMedium text-[16px]">
                    <span>Member</span>
                </div>
                <div className="font-primaryMedium">
                    <span>pricing of 17% per month</span>
                </div>
            </div>
            <div className="bg-white w-[80%] py-5 px-5 rounded-md border border-gray-300">
                <div className="text-[13px]">
                    <span>Seller Total</span>
                </div>
                <div>
                    <span className="text-primaryofdashboard font-primaryBold text-[18px]">฿2,000.00 <span className="font-primaryRegular text-gray-600 text-[14px]">/ 15000.00</span></span>
                </div>
                <div className="mb-2">
                    <ProgressLineComponent number={20} />
                </div>
                <div className="w-full flex justify-between">
                    <div className="flex items-center gap-x-1">
                        <span>Seller detail total 3 month of you</span>
                        <MdOutlineArrowForwardIos />
                    </div>
                    <div>
                        <span className="font-primaryMedium text-[14px]">Next grow to Bronze</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberTypeComponent;