import DashMasterLayout from "../layouts/master";
import { useDispatch, useSelector } from "react-redux";
import { FetchTeacher } from "../../../slicers/teacherSlicer";
import { fetchStudent } from "../../../slicers/studentSlicer";
import { fetchClassroom } from "../../../slicers/classroomSlicer";
import { fetchEquipment } from "../../../slicers/equipmentSlicer";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import { FaUserTie } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { HiUsers } from "react-icons/hi2";
import { ResponsiveBar } from '@nivo/bar'
import { ResponsivePie } from '@nivo/pie';

const ViewDashboardComponent = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const TeacherData = useSelector((state) => state.teacher.teacher)
  const StudentData = useSelector((state) => state.student.student)
  const ClassroomData = useSelector((state) => state.classroom.classroom)
  const EquipmentData = useSelector((state) => state.equipment.equipnent)
  // console.log(StudentData)
  useEffect(() => {
    dispatch(FetchTeacher())
    dispatch(fetchStudent())
    dispatch(fetchClassroom())
    dispatch(fetchEquipment())
  }, [dispatch])

  const countTeacher = TeacherData.length;
  const countStudent = StudentData.length;
  const countClassroom = ClassroomData.length;
  const countEquipment = EquipmentData.length;

  const Countvc = Array.isArray(StudentData)
    ? StudentData.filter((items) => items.classroomNumber?.vc?.classroom?.includes('ปวช'))
    : [];
  const CountvcLength = Countvc.length;

  const Counthv = Array.isArray(StudentData)
    ? StudentData.filter((items) => items.classroomNumber?.vc?.classroom?.includes('ปวส'))
    : [];
  const CounthvLength = Counthv.length;

  const Countba = Array.isArray(StudentData)
    ? StudentData.filter((items) => items.classroomNumber?.vc?.classroom?.includes('ป.ตรี'))
    : [];
  const CountbaLength = Countba.length;


  const data = [
    { country: 'ปวช', value: CountvcLength },
    { country: 'ปวส', value: CounthvLength },
    { country: 'ป.ตรี', value: CountbaLength },
  ];

  const data2 = [
    { id: 'จำนวนอาจารย์', label: 'จำนวนอาจารย์', value: countTeacher },
    { id: 'จำนวนนักเรียน', label: 'จำนวนอาจารย์', value: countStudent },
    { id: 'จำนวนห้องเรียน', label: 'จำนวนอาจารย์', value: countClassroom },
    { id: 'จำนวนอุปกรณ์', label: 'จำนวนอุปกรณ์', value: countEquipment },
  ];

  return (
    <DashMasterLayout title="หน้าหลัก">
      <div className="grid grid-cols-4 gap-4 animate-fade-up animate-once animate-ease-in animate-normal animate-fill-forwards overflow-x-auto">

        <div className="bg-green-500 p-4 rounded-lg shadow-lg w-full h-40 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col text-white font-bold">
              <span className="text-3xl md:text-4xl animate-pulse animate-once animate-ease-linear animate-normal animate-fill-forwards ">
                {countTeacher}
              </span>
              <span className="text-sm md:text-base">จำนวนอาจารย์</span>
            </div>
            <div>
              <HiUsers size={80} className="text-white" />
            </div>
          </div>
          <div
            onClick={() => navigate('/home/teacher')}
            className=" bg-green-700 text-white text-center py-2 rounded-lg hover:bg-green-600 transition-colors">
            ดูข้อมูลเพิ่มเติม
          </div>
        </div>

        <div className="bg-orange-500 p-4 rounded-lg shadow-lg w-full h-40 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col text-white font-bold">
              <span className="text-3xl md:text-4xl animate-pulse animate-once animate-ease-linear animate-normal animate-fill-forwards">
                {CountvcLength}
              </span>
              <span className="text-sm md:text-base">จำนวนนักเรียน ปวช</span>
            </div>
            <div>
              <HiUserGroup size={80} className="text-white" />
            </div>
          </div>
          <div
            onClick={() => navigate('/home/Vocational-Certificate')}
            className=" bg-orange-700 text-white text-center py-2 rounded-lg hover:bg-orange-600 transition-colors">
            ดูข้อมูลเพิ่มเติม
          </div>
        </div>

        <div className="bg-cyan-500 p-4 rounded-lg shadow-lg w-full h-40 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col text-white font-bold">
              <span className="text-3xl md:text-4xl animate-pulse animate-once animate-ease-linear animate-normal animate-fill-forwards">
                {CounthvLength}
              </span>
              <span className="text-sm md:text-base">จำนวนนักเรียน ปวส</span>
            </div>
            <div>
              <HiUserGroup size={80} className="text-white" />
            </div>
          </div>
          <div
            onClick={() => navigate('/home/Higher-Vocational-Certificate')}
            className=" bg-cyan-700 text-white text-center py-2 rounded-lg hover:bg-cyan-600 transition-colors">
            ดูข้อมูลเพิ่มเติม
          </div>
        </div>

        <div className="bg-purple-500 p-4 rounded-lg shadow-lg w-full h-40 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col text-white font-bold">
              <span className="text-3xl md:text-4xl animate-pulse animate-once animate-ease-linear animate-normal animate-fill-forwards">
                {CountbaLength}
              </span>
              <span className="text-sm md:text-base">จำนวนนักเรียน ป.ตรี</span>
            </div>
            <div>
              <HiUserGroup size={80} className="text-white" />
            </div>
          </div>
          <div
            onClick={() => navigate('/home/Bachelors-Degree')}
            className=" bg-purple-700 text-white text-center py-2 rounded-lg hover:bg-purple-600 transition-colors">
            ดูข้อมูลเพิ่มเติม
          </div>
        </div>

      </div>

      <div className="flex flex-wrap gap-4 mt-5 overflow-x-auto rounded-lg">
        <div className="flex-1 min-w-[300px] max-w-[700px] bg-white p-4 rounded-lg">
          <div style={{ height: '400px' }}>
            <ResponsiveBar
              data={data}
              keys={['value']}
              indexBy="country"
              margin={{ top: 50, right: 30, bottom: 50, left: 60 }}
              padding={0.4}
              colors={(bar) => {
                const colors = ['#FF5733', '#33FF57', '#3357FF'];
                return colors[bar.index % colors.length];
              }}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                legend: 'จำนวนนักเรียนทั้งหมด',
                legendPosition: 'middle',
                legendOffset: 32
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                legend: 'Number of Students',
                legendPosition: 'middle',
                legendOffset: -40
              }}
              enableGridX={false}
              enableGridY={true}
              label={(d) => `${d.value}`}
              borderWidth={1}
              borderColor="white"
              motionConfig="wobbly"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[300px] max-w-[700px] bg-white p-4 rounded-lg">
          <div style={{ height: '400px' }}>
            <ResponsivePie
              data={data2}
              margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: 'nivo' }}
              borderWidth={1}
              borderColor="white"
              arcLinkLabelsSkipAngle={10}
              arcLabel={({ data }) => `${data.id}: ${data.value}`}
              sliceLabel={({ data }) => `${data.id}: ${data.value}`}
            />
          </div>
        </div>
      </div>



    </DashMasterLayout>

  );
};

export default ViewDashboardComponent;