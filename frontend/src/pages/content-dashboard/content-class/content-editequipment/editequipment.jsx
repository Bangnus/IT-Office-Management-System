import React, { useEffect, useState } from 'react'
import DashMasterLayout from '../../layouts/master'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { editEquipment, fetchEquipmentID } from '../../../../slicers/equipmentSlicer'
import InputComponet from '../../../../components/content-input/input-full'
import ButtonFullComponent from '../../../../components/content-buttons/full-button'
import { ToastifyError, ToastifySuccess, ToastifyWarning } from '../../../../components/content-alert/toastify'
import Cookies from 'js-cookie'
const EditEquipment = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [image, setImage] = useState(null)


    const EquipmentData = useSelector((state) => state.equipment.equipnent)


    useEffect(() => {
        dispatch(fetchEquipmentID(id))
    }, [dispatch])


    const handleSubmit = async () => {
        try {
            const menupath = Cookies.get('MenuPath')

            const formData = new FormData();
            formData.append('name', name)
            formData.append('number', number)
            formData.append('image', image)


            const response = await dispatch(editEquipment({ formData, id }))
            if (response.payload.status === true) {
                ToastifySuccess({ lable: "เเกไขข้อมูลสำเร็จ" })
                setName('')
                setNumber('')

                await dispatch(fetchEquipmentID(id))
                navigate(menupath || '/dashboard');

            } else {
                ToastifyWarning({ lable: "เเก้ไขข้อมูลไม่สำเร็จ" })
            }
        } catch (error) {
            ToastifyError({ lable: "เกิดข้อผิดพลาด" })
        }
    }
    useEffect(() => {
        if (EquipmentData && EquipmentData.length > 0) {
            const equipmentdata = EquipmentData[0];
            setName(equipmentdata.name || '')
            setNumber(equipmentdata.number || '')
            setImage(equipmentdata.image || '')
        }
    }, [EquipmentData])

    const Menupath = () => {
        const menupath = Cookies.get('MenuPath')
        navigate(menupath)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };
    return (
        <DashMasterLayout title={"เเก้ไขข้อมูล"}>
            <div className="p-5 space-y-4 bg-white p-7 rounded-lg shadow-md">
                <InputComponet
                    label={"เเก้ไขชื่อ"}
                    color={"blue"}
                    value={name}
                    OnChange={(value) => setName(value)}
                />
                <InputComponet
                    label={"เเก้ไขจำนวน"}
                    color={"blue"}
                    value={number}
                    OnChange={(value) => setNumber(value)}
                />
                <input type="file" onChange={handleFileChange} className="block w-full mb-3" />
                <div className="flex gap-x-5">
                    <ButtonFullComponent lable={"บันทึก"} color={"blue"} func={handleSubmit} />
                    <ButtonFullComponent lable={"ยกเลิก"} color={"red"} func={Menupath} />
                </div>
            </div>
        </DashMasterLayout>
    )
}

export default EditEquipment
