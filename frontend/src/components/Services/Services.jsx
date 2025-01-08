import React from "react";
import Img1 from "../../assets/biryani.png";
import Img2 from "../../assets/biryani2.png";
import Img3 from "../../assets/biryani3.png";
import { MdDescription } from "react-icons/md";
const ServicesData=[
    {
        id:1,
        img:Img1,
        name:"Briyani",
        description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos saepe nesciunt exercitationem vitae, cupiditate deleniti ut consequatur sapiente quibusdam."
    },
    {
        id:2,
        img:Img2,
        name:"Briyani",
         description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos saepe nesciunt exercitationem vitae, cupiditate deleniti ut consequatur sapiente quibusdam." 
    },
    {
        id:3,
        img:Img3,
        name:"Briyani",
        description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos saepe nesciunt exercitationem vitae, cupiditate deleniti ut consequatur sapiente quibusdam."
    },
];
const Services=()=>{
  return   <>
             <div className="py-10">
                    <div className="container">
                        <div className="text-center mb-20 max-w-[400px] mx-auto">
                            <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Our Services</p>
                            <h1 className="text-3xl font-bold">Services</h1>
                            <p className="text-xs text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam quos saepe nesciunt exercitationem vitae, cupiditate deleniti ut consequatur sapiente quibusdam.</p>
                        </div>
                        {/*Card */}
                        <div className="grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-14 md:gap-5 place-items-center">
                                {
                                    ServicesData.map(({id,img,name,description})=>{
                                            return <div key={id} className="max-w-[300px] group rounded-2xl
                                            bg-white dark:bg-gray-800 hover:bg-primary hover:text-white duration-300 p-4 shadow-xl">

                                            <div className="h-[100px] ">
                                                <img src={img } className="ml-1 max-w-[250px] max-auto block transform -translate-y-20
                                                group-hover:scale-105 group-hover:rotate-6 duration-300 " />

                                            </div>
                                        <div className="p-4 text-center">
                                            <h1 className="text-xl font-bold">{name}</h1>
                                            <p className="text-grey-500 group-hover:text-white duration-300  text-sm line-clamp-2">{description}</p>
                                        </div>
                                </div>
                                         
                                    })  
                                }
                        </div>
                    </div>
             </div>
  </>
 
  

  
}
export default Services;