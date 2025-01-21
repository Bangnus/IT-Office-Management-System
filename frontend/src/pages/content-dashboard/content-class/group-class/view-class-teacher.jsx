import React, { useEffect, useState } from 'react'
import DashMasterLayout from '../../layouts/master'
import ButtonFullComponent from '../../../../components/content-buttons/full-button'
import { MdPersonAddAlt1 } from "react-icons/md";
import { CreateTeacher, FetchTeacher, deleteTeaher } from '../../../../slicers/teacherSlicer';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { RiEdit2Fill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import { BiImageAdd } from "react-icons/bi";
import InputComponet from '../../../../components/content-input/input-full';
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify';
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal';

const Viewclassteacher = () => {
  const dispatch = useDispatch()
  const [fullName, setFullName] = useState('');
  const [position, setPosition] = useState('');
  const [TeacherImage, setTeacherImage] = useState(null);
  const [teacherID, setTacherID] = useState('')

  const [isOpenModelDelete, setIsOpenModelDelete] = useState(false)
  const [isOpenModel, setIsOpenModel] = useState(false)
  const [preview, setPreview] = useState(null)
  // console.log(teacherID)


  const FeacherData = useSelector((state) => state.teacher.teacher)

  useEffect(() => {
    dispatch(FetchTeacher())
  }, [dispatch])


  //func addTeacherData
  const handleCreateData = async () => {
    try {
      if (!fullName && !position) {
        ToastifyWarning({ lable: "กรุณาใส่ข้อมูลให้ครบ" })
        return;
      }
      if (!TeacherImage) {
        ToastifyWarning({ label: "กรุณาอัปโหลดรูปภาพ" });
        return;
      }

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('position', position);
      formData.append('TeacherImage', TeacherImage);

      const response = await dispatch(CreateTeacher(formData));
      if (response.payload.status === true) {
        ToastifySuccess({ lable: "เพิ่มข้อมูลสำเร็จ" })
        setFullName('')
        setPosition('')
        setTeacherImage(null)
        setIsOpenModel(false)
        setPreview(null)
        await dispatch(FetchTeacher())
      }
    } catch (error) {
      ToastifyError({ lable: "เกิดข้อผิดพลาด" })
    }
  }

  //func change Image
  const handleIamgeChange = async (e) => {
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
        throw new Error('ไม่พบ ID ของนักเรียนที่ต้องการลบ')
      }
      const response = await dispatch(deleteTeaher(teacherID))

      if (response.payload.status === true) {
        ToastifySuccess({ lable: 'ลบข้อมูลสำเร็จ' })
        setTacherID('')
        setIsOpenModelDelete(false)
        await dispatch(FetchTeacher())
      } else {
        ToastifyWarning({ lable: "ลบข้อมูลไม่สำเร็จ" })
      }
    } catch (error) {
      ToastifyError({ lable: "เกิดข้อผิดพลาด" })
    }

  }

  return (
    <DashMasterLayout title={"อาจารย์"}>
      <div className="flex items-center justify-end mb-2">
        <button
          onClick={() => setIsOpenModel(true)}
          className="flex items-center gap-x-2 font-semibold bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 hover:shadow-lg focus:outline-none transition-all duration-300"
        >
          เพิ่มข้อมูล
          <MdPersonAddAlt1 size={20} />
        </button>
      </div>
      <div className="animate-fade-up animate-once animate-ease-out animate-normal animate-fill-forwards">
        <table className="w-full rounded-lg bg-white shadow-md overflow-hidden ">
          <thead className="bg-blue-500 text-white ">
            <tr>
              <th className="px-5 py-2 font-semibold text-left">ลำดับ</th>
              <th className="px-5 py-2 font-semibold text-left">รูปภาพ</th>
              <th className="px-5 py-2 font-semibold text-left">ชื่อ</th>
              <th className="px-5 py-2 font-semibold text-left">ตำเเหน่ง</th>
              <th className="px-5 py-2 font-semibold text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className='animate-fade animate-once animate-ease-in-out animate-normal animate-fill-forwards'>
            {FeacherData && FeacherData.length > 0 ? (
              [...FeacherData]
                .sort((a, b) => a.id - b.id)
                .map((data, index) => (
                  <tr
                    key={data.id}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100`}
                  >
                    <td className="px-5 py-3 text-gray-800 text-sm">{index + 1}</td>
                    <td className="py-3 text-center">
                      <img
                        src={`http://localhost:5000/${data.TeacherImage}`}
                        alt="Teacher"
                        className="w-16 h-16 object-cover border border-gray-200"
                      />
                    </td>
                    <td className="py-3 px-5 text-gray-800 text-sm">{data.fullName}</td>
                    <td className="px-5 py-3 text-gray-800 text-sm">{data.position}</td>
                    <td className="px-5 py-3 text-center flex items-center justify-center gap-x-2 ">
                      <Link to={`/editTeachert/${data.id}`}>
                        <div className="p-2 bg-yellow-600 rounded-md text-white hover:bg-yellow-700 transition-colors duration-300 shadow-md">
                          <RiEdit2Fill size={20} />
                        </div>
                      </Link>
                      <button className="p-2 bg-red-600 rounded-md text-white hover:bg-red-700 transition-colors duration-300 cursor-pointer shadow-md"
                        onClick={() => handleOpenModelDelete(data.id)}
                      >
                        <TiDelete size={20} />
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-5 text-gray-600 text-sm"
                >
                  ไม่มีข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* model create Data */}
      {isOpenModel === true && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setIsOpenModel(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-[30rem] sm:w-96 md:w-1/3 shadow-lg animate-jump-in animate-once animate-ease-out animate-normal animate-fill-forwards"
            onClick={(e) => e.stopPropagation()} // ป้องกันคลิกปิดเมื่อคลิกภายใน modal
          >
            <h1 className="text-xl font-bold mb-4">เพิ่มข้อมูลอาจารย์</h1>
            <div className="flex flex-col gap-4">
              <InputComponet
                label={"ชื่อ"}
                color={"blue"}
                value={fullName}
                OnChange={(value) => setFullName(value)}
                className="w-full"
              />
              <div className="flex gap-4 w-full">
                <InputComponet
                  label={"ตำเเหน่ง"}
                  color={"blue"}
                  value={position}
                  OnChange={(value) => setPosition(value)}
                  className="w-full sm:w-[48%]"
                />
              </div>
              <label
                htmlFor="file-upload"
                className='cursor-pointer flex items-center justify-center bg-gray-200  border border border-gray-300 p-2 rounded-lg '
              >
                {preview ? (
                  <img
                    src={preview}
                    alt='Image'
                    className='w-full oblect-cover rounded-lg'
                  />
                ) : (
                  <BiImageAdd size={100} />
                )}
                <input
                  type="file"
                  id="file-upload"
                  className='hidden'
                  accept='image/*'
                  onChange={handleIamgeChange}
                />
              </label>
              <ButtonFullComponent
                lable={"เพิ่มข้อมูล"}
                color={"blue"}
                func={handleCreateData}
              />
            </div>
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={isOpenModelDelete}
        onClose={() => setIsOpenModelDelete(false)}
        onConfirm={handleDelete}
      />
    </DashMasterLayout >
  )
}

export default Viewclassteacher
