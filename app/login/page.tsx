'use client'
import { useEffect } from 'react';
import { Input } from '@/components/signup/input';
import { IconBrandGithub, IconBrandGoogle, IconBrandOnlyfans } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push('/');
    }
  }, [session, router]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
        router.push('/');
      } else {
        console.error('Error logging in:', result.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSignInGithub = async () => {
    try {
      const response = await fetch('/api/auth/github-signin', { method: 'POST' });
      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
      } else {
        console.error('Error signing in with GitHub:', result.message);
      }
    } catch (error) {
      console.error('Error signing in with GitHub:', error);
    }
  };

  const handleSignInGoogle = async () => {
    try {
      const response = await fetch('/api/auth/google-signin', { method: 'POST' });
      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
      } else {
        console.error('Error signing in with Google:', result.message);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="w-[40vw] mx-32 my-10 rounded-none md:rounded-2xl p-10 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Welcome back</h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">Hola beings!</p>

      <form className="my-8" onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email">Email Address</label>
          <Input id="email" name="email" placeholder="projectmayhem@fc.com" type="email" />
        </div>
        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <Input id="password" name="password" placeholder="••••••••" type="password" />
        </div>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Log In &rarr;
        </button>
        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>

      <div className="flex flex-col space-y-4">
        <button
          className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          onClick={handleSignInGithub}
        >
          <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">GitHub</span>
          <BottomGradient />
        </button>

        <button
          className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          onClick={handleSignInGoogle}
        >
          <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">Google</span>
          <BottomGradient />
        </button>

        <button
          className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          type="submit"
        >
          <IconBrandOnlyfans className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
          <span className="text-neutral-700 dark:text-neutral-300 text-sm">OnlyFans</span>
          <BottomGradient />
        </button>
      </div>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export default Login;
