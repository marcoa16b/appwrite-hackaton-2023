'use client'
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { signin } from "@/services/appwrite";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const { user, login, logout } = useContext(AuthContext); 
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    const loginOk = await login({
      email,
      password
    }, setLoading);
    if (loginOk) {
      router.push('/')
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
                    Sign in to your account
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border rounded focus:ring-3  bg-gray-700 border-gray-600 focus:ring-primary-600 ring-offset-gray-800" />
                            </div>
                            <div className="ml-3 text-sm">
                              <label className="text-gray-400">Remember me</label>
                            </div>
                        </div>
                        <a href="#" className="text-sm font-medium hover:underline text-gray-400">Forgot password?</a>
                    </div>
                    <button type="submit" className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-800">{loading ? 'loaging...' : 'Sign in'}</button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        Do not have an account yet? {' '}
                        <Link href="/auth/signup" legacyBehavior>
                          <a className="font-medium hover:underline text-primary-500">Sign up</a>
                        </Link>
                    </p>
                </form>
            </div>
        </div>
      </div>
    </section>
  );
}

export default Login;