import React, { useEffect, useState } from 'react'
import DashMasterLayout from '../../layouts/master'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchleaveTeacherID, CreateLeaveTeacher, deleteLeave, editLeave } from '../../../../slicers/leaveteacherSlicer'
import InputComponet from '../../../../components/content-input/input-full'
import ButtonFullComponent from '../../../../components/content-buttons/full-button'
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify'
import { RiEdit2Fill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal'



const LeaveTeacher = () => {
    const dispatch = useDispatch()
    const { id } = useParams()
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [teacherID, setTeacherID] = useState(id)
    const [leaveID, setLeaveID] = useState('')
    console.log(leaveID)
    const [isOpenModel, setIsOpenModel] = useState(false)
    const [isOpenModelDelete, setIsOpenModelDelete] = useState(false)


    const fetchleaveData = useSelector((state) => state.leave.leave)
    console.log(fetchleaveData)

    useEffect(() => {
        dispatch(fetchleaveTeacherID(id))
    }, [dispatch])


    const handleCreate = async () => {
        try {
            if (!description || !date || !teacherID) {
                ToastifyWarning({ lable: "กรุณากรอกข้อมูลให้ครบ" });
                return;
            }

            const data = {
                description,
                date,
                teacherID
            }
            const response = await dispatch(CreateLeaveTeacher(data))
            if (response.payload.status === true) {
                ToastifySuccess({ lable: "เพิ่มข้อมูลสำเร็จ" })
                setDescription('')
                setDate('')
                setTeacherID(id)
                setIsOpenModel(false)
                await dispatch(fetchleaveTeacherID(id))
            } else {
                ToastifyWarning({ lable: "เพิ่มข้อมูลไม่สำเร็จ" });
            }
        } catch (error) {
            ToastifyError({ lable: "เกิดข้อผิดพลาด" })
        }
    }

    const handleOpenModelDelete = (id) => {
        setLeaveID(id)
        setIsOpenModelDelete(true)
    }
    const handleDelete = async () => {
        try {
            if (!leaveID) {
                throw new Error('ไม่พบ ID ที่จ้องการลบ')
            }
            const response = await dispatch(deleteLeave(leaveID))

            if (response.payload.status === true) {
                ToastifySuccess({ lable: "ลบข้อมูลสำเร็จ" })
                setLeaveID('')
                setIsOpenModelDelete(false)
                await dispatch(fetchleaveTeacherID(id))
            } else {
                ToastifyWarning({ lable: "ลบข้อมูลไม่สำเร็จ" });
            }
        } catch (error) {
            ToastifyError({ lable: "เกิดข้อผิดพลาด" })
        }
    }
    return (
        <DashMasterLayout title={"ประวัติการลา"}>
            <div className="">
                <div className="">
                    <button
                        onClick={() => setIsOpenModel(true)}
                        className='bg-green-500 rounded-lg shadow-md px-4 py-2 text-white hover:bg-green-600 font-semibold'
                    >
                        เพิ่มข้อมูล
                    </button>
                </div>
                <div className="mt-2 ">
                    <table className="w-full bg-white rounded-lg shadow-md overflow-hidden border-collapse border border-gray-300">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-5 py-3 font-semibold text-left  w-1/12">#</th>
                                <th className="px-5 py-3 font-semibold text-left  w-7/12">เหตุผลในการลา</th>
                                <th className="px-5 py-3 font-semibold text-left  w-4/12">วันที่ขอลา</th>
                                <th className="px-5 py-3 font-semibold text-center  w-4/12">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fetchleaveData && fetchleaveData.length > 0 ? (
                                fetchleaveData.map((data, index) => (
                                    <tr key={data.id} className="hover:bg-gray-100">
                                        <td className="px-5 py-2 text-left ">{index + 1}</td>
                                        <td className="px-5 py-2 text-left ">{data.description}</td>
                                        <td className="px-5 py-2 text-left ">{data.date}</td>
                                        <td className="px-5 py-2 text-left flex items-center justify-center gap-x-2 ">
                                            <Link to={`/editLeave/${data.id}`}>
                                                <div className="p-2 bg-cyan-600 rounded-md text-white hover:bg-cyan-700 transition-colors duration-300 shadow-md">
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
                                        colSpan={3}
                                        className="px-5 py-5 text-center text-gray-500 text-sm border border-gray-300"
                                    >
                                        ไม่มีข้อมูลการลา
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            </div>

            {/* modelCreate */}
            {isOpenModel === true && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                    onClick={() => setIsOpenModel(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-full max-w-[30rem] sm:w-96 md:w-1/3 shadow-lg animate-jump-in animate-once animate-ease-out animate-normal animate-fill-forwards"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-4">
                            <span className='text-xl font-bold '>เพิ่มข้อมูลการลา</span>
                            <InputComponet
                                label={"สาเหตุการลา"}
                                color={"blue"}
                                value={description}
                                OnChange={setDescription}
                            />
                            <InputComponet
                                label={"วันลา"}
                                color={"blue"}
                                type={"date"}
                                value={date}
                                OnChange={setDate}

                            />
                            <ButtonFullComponent
                                lable={"บันทึก"}
                                color={"blue"}
                                func={handleCreate}
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
        </DashMasterLayout>
    )
}

export default LeaveTeacher
