import React, { useEffect, useState } from 'react'
import DashMasterLayout from '../../layouts/master'
import { fetchClassroom } from '../../../../slicers/classroomSlicer'
import { useDispatch, useSelector } from 'react-redux'
import { SiGoogleclassroom } from "react-icons/si";
import { MdAdd } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal';

const ViewManageClass = () => {
  const dispatch = useDispatch()
  const [isOpenDelete, setIsOpenDelete] = useState(false)
  const [deleteID, setDeleteID] = useState('')
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false)
  console.log(deleteID)
  const fetchclassroomData = useSelector((state) => state.classroom.classroom)


  useEffect(() => {
    dispatch(fetchClassroom())
  }, [dispatch])

  // แบ่งข้อมูลตาม roomID == เเบ่งตามชั้น
  const groupedClassrooms = fetchclassroomData.reduce((acc, classroom) => {
    const { roomID } = classroom
    if (!acc[roomID]) {
      acc[roomID] = []
    }
    acc[roomID].push(classroom)
    return acc
  }, {})

  const handleOpenDelete = () => {
    setIsOpenDelete(!isOpenDelete)
  }
  const handleConfirmDelete = (id) => {
    setDeleteID(id)
    setIsOpenConfirmDelete(true)
  }
  const handleDelete = () => {

  }
  return (
    <DashMasterLayout title={"จัดการห้องเรียน"}>
      <div className="space-y-5 animate-fade-up animate-once animate-ease-in-out animate-normal animate-fill-forwards">
        <div className="bg-white rounded-lg shadow-lg flex items-center justify-between gap-x-2 p-4">
          <h1 className='text-xl font-bold'>ห้องเรียนทั้งหมด</h1>
          <button
            onClick={handleOpenDelete}
            className='font-semibold flex items-center bg-red-500 px-2 py-2 rounded-lg text-white hover:bg-red-600 hover:shadow-lg'
          >
            <MdDeleteForever size={25} />
            ลบห้องเรียน
          </button>
        </div>
        {Object.entries(groupedClassrooms).map(([roomID, classrooms]) => (
          <div key={roomID}>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg">
              <h2 className="text-lg font-bold mb-3">ห้องเรียน: {roomID}</h2>
              <div className="grid grid-cols-4 gap-5 animate-fade animate-once animate-ease-in animate-normal animate-fill-forwards">
                {classrooms.map((classroom) => (
                  <div key={classroom.id} className="relative flex items-center justify-center h-40 w-full bg-white border border-gray-400 rounded-lg shadow-md hover:shadow-lg ">
                    {isOpenDelete === true && (
                      <div
                        onClick={() => handleConfirmDelete(classroom.id)}
                        className="absolute top-[-25px] right-[-25px] p-2 text-red-500 z-10">
                        <TiDelete size={40} />
                      </div>
                    )}
                    <div className="flex flex-col items-center gap-2">
                      <SiGoogleclassroom size={80} />
                      <div className="text-lg font-bold">{classroom.roomname}</div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-center h-40 w-full bg-white  border border-gray-400 rounded-lg shadow-md hover:shadow-lg">
                  <div className="flex  items-center gap-2">
                    <MdAdd size={100} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ConfirmDeleteModal
        isOpen={isOpenConfirmDelete}
        onClose={() => setIsOpenConfirmDelete(false)}
        onConfirm={handleDelete}
      />
    </DashMasterLayout>
  )
}

export default ViewManageClass
