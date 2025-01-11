import React, { useEffect, useState } from 'react';
import DashMasterLayout from '../../layouts/master';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentID, fetchStudent } from '../../../../slicers/studentSlicer';
import InputComponet from '../../../../components/content-input/input-full';

const ViewClassStudent = () => {
    const { id } = useParams(); // ดึง id ของคลาสจาก URL
    const dispatch = useDispatch();
    const navigation = useNavigate();

    const [studentID, setStudentID] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [classroom, setClassroom] = useState(id);  // ตั้งค่า classroom ตาม id
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const StudentData = useSelector((state) => state.student.student); // ดึงข้อมูลนักเรียนจาก Redux
    useEffect(() => {
        dispatch(fetchStudentID(id)); // ดึงข้อมูลนักเรียนทั้งหมด
    }, [dispatch]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const studentData = {
            studentID,
            firstname,
            lastname,
            classroom,
            image,
        };

        // เรียกใช้ dispatch เพื่อส่งข้อมูลไปที่ Redux
        const response = await dispatch(createStudent(studentData));

        if (response.payload?.status === true) {
            alert('เพิ่มนักเรียนสำเร็จ');
            await dispatch(fetchStudent())
        } else {
            alert('เกิดข้อผิดพลาด: ' + response.payload?.error);
        }
    };

    return (
        <DashMasterLayout title={`ห้อง ${id}`}>
            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">เพิ่มข้อมูลนักเรียน</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input รหัสนักเรียน */}
                    <InputComponet
                        label={"รหัสนักเรียน"}
                        value={studentID}
                        OnChange={(value) => setStudentID(value)}
                    />
                    {/* Input ชื่อ */}
                    <InputComponet
                        label={"ชื่อ"}
                        value={firstname}
                        OnChange={(value) => setFirstname(value)}
                    />
                    {/* Input นามสกุล */}
                    <InputComponet
                        label={"นามสกุล"}
                        value={lastname}
                        OnChange={(value) => setLastname(value)}
                    />

                    {/* อัปโหลดไฟล์ */}
                    <div className="flex flex-col items-center space-y-4">
                        <label
                            htmlFor="file-upload"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600"
                        >
                            เลือกรูปภาพ
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {/* กรอบแสดงตัวอย่างรูป */}
                        <div
                            className={`w-64 h-64 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center overflow-hidden ${preview ? '' : 'bg-gray-100'}`}
                        >
                            {preview ? (
                                <img src={preview} alt="Uploaded Preview" className="object-cover w-full h-full" />
                            ) : (
                                <span className="text-gray-400">ตัวอย่างรูปจะปรากฏที่นี่</span>
                            )}
                        </div>
                    </div>

                    {/* ปุ่มบันทึก */}
                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                    >
                        บันทึกข้อมูล
                    </button>
                </form>

                {/* แสดงข้อมูลนักเรียนที่เพิ่ม */}
                <div className="mt-6">
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
                                        <img src={`http://localhost:5000/${student.image}`} alt="Student Image" className="mt-2 w-full h-32 object-cover rounded" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </DashMasterLayout>
    );
};

export default ViewClassStudent;
