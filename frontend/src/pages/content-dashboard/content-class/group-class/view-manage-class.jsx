import React, { useEffect, useState } from 'react'
import DashMasterLayout from '../../layouts/master'
import { fetchClassroom, deleteClassroom, createClassroom } from '../../../../slicers/classroomSlicer'
import { useDispatch, useSelector } from 'react-redux'
import { SiGoogleclassroom } from "react-icons/si";
import { MdAdd } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal';
import { ToastifyError, ToastifyInfo, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify';
import InputComponet from '../../../../components/content-input/input-full';
import ButtonFullComponent from '../../../../components/content-buttons/full-button';
import { IoMdAdd } from "react-icons/io";

const ViewManageClass = () => {
  const dispatch = useDispatch()
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [deleteID, setDeleteID] = useState('')
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false)
  const [isOpenModelCreate, setIsOpemModelCreate] = useState(false)
  //create Data
  const [roomID, setRoomID] = useState('')
  const [roomname, setRoomname] = useState('')
  const fetchclassroomData = useSelector((state) => state.classroom.classroom)
  console.log(fetchclassroomData)


  useEffect(() => {
    dispatch(fetchClassroom())
  }, [dispatch])

  // แบ่งข้อมูลตาม roomID == เเบ่งตามชั้น
  const groupedClassrooms = Array.isArray(fetchclassroomData)
    ? fetchclassroomData.reduce((acc, classroom) => {
      const { roomID } = classroom
      if (!acc[roomID]) {
        acc[roomID] = []
      }
      acc[roomID].push(classroom)
      return acc
    }, {})
    : {};
  const handleOpenDelete = () => {
    setIsOpenDelete(!isOpenDelete)
  }
  const handleConfirmDelete = (id) => {
    setDeleteID(id)
    setIsOpenConfirmDelete(true)
  }
  const handleDelete = async () => {
    try {
      if (!deleteID) {
        throw new Error('ไม่พบ ID ของนักเรียนที่ต้องการลบ')
      }

      const response = await dispatch(deleteClassroom(deleteID))

      if (response.payload.status === true) {
        ToastifySuccess({ lable: "ลบข้อมูลสำเร็จ" })
        setDeleteID('')
        setIsOpenConfirmDelete(false)
        await dispatch(fetchClassroom())
      } else {
        ToastifyWarning({ lable: "ลบข้อมูลไม่สำร็จ" })
      }
    } catch (error) {
      ToastifyError({ lable: "เกิดข้อผิดพลาด" })
    }
  }

  const handleCreate = async () => {
    try {
      if (!roomname || !roomID) {
        ToastifyWarning({ lable: "กรุณาใส่ข้อมูลให้ครบ" })
        return;
      }
      const data = {
        roomID: roomID,
        roomname: roomname
      }
      const response = await dispatch(createClassroom(data))

      if (response.payload.status === true) {
        ToastifySuccess({ lable: "เพิ่มข้อมูลสำเร็จ" })
        setRoomID('')
        setRoomname('')
        setIsOpemModelCreate(false)
        await dispatch(fetchClassroom())
      } else {
        ToastifyWarning({ lable: "เพิ่มข้อมูลไม่สำเร็จ" })
      }
    } catch (error) {

    }
  }


  return (
    <DashMasterLayout title={"จัดการห้องเรียน"}>
      <div className="space-y-5 animate-fade-up animate-once animate-ease-in-out animate-normal animate-fill-forwards">
        <div className="bg-white rounded-lg shadow-lg flex items-center justify-between gap-x-2 p-4">
          <h1 className='text-xl font-bold'>ห้องเรียนทั้งหมด</h1>
          <div className="flex items-center gap-x-2">
            <button
              onClick={() => setIsOpemModelCreate(true)}
              className='font-semibold flex items-center bg-green-500 px-2 py-2 rounded-lg text-white hover:bg-green-600 hover:shadow-lg'
            >
              <IoMdAdd size={20} />
            </button>
            {fetchclassroomData.length === 0 ? (
              ''
            ) : (
              <button
                onClick={handleOpenDelete}
                className='font-semibold flex items-center bg-red-500 px-2 py-2 rounded-lg text-white hover:bg-red-600 hover:shadow-lg'
              >
                ลบห้องเรียน
              </button>
            )}

          </div>
        </div>
        {Object.entries(groupedClassrooms).map(([roomID, classrooms]) => (
          <div
            onClick={() => setRoomID(roomID)}
            key={roomID}
          >
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
              <h2 className="text-lg font-bold mb-3">ห้องเรียน: {roomID}</h2>
              <div className="grid grid-cols-4 gap-5 animate-fade animate-once animate-ease-in animate-normal animate-fill-forwards">
                {classrooms.map((classroom) => (
                  <div key={classroom.id} className="relative flex items-center justify-center h-40 w-full bg-white border border-gray-400 rounded-lg shadow-md hover:shadow-lg ">
                    {isOpenDelete === true && (
                      <div
                        onClick={() => handleConfirmDelete(classroom.id)}
                        className="absolute top-[-25px] right-[-25px] p-2 text-red-500 z-10 cursor-pointer animate-fade animate-once animate-ease-out animate-normal animate-fill-forwards ">
                        <TiDelete size={40} />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-2">
                      <SiGoogleclassroom size={80} />
                      <div className="text-lg font-bold">{classroom.roomname}</div>
                    </div>
                  </div>
                ))}
                <div
                  onClick={() => setIsOpemModelCreate(true)}
                  className="flex items-center justify-center h-40 w-full bg-white  border border-gray-400 rounded-lg shadow-md hover:shadow-lg cursor-pointer">
                  <div
                    className="flex  items-center gap-2">
                    <MdAdd size={100} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isOpenModelCreate === true && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setIsOpemModelCreate(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-[30rem] sm:w-96 md:w-1/3 shadow-lg animate-jump-in animate-once animate-ease-out animate-normal animate-fill-forwards"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="text-xl font-bold mb-4">เพิ่มข้อมูลห้องเรียน</h1>
            <div className="space-y-4">
              <InputComponet
                label={"ชั้น"}
                value={roomID}
                OnChange={(value) => setRoomID(value)}
              />
              <InputComponet
                label={"ชื่อห้อง"}
                value={roomname}
                OnChange={(value) => setRoomname(value)}
              />
              <ButtonFullComponent
                lable={"เพิ่มข้อมูล"}
                color={"blue"}
                func={handleCreate}
              />
            </div>
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={isOpenConfirmDelete}
        onClose={() => setIsOpenConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </DashMasterLayout>
  )
}

export default ViewManageClass
