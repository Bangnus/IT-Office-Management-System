import React, { useEffect, useState } from 'react';
import DashMasterLayout from '../../layouts/master';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentID, fetchStudent, createStudent, deleteStudent } from '../../../../slicers/studentSlicer';
import { fetcgImageID } from '../../../../slicers/imageSlicer';
import InputComponet from '../../../../components/content-input/input-full';
import { ToastifySuccess, ToastifyError, ToastifyWarning } from '../../../../components/content-alert/toastify';
import ButtonFullComponent from '../../../../components/content-buttons/full-button';
import { RiEdit2Fill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { MdPersonAddAlt1 } from "react-icons/md";
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal';

const ViewClassStudent = () => {
    const { id } = useParams(); // ดึง id ของคลาสจาก URL
    const dispatch = useDispatch();
    const navigation = useNavigate();


    const [studentID, setStudentID] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [classroom, setClassroom] = useState(id);  // ตั้งค่า classroom ตาม id
    const [preview, setPreview] = useState(null);
    const [isOpenModel, setIsOpenModel] = useState(false)
    const [className, setClassName] = useState('');
    const [isOpenModelDelete, setIsOpenModelDelete] = useState(false)
    const [RoomID, setRoomID] = useState('')
    const [image, setImage] = useState(null);

    const StudentData = useSelector((state) => state.student.student); // ดึงข้อมูลนักเรียนจาก Redux
    const FetchImage = useSelector((state) => state.image.image)
    console.log(image)

    useEffect(() => {
        if (StudentData?.length > 0) {
            // ดึง className ของนักเรียนคนแรก
            const className = StudentData[0]?.classroomNumber?.className || "ไม่มีข้อมูล";
            setClassName(className);
        }
    }, [StudentData]);

    useEffect(() => {
        if (FetchImage.length > 0) {
            const image = FetchImage[0]?.image
            setImage(image)
        }
    }, [FetchImage])


    useEffect(() => {
        dispatch(fetchStudentID(id)); // ดึงข้อมูลนักเรียนทั้งหมด
        dispatch(fetcgImageID(id))
    }, [dispatch, id]);


    const handleCreatetudent = async (event) => {
        event.preventDefault();
        try {
            const data = {
                studentID,
                firstname,
                lastname,
                classroom,
            };
            const response = await dispatch(createStudent(data))
            if (response.payload.status === true) {
                ToastifySuccess({ lable: 'เพิ่มข้อมูลสำเร็จ' });
                setIsOpenModel(false)
                await dispatch(fetchStudentID(id))
                setStudentID('')
                setFirstname('')
                setLastname('')
            } else (
                ToastifyWarning({ lable: 'เพิ่มข้อมูลไม่สำเร็จ' })
            )
        } catch (error) {
            ToastifyError({ lable: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล' });
        }
    };

    const handleOpenModelDelete = (id) => {
        setRoomID(id)
        setIsOpenModelDelete(true)
    }

    const handleDelete = async () => {
        try {
            if (!RoomID) {
                throw new Error('ไม่พบ ID ของนักเรียนที่ต้องการลบ')
            }
            const rseponse = await dispatch(deleteStudent(RoomID))

            if (rseponse.payload.status === true) {
                ToastifySuccess({ lable: "ลบข้อมูลสำเร็จ" })
                setRoomID('')
                setIsOpenModelDelete(false)
                await dispatch(fetchStudentID(id))
            } else (
                ToastifyError({ lable: "ลบข้อมูลไม่สำเร็จ" })
            )
        } catch (error) {
            ToastifyError({ lable: "เกิดข้อผิดพลาด" })
        }
    }
    return (
        <DashMasterLayout title={className}>
            <div className="">
                <div className="bg-white shadow-lg p-2">
                    <div className="flex items-center justify-center mb-10">
                        <img
                            src={`http://localhost:5000/${image}`}
                            alt="image"
                            className="w-full h-[580px] object-cover rounded-lg border-4 border-gray-200 shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                        />
                    </div>
                    <div className="flex px-5 py-2 items-center justify-between">
                        <h1 className='text-lg font-semibold p-2'>ข้อมูลนักเรียน{className}</h1>
                        <button className='flex items-center gap-2 bg-green-500 hover:bg-green-600 rounded-lg px-3 py-2 text-white font-semibold'
                            onClick={() => setIsOpenModel(true)}
                        >
                            เพิ่มข้อมูล
                            <MdPersonAddAlt1 size={20} />
                        </button>
                    </div>
                    <div className="">
                        <table className="w-full rounded-lg bg-white  table-fixed">
                            <thead className="text-white bg-blue-500">
                                <tr>
                                    <th className="w-1/4 px-5 py-2 text-left font-semibold">รหัสนักเรียน</th>
                                    <th className="w-1/4 px-5 py-2 text-left font-semibold">ชื่อ</th>
                                    <th className="w-1/4 px-5 py-2 text-left font-semibold">นามสกุล</th>
                                    <th className="w-1/4 px-5 py-2 text-center font-semibold">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {StudentData.length > 0 ? (
                                    [...StudentData]
                                        .sort((a, b) => a.studentID.localeCompare(b.studentID))
                                        .map((student) => (
                                            <tr
                                                key={student.id}
                                                className="border-b hover:bg-gray-200 transition-colors duration-300"
                                            >
                                                <td className="px-6 py-2 text-left truncate">{student.studentID}</td>
                                                <td className="px-6 py-2 text-left truncate">{student.firstname}</td>
                                                <td className="px-6 py-2 text-left truncate">{student.lastname}</td>
                                                <td className="flex justify-center gap-x-2 p-2">
                                                    <Link to={`/editStudent/${student.id}`}>
                                                        <div className="p-2 bg-yellow-600 rounded-md text-white hover:bg-yellow-700 transition-colors duration-300">
                                                            <RiEdit2Fill size={20} />
                                                        </div>
                                                    </Link>
                                                    <button className="p-2 bg-red-600 rounded-md text-white hover:bg-red-700 transition-colors duration-300 cursor-pointer"
                                                        onClick={() => handleOpenModelDelete(student.id)}
                                                    >
                                                        <TiDelete size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-gray-500">
                                            ไม่มีข้อมูล
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
                {/* แสดงข้อมูลนักเรียนที่เพิ่ม */}
                {/* <div className="mt-6">
                    <h2 className="text-lg font-semibold">ข้อมูลนักเรียน</h2>
                    <div className="space-y-2">
                        {StudentData.map((student) => (
                            <div key={student.id} className="p-4 border border-gray-200 rounded-md">
                                <p><strong>รหัสนักเรียน:</strong> {student.studentID}</p>
                                <p><strong>ชื่อ:</strong> {student.firstname} {student.lastname}</p>
                                <p><strong>ห้อง:</strong> {student.classroom}</p>
                                {student.image && (
                                    <div>
                                        <strong>รูปภาพ:</strong>
                                        <img src={`http://localhost:5000/${student.image}`} alt="Student Image" className="mt-2 w-[20%] h-[10%] object-cover rounded" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div> */}


                {/* model */}
                {isOpenModel === true && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                        onClick={() => setIsOpenModel(false)}
                    >
                        <div className="bg-white rounded-lg p-6 w-full max-w-[30rem] sm:w-96 md:w-1/3 shadow-lg animate-jump-in animate-once animate-ease-out animate-normal animate-fill-forwards"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h1 className="text-xl font-bold mb-4">เพิ่มข้อมูลนักเรียน</h1>
                            <div className="flex flex-col gap-4">
                                <InputComponet
                                    label={"รหัสนักเรียน"}
                                    color={"blue"}
                                    value={studentID}
                                    OnChange={(value) => setStudentID(value)}
                                    className="w-full"
                                />
                                <div className="flex gap-4 w-full">
                                    <InputComponet
                                        label={"ชื่อ"}
                                        color={"blue"}
                                        value={firstname}
                                        OnChange={(value) => setFirstname(value)}
                                        className="w-full sm:w-[48%]"
                                    />
                                    <InputComponet
                                        label={"นามสกุล"}
                                        color={"blue"}
                                        value={lastname}
                                        OnChange={(value) => setLastname(value)}
                                        className="w-full sm:w-[48%]"
                                    />
                                </div>
                                <ButtonFullComponent
                                    lable={"เพิ่มข้อมูล"}
                                    color={"blue"}
                                    func={handleCreatetudent}
                                />
                            </div>
                        </div>
                    </div>
                )}

            </div>
            <ConfirmDeleteModal
                isOpen={isOpenModelDelete}
                onClose={() => setIsOpenModelDelete(false)}
                onConfirm={handleDelete}
            />
        </DashMasterLayout>
    );
};

export default ViewClassStudent;
