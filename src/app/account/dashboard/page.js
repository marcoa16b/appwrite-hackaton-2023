'use client'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { Client, Storage, Databases, ID } from "appwrite";
import { Avatar, Button } from "flowbite-react";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITER_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITER_PROJECT_ID)
;

const storage = new Storage(client);
const databases = new Databases(client);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  // const [profileComplete, setProfileComplete] = useState(true); 
  const [savedImage, setSavedImage] = useState(null);
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

  useEffect(() => {
    console.log("user => ", user);

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
        // console.log(profileData);
      })
      .catch((e) => {
        console.log(e);
        databases.createDocument(
          process.env.NEXT_PUBLIC_APPWRITER_DATABASE_ID, 
          process.env.NEXT_PUBLIC_APPWRITER_DATABASE_COLLECTION_USERS_ID, 
          user.$id,
          {
            name: '',
            description: '',
            area: '',
            imageID: '',
            instagram: '',
            facebook: '',
            behance: '',
            dribble: '',
          }
        )
        .then(() => {
          // getUserData()
        })
        .catch((e) => {
          console.log(e);
        })
      })
    }

    if (user) {
      getUserData()
    }
  }, [user]);

  useEffect(() => {
    console.log(profileData);
  }, [profileData]);

  return (
    <div className="mt-20 px-5">
      {
        user
        ?
        <div className="w-full flex items-start mb-5">
          {
            savedImage
            ?
            <Avatar
              img={savedImage}
              rounded={true}
              size="lg"
            >
              <div className="space-y-1 font-medium dark:text-white">
                <div>
                  {profileData.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {profileData.area}
                </div>
              </div>
            </Avatar>
            :
            <></>
          }
        </div>
        :
        <p>User not autenticated</p>
      }
      <h1 className="my-5">My projects</h1>

      <div className="bg-slate-900">
        <Button
          gradientDuoTone="purpleToBlue"
        >
          Create new project
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
