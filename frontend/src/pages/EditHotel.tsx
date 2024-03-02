import { useMutation, useQuery } from "react-query"
import { useParams } from "react-router-dom"
import * as apiClient from '../api-client'
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";


const EditHotel = () => {

    const { hotelId } = useParams<{ hotelId: string }>();
    const {data:hotel} = useQuery("fetchMyHotelById" , ()=> apiClient.fetchMyHotelById(hotelId || ""),{

        enabled: !!hotelId,
    });

    const { mutate , isLoading } = useMutation(apiClient.updateMyHotelById,{
      onSuccess:()=>{},
      onError:()=>{}
    })

    const handleSave = (hotelFormData: FormData) =>{
      mutate(hotelFormData)
    }

    

  return (
    <div>
        <ManageHotelForm hotel={hotel} onSave={handleSave} isLoading={isLoading}/>
    </div>
  )
}

export default EditHotel