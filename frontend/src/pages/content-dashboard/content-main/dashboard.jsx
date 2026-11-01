import DashMasterLayout from "../layouts/master";
import { useDispatch, useSelector } from "react-redux";
import { FetchTeacher } from "../../../slicers/teacherSlicer";
import { fetchStudent } from "../../../slicers/studentSlicer";
import { fetchClassroom } from "../../../slicers/classroomSlicer";
import { fetchEquipment } from "../../../slicers/equipmentSlicer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { LuUsers, LuGraduationCap, LuChevronRight, LuMonitor, LuInbox } from "react-icons/lu";

// Brand blues and ink neutrals from tailwind.config.js (nivo needs raw values)
const BRAND = { 200: "#c0d4f4", 400: "#5a90de", 600: "#074fad", 800: "#08356f" };
const INK = { 200: "#dfe5ee", 500: "#617089" };
const FONT = "NotoThai, system-ui, sans-serif";

const chartTheme = {
  text: { fontFamily: FONT, fontSize: 12, fill: INK[500] },
  axis: {
    domain: { line: { stroke: INK[200], strokeWidth: 1 } },
    ticks: { line: { stroke: "transparent" }, text: { fontFamily: FONT, fontSize: 12, fill: INK[500] } },
    legend: { text: { fontFamily: FONT, fontSize: 12, fill: INK[500] } },
  },
  grid: { line: { stroke: INK[200], strokeDasharray: "3 4" } },
  labels: { text: { fontFamily: FONT, fontSize: 13, fontWeight: 600 } },
};

const ChartTooltip = ({ label, value, unit, color }) => (
  <div className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-white px-3 py-2 text-[13px] text-ink-700 shadow-pop">
    <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
    <span>{label}</span>
    <span className="num font-semibold text-ink-900">{value.toLocaleString("th-TH")} {unit}</span>
  </div>
);
ChartTooltip.propTypes = { label: PropTypes.string, value: PropTypes.number, unit: PropTypes.string, color: PropTypes.string };

const countLevel = (students, level) =>
  Array.isArray(students) ? students.filter((s) => s.classroomNumber?.vc?.classroom?.includes(level)).length : 0;

const StatTile = ({ to, icon: Icon, label, value, ready }) => (
  <Link
    to={to}
    className="card group flex items-center gap-3.5 p-4 transition-colors duration-150 hover:border-brand-300 sm:flex-col sm:items-start sm:gap-2.5"
  >
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
      <Icon className="h-5 w-5" />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm text-ink-500">{label}</span>
      <span className="num mt-0.5 block text-2xl font-semibold leading-tight text-ink-900">
        {ready ? value.toLocaleString("th-TH") : <span className="text-ink-300">–</span>}
        <span className="ml-1 text-sm font-normal text-ink-500">คน</span>
      </span>
    </span>
    <LuChevronRight className="h-4 w-4 shrink-0 text-ink-300 transition-colors group-hover:text-brand-600 sm:hidden" aria-hidden="true" />
  </Link>
);
StatTile.propTypes = { to: PropTypes.string, icon: PropTypes.elementType, label: PropTypes.string, value: PropTypes.number, ready: PropTypes.bool };

const ViewDashboardComponent = () => {
  const dispatch = useDispatch();
  const TeacherData = useSelector((state) => state.teacher.teacher);
  const StudentData = useSelector((state) => state.student.student);
  const ClassroomData = useSelector((state) => state.classroom.classroom);
  const EquipmentData = useSelector((state) => state.equipment.equipnent);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      dispatch(FetchTeacher()),
      dispatch(fetchStudent()),
      dispatch(fetchClassroom()),
      dispatch(fetchEquipment()),
    ]).then(() => setLoaded(true));
  }, [dispatch]);

  const countTeacher = TeacherData?.length ?? 0;
  const countStudent = StudentData?.length ?? 0;
  const countClassroom = ClassroomData?.length ?? 0;
  const countEquipment = EquipmentData?.length ?? 0;
  const ready = loaded || countTeacher + countStudent > 0;

  const countVC = countLevel(StudentData, "ปวช");
  const countHVC = countLevel(StudentData, "ปวส");
  const countBA = countLevel(StudentData, "ป.ตรี");

  const tiles = [
    { to: "/home/teacher", icon: LuUsers, label: "อาจารย์", value: countTeacher },
    { to: "/home/Vocational-Certificate", icon: LuGraduationCap, label: "นักเรียน ปวช.", value: countVC },
    { to: "/home/Higher-Vocational-Certificate", icon: LuGraduationCap, label: "นักเรียน ปวส.", value: countHVC },
    { to: "/home/Bachelors-Degree", icon: LuGraduationCap, label: "นักเรียน ป.ตรี", value: countBA },
  ];

  const levelData = [
    { level: "ปวช.", value: countVC },
    { level: "ปวส.", value: countHVC },
    { level: "ป.ตรี", value: countBA },
  ];

  const totals = [
    { id: "teacher", label: "อาจารย์", value: countTeacher, unit: "คน", color: BRAND[800] },
    { id: "student", label: "นักเรียน", value: countStudent, unit: "คน", color: BRAND[600] },
    { id: "classroom", label: "ห้องเรียน", value: countClassroom, unit: "ห้อง", color: BRAND[400] },
    { id: "equipment", label: "อุปกรณ์", value: countEquipment, unit: "รายการ", color: BRAND[200] },
  ];
  const hasTotals = totals.some((t) => t.value > 0);

  const equipment = Array.isArray(EquipmentData)
    ? EquipmentData.map((e) => ({ id: e.id, name: e.name, qty: Number(e.number) || 0 }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 8)
    : [];
  const maxQty = Math.max(1, ...equipment.map((e) => e.qty));

  return (
    <DashMasterLayout title="หน้าหลัก" description="ภาพรวมข้อมูลอาจารย์ นักเรียน ห้องเรียน และอุปกรณ์ของแผนก">
      <div className="animate-fade-up animate-once animate-duration-300 animate-ease-out space-y-5 md:space-y-4">
        <div className="grid grid-cols-4 gap-4 lg:grid-cols-2 md:gap-3">
          {tiles.map((t) => <StatTile key={t.to} {...t} ready={ready} />)}
        </div>

        <div className="grid grid-cols-12 gap-5 lg:grid-cols-1 md:gap-4">
          <section className="card col-span-7 flex min-w-0 flex-col lg:col-span-1">
            <div className="card-head">
              <h2 className="card-title">นักเรียนแยกตามระดับชั้น</h2>
              <span className="muted num">รวม {countStudent.toLocaleString("th-TH")} คน</span>
            </div>
            <div className="min-h-[300px] flex-1 px-2 pb-2 pt-3 md:min-h-[260px]">
              {countStudent > 0 ? (
                <ResponsiveBar
                  data={levelData}
                  keys={["value"]}
                  indexBy="level"
                  theme={chartTheme}
                  margin={{ top: 16, right: 16, bottom: 36, left: 56 }}
                  padding={0.45}
                  valueScale={{ type: "linear", nice: true }}
                  colors={BRAND[600]}
                  borderRadius={4}
                  enableGridX={false}
                  gridYValues={5}
                  axisBottom={{ tickSize: 0, tickPadding: 10 }}
                  axisLeft={{ tickSize: 0, tickPadding: 8, tickValues: 5, legend: "จำนวน (คน)", legendPosition: "middle", legendOffset: -46 }}
                  labelSkipHeight={18}
                  labelTextColor="#ffffff"
                  tooltip={({ indexValue, value, color }) => <ChartTooltip label={`นักเรียน ${indexValue}`} value={value} unit="คน" color={color} />}
                  motionConfig="gentle"
                  role="img"
                  ariaLabel="กราฟจำนวนนักเรียนแยกตามระดับชั้น"
                />
              ) : (
                <div className="empty-state h-full">
                  <LuInbox className="h-8 w-8 text-ink-300" />
                  {ready ? "ยังไม่มีข้อมูลนักเรียน" : "กำลังโหลดข้อมูล…"}
                </div>
              )}
            </div>
          </section>

          <section className="card col-span-5 min-w-0 lg:col-span-1">
            <div className="card-head">
              <h2 className="card-title">ข้อมูลทั้งหมดในระบบ</h2>
            </div>
            {/* Wraps the legend under the donut when the card is narrow (no breakpoint juggling needed) */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 p-5 md:p-4">
              <div className="h-[190px] w-[190px] shrink-0 md:h-[176px] md:w-[176px]">
                {hasTotals ? (
                  <ResponsivePie
                    data={totals}
                    theme={chartTheme}
                    colors={({ data }) => data.color}
                    margin={{ top: 6, right: 6, bottom: 6, left: 6 }}
                    innerRadius={0.62}
                    padAngle={1.2}
                    cornerRadius={3}
                    enableArcLabels={false}
                    enableArcLinkLabels={false}
                    activeOuterRadiusOffset={4}
                    tooltip={({ datum }) => <ChartTooltip label={datum.label} value={datum.value} unit={datum.data.unit} color={datum.color} />}
                    motionConfig="gentle"
                    role="img"
                  />
                ) : (
                  <div className="h-full w-full rounded-full border-[18px] border-ink-100" />
                )}
              </div>
              <ul className="min-w-[180px] flex-1 basis-[180px] divide-y divide-ink-100">
                {totals.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 py-2.5 text-sm">
                    <span className="h-3 w-3 shrink-0 rounded-sm" style={{ backgroundColor: t.color }} aria-hidden="true" />
                    <span className="flex-1 text-ink-700">{t.label}</span>
                    <span className="num font-semibold text-ink-900">
                      {ready ? t.value.toLocaleString("th-TH") : "–"}
                      <span className="ml-1 font-normal text-ink-500">{t.unit}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <section className="card">
          <div className="card-head">
            <h2 className="card-title">จำนวนอุปกรณ์</h2>
            <Link to="/home/manage-equipment" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
              จัดการอุปกรณ์ <LuChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {equipment.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-10 gap-y-4 p-5 md:grid-cols-1 md:p-4">
              {equipment.map((e) => (
                <li key={e.id} className="min-w-0">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate text-ink-700">{e.name}</span>
                    <span className="num shrink-0 font-semibold text-ink-900">
                      {e.qty.toLocaleString("th-TH")}
                      <span className="ml-1 font-normal text-ink-500">ชิ้น</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full rounded-full bg-brand-400" style={{ width: `${(e.qty / maxQty) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <LuMonitor className="h-8 w-8 text-ink-300" />
              {ready ? "ยังไม่มีข้อมูลอุปกรณ์" : "กำลังโหลดข้อมูล…"}
              {ready && (
                <Link to="/home/manage-equipment" className="btn-primary btn-sm mt-2">ไปที่หน้าจัดการอุปกรณ์</Link>
              )}
            </div>
          )}
        </section>
      </div>
    </DashMasterLayout>
  );
};

export default ViewDashboardComponent;
