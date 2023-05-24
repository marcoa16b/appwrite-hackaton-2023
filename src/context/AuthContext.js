'use client'
import { userLogged } from "@/services/appwrite";
import React, { createContext, useState, useEffect } from "react";
import { signin } from "@/services/appwrite";
import { Client, Account, ID, Users } from 'appwrite'
import { getCookie, setCookie, deleteCookie } from "cookies-next";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITER_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITER_PROJECT_ID);

const account = new Account(client);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = (data) => {
    const promise = account.create(
      ID.unique(),
      data.email,
      data.password
    );
  
    promise.then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
    });
  }

  const login = async (data, setLoading) => {
    setLoading(true);
    const promise = account.createEmailSession(data.email, data.password);
    promise.then(
      function (response) {
        const sessionID = response.$id;
        setCookie('session-id', sessionID);
        setUser(response);
        setLoading(false);
        return true;
      },
      function (error) {
        console.log(error);
        setLoading(false);
        return false;
      }
    );
  };

  const logout = () => {
    const sessionID = getCookie('session-id');
    const promise = account.deleteSession(sessionID);

    promise.then(function (response) {
        deleteCookie('session-id');
        setUser(null);
    }, function (error) {
        console.log(error); // Failure
    });
  };

  useEffect(() => {
    const verifyUserLogged = async () => {
      const promise = account.get();

      promise.then(function (response) {
        setUser(response);
      }, function (error) {
        console.log("User logged error => ", error);
      });
    }
    verifyUserLogged();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}