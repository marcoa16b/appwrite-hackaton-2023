'use client'
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { signup } from "@/services/appwrite";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';

const Signup = () => {
  const router = useRouter();
  const { user, register } = useContext(AuthContext); 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConf, setPasswordConf] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === passwordConf) {
      const data = {
        email,
        password
      }
      register(data);
      router.push('/auth/login')
    }
  }

  useEffect(() => {
    if (!!user) {
      router.push('/')
    }
  }, [router, user]);

  return (
    <section className="bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-gray-800 border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
                    Sign up to your account
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-white">Your email</label>
                        <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" placeholder="name@mail.com" required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-white">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" placeholder="••••••••" className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-white">Confirm password</label>
                        <input onChange={(e) => setPasswordConf(e.target.value)} type="password" name="password-confirm" id="password-confirm" placeholder="••••••••" className="border sm:text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <button type="submit" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800">Sign up</button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        You have an account yet? {' '}
                        <Link href="/auth/login" legacyBehavior>
                          <a className="font-medium hover:underline text-primary-500">Sign in</a>
                        </Link>
                    </p>
                </form>
            </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;