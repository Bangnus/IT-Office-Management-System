import React, { useEffect, useState } from 'react'
import DashMasterLayout from '../../layouts/master'
import { createEquipment, fetchEquipment, deleteEquipment } from '../../../../slicers/equipmentSlicer'
import { useDispatch, useSelector } from 'react-redux'
import { RiEdit2Fill } from "react-icons/ri";
import { TiDelete } from "react-icons/ti";
import InputComponet from '../../../../components/content-input/input-full';
import ButtonFullComponent from '../../../../components/content-buttons/full-button';
import { BiImageAdd } from "react-icons/bi";
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify';
import { Link } from 'react-router-dom'
import ConfirmDeleteModal from '../../../../components/content-alert/ConfirmDeleteModal';

const ViewManageEquipment = () => {
    const dispatch = useDispatch()
    const [isOpenModelCreate, setIsOpenModelCreate] = useState(false)
    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [id, setId] = useState('')
    const [isOpenModelDelete, setIsOpemModelDelete] = useState(false)
    const EquipmentData = useSelector((state) => state.equipment.equipnent)
    console.log(EquipmentData)

    useEffect(() => {
        dispatch(fetchEquipment())
    }, [dispatch])

    const handleCreate = async () => {
        try {
            if (!name && !number) {
                ToastifyWarning({ lable: "กรุณาใส่ข้อมูลให้ครบ" })
                return;
            }
            const formData = new FormData();
            formData.append('name', name);
            formData.append('number', number);
            formData.append('image', image)

            const response = await dispatch(createEquipment(formData))
            if (response.payload.status === true) {
                ToastifySuccess({ lable: "เพิ่มข้อมูลสำเร็จ" })
                setName('')
                setNumber('')
                setImage(null)
                setPreview(null)
                setIsOpenModelCreate(false)
                await dispatch(fetchEquipment())
            }
        } catch (error) {
            ToastifyError({ lable: "เกิดข้อผิดพลาด" })
        }
    }
    const handleIamgeChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                ToastifyWarning({ lable: "กรุณาเลือกไฟล์รูปภาพเท่านั้น" })
                return;
            }
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    };

    const handleOpenModelDelete = (id) => {
        setId(id)
        setIsOpemModelDelete(true)
    }
    const handleDelete = async () => {
        try {
            if (!id) {
                throw new Error('ไม่พบ ID ของนักเรียนที่ต้องการลบ')
            }

            const response = await dispatch(deleteEquipment(id))

            if (response.payload.status === true) {
                ToastifySuccess({ lable: 'ลบข้อมูลสำเร็จ' })
                setId('')
                setIsOpemModelDelete(false)
                await dispatch(fetchEquipment())
            } else {
                ToastifyWarning({ lable: "ลบข้อมูลไม่สำเร็จ" })
            }
        } catch (error) {
            ToastifyError({ lable: "เกิดข้อผิดพลาด" })
        }
    }
    return (
        <DashMasterLayout title={"จัดการอุปกรณ์"}>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg animate-fade animate-once animate-ease-linear animate-normal animate-fill-forwards">
                <h1 className='text-lg font-semibold'>อุปกรณ์ในแผนก</h1>
                <button
                    onClick={() => setIsOpenModelCreate(true)}
                    className='px-4 py-2 bg-green-500 rounded-lg shadow-md text-white hover:bg-green-700'
                >
                    เพิ่มอุปกรณ์
                </button>
            </div>
            <div className="animate-fade-up animate-once animate-ease-in-out animate-normal animate-fill-forwards">
                <table className='w-full rounded-lg bg-white shadow-md overflow-hidden'>
                    <thead className='bg-blue-500 text-white'>
                        <tr>
                            <th className='px-5 py-2 font-semibold text-left'>ลำดับ</th>
                            <th className='px-5 py-2 font-semibold text-left'>รูปภาพ</th>
                            <th className='px-5 py-2 font-semibold text-left'>รายการ</th>
                            <th className='px-5 py-2 font-semibold text-left'>จำนวน</th>
                            <th className='px-5 py-2 font-semibold text-center'>จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {EquipmentData && EquipmentData.length > 0 ? (
                            [...EquipmentData]
                                .sort((a, b) => a.id - b.id)
                                .map((data, index) => (
                                    <tr
                                        key={data.id}
                                        className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                            } hover:bg-gray-100`}
                                    >
                                        <td className='px-5 py-3 text-gray-800 text-sm'>{index + 1}</td>
                                        <td className='text-center py-3 '><img src={`http://localhost:5000/${data.image}`} alt="image" className='w-16 h-16 object-cover' /></td>
                                        <td className='px-5 py-3 text-gray-800 text-sm'>{data.name}</td>
                                        <td className='px-5 py-3 text-gray-800 text-sm'>{data.number}</td>
                                        <td className='px-5 py-3 text-center flex items-center justify-center gap-x-2'>
                                            <Link to={`/editEquipment/${data.id}`}>
                                                <div className='p-2 rounded-lg hover:shadow-lg shadow-md bg-yellow-600 text-white hover:bg-yellow-700 transition-colors duration-300'>
                                                    <RiEdit2Fill size={20} />
                                                </div>
                                            </Link>
                                            <button
                                                onClick={() => handleOpenModelDelete(data.id)}
                                                className='p-2 rounded-lg hover:shadow-lg shadow-md bg-red-600 hover:bg-red-700 text-white transition-colors duration-300'>
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
            {isOpenModelCreate === true && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
                    onClick={() => setIsOpenModelCreate(false)}
                >
                    <div
                        className="bg-white rounded-lg p-6 w-full max-w-[30rem] sm:w-96 md:w-1/3 shadow-lg animate-jump-in animate-once animate-ease-out animate-normal animate-fill-forwards"
                        onClick={(e) => e.stopPropagation()} // ป้องกันคลิกปิดเมื่อคลิกภายใน modal
                    >
                        <h1 className="text-xl font-bold mb-4">เพิ่มข้อมูลอุปกรณ์</h1>
                        <div className="flex flex-col gap-4">
                            <InputComponet
                                label={"รายการ"}
                                color={"blue"}
                                value={name}
                                OnChange={(value) => setName(value)}
                                className="w-full"
                            />
                            <div className="flex gap-4 w-full">
                                <InputComponet
                                    label={"จำนวน"}
                                    color={"blue"}
                                    value={number}
                                    OnChange={(value) => setNumber(value)}
                                    className="w-full sm:w-[48%]"
                                />
                            </div>
                            <label
                                htmlFor="file-upload"
                                className='flex items-center justify-center bg-gray-200  border  border-gray-400'
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
                                func={handleCreate}
                            />
                        </div>
                    </div>
                </div>
            )}
            <ConfirmDeleteModal
                isOpen={isOpenModelDelete}
                onClose={() => setIsOpemModelDelete(false)}
                onConfirm={handleDelete}
            />
        </DashMasterLayout>
    )
}

export default ViewManageEquipment
