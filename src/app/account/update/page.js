'use client'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { Client, Storage, Databases, ID } from "appwrite";
import { FaInstagram, FaFacebook, FaBehance, FaDribbble, FaImage, FaArrowLeft } from 'react-icons/fa';
import { FileInput, Tooltip, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITER_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITER_PROJECT_ID)
;

const storage = new Storage(client);
const databases = new Databases(client);


const Update = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState({
    name: '',
    description: '',
    area: '',
    imageID: '',
    instagram: '',
    facebook: '',
    behance: '',
    dribble: '',
  }); 
  const [selectedImage, setSelectedImage] = useState(null);
  const [savedImage, setSavedImage] = useState(null);

  const handleInputsChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(URL.createObjectURL(file))
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleImageUpload = (e) => {
    e.preventDefault();

    // Get image from input
    const file = document.getElementById('uploader').files[0];

    // If image exist on database
    if (profileData.imageID !== "") {
      // delete the actual image from storage
      storage.deleteFile(
        process.env.NEXT_PUBLIC_APPWRITER_BUCKET_ID_PROFILES, 
        profileData.imageID
      )
      .then((response) => {
        // Add the new file to storage
        storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITER_BUCKET_ID_PROFILES, 
          ID.unique(), 
          file,
        )
        .then((response) => {
          // update the image id of the database
          const fileID = response.$id;
          databases.updateDocument(
            process.env.NEXT_PUBLIC_APPWRITER_DATABASE_ID, 
            process.env.NEXT_PUBLIC_APPWRITER_DATABASE_COLLECTION_USERS_ID, 
            user.$id, // document id == user id
            {
              imageID: fileID, // update only the image id
            }
          )
          .then((response) => {
            console.log("profile image updated correctly!");
          })
          .catch((e) => {
            console.log(e);
          })
        })
        .catch((e) => {
          console.log(e);
        })
      })
      .catch((e) => {
        console.log(e);
      })

    } else {
      // In case that the image isn't created
      storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITER_BUCKET_ID_PROFILES, 
        ID.unique(), 
        file,
      )
      .then((response) => {
        // update the image id of the database
        const fileID = response.$id;
        databases.updateDocument(
          process.env.NEXT_PUBLIC_APPWRITER_DATABASE_ID, 
          process.env.NEXT_PUBLIC_APPWRITER_DATABASE_COLLECTION_USERS_ID, 
          user.$id, // document id == user id
          {
            imageID: fileID, // update only the image id
          }
        )
        .then((response) => {
          console.log("profile image uploaded correctly!");
        })
        .catch((e) => {
          console.log(e);
        })
      })
      .catch((e) => {
        console.log(e);
      });
    }
  };

  const handleUpdateProfileData = (e) => {
    e.preventDefault();

    databases.updateDocument(
      process.env.NEXT_PUBLIC_APPWRITER_DATABASE_ID, 
      process.env.NEXT_PUBLIC_APPWRITER_DATABASE_COLLECTION_USERS_ID, 
      user.$id,
      profileData
    )
    .then((response) => {
      console.log('Data updated correctly')
    })
    .catch((e) => {
      console.log(e);
    })
  }

  useEffect(() => {
    // console.log("user => ", user);

    const getUserData = () => {
      databases.getDocument(
        process.env.NEXT_PUBLIC_APPWRITER_DATABASE_ID, 
        process.env.NEXT_PUBLIC_APPWRITER_DATABASE_COLLECTION_USERS_ID, 
        user.$id
      )
      .then((response) => {
        setProfileData({
          name: response.name,
          description: response.description,
          area: response.area,
          imageID: response.imageID,
          instagram: response.instagram,
          facebook: response.facebook,
          behance: response.behance,
          dribble: response.dribble,
        });

        if (response.imageID !== ""){
          const result = storage.getFileDownload(
            process.env.NEXT_PUBLIC_APPWRITER_BUCKET_ID_PROFILES, 
            response.imageID
          );
          setSavedImage(result.href);
        }
      })
      .catch((e) => {
        console.log(e);
      })
    }

    if (user) {
      getUserData()
    }
  }, [user]);

  return (
    <div className="my-20 px-5">
      <div>
        <Tooltip
          content="Back"
          placement="bottom"
        >
          <div onClick={() => {router.back()}} className="w-20 h-10 flex items-center justify-center bg-slate-700 hover:bg-slate-400 duration-200 rounded-lg cursor-pointer">
            <FaArrowLeft />
          </div>
        </Tooltip>
      </div>
      {
        user
        ?
      <form className="m-auto w-[100%] sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-[50%]">
        <div className="flex flex-col items-center">
          {
            selectedImage
            ?
            <Image 
              src={selectedImage}
              alt="img profile"
              width={100}
              height={100}
              className="object-cover rounded-full my-5"
            />
            :
            <>
              {
                savedImage
                ?
                <Image 
                  src={savedImage}
                  alt="img profile"
                  width={100}
                  height={100}
                  className="object-cover rounded-full my-5"
                />
                :
                <div className="w-[100px] h-[100px] my-5 bg-slate-500 rounded-full flex items-center justify-center text-2xl">
                  <FaImage />
                </div>
              }
            </>
          }
          <FileInput
            id="uploader"
            accept=".png, .jpg, .jpeg"
            onChange={handleImageChange}
            helperText="Select an image in png/jpg format with dimensions of 1x1"
          />
          <div className='w-full flex items-center justify-center'>
            <button onClick={handleImageUpload} disabled={!selectedImage} className="my-5 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-800 shadow-lg shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">Upload image</button>
          </div>
        </div>

        {/* NAME */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">Name <span className="text-red-500">*</span></label>
          <input type="text" id="first_name" name='name' value={profileData.name} onChange={handleInputsChange} className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="John" required />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">Description</label>
          <textarea id="description" rows="4" name='description' value={profileData.description} onChange={handleInputsChange} className="block p-2.5 w-full text-sm rounded-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Write your description here..."></textarea>
        </div>

        {/* FOCUS AREA */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">Focus area (ex. graphic design, paint, drawing...) <span className="text-red-500">*</span></label>
          <input type="text" id="area" name='area' value={profileData.area} onChange={handleInputsChange} className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="Drawing" required />
        </div>
        
        {/* INSTAGRAM */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">Instagram</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm border border-r-0 rounded-l-md bg-gray-600 text-gray-400 border-gray-600">
              <FaInstagram />
            </span>
            <input type="text" id="instagram" name='instagram' value={profileData.instagram} onChange={handleInputsChange} className="rounded-none rounded-r-lg border  block flex-1 min-w-0 w-full text-sm p-2.5  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="https://www.instagram.com/my-user/" />
          </div>
        </div>
        
        {/* FACEBOOK */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">Facebook</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm border border-r-0 rounded-l-md bg-gray-600 text-gray-400 border-gray-600">
              <FaFacebook />
            </span>
            <input type="text" id="facebook" name='facebook' value={profileData.facebook} onChange={handleInputsChange} className="rounded-none rounded-r-lg border  block flex-1 min-w-0 w-full text-sm p-2.5  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="https://www.instagram.com/my-user/" />
          </div>
        </div>
        
        {/* BEHANCE */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">Behance</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm border border-r-0 rounded-l-md bg-gray-600 text-gray-400 border-gray-600">
              <FaBehance />
            </span>
            <input type="text" id="behance" name='behance' value={profileData.behance} onChange={handleInputsChange} className="rounded-none rounded-r-lg border  block flex-1 min-w-0 w-full text-sm p-2.5  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="https://www.instagram.com/my-user/" />
          </div>
        </div>
        
        {/* DRIBBLE */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">Dribble</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm border border-r-0 rounded-l-md bg-gray-600 text-gray-400 border-gray-600">
              <FaDribbble />
            </span>
            <input type="text" id="dribble" name='dribble' value={profileData.dribble} onChange={handleInputsChange} className="rounded-none rounded-r-lg border  block flex-1 min-w-0 w-full text-sm p-2.5  bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="https://www.instagram.com/my-user/" />
          </div>
        </div>
        
        <div className='w-full flex items-center justify-center'>
          <button onClick={handleUpdateProfileData} className="my-5 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-800 shadow-lg shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">Update data</button>
        </div>

      </form>
        :
        <div className="w-full min-h-screen flex items-center justify-center">
          <Spinner
            aria-label="Extra large spinner example"
            size="xl"
          />
        </div>
      }
    </div>
  );
}

export default Update;
