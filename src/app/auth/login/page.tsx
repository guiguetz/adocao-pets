import { signIn } from '@/server/auth';
import { GoogleIcon } from '@/components/GoogleIcon';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Entrar</h1>
          <p className="mt-2 text-sm text-gray-600">Acesse sua conta para continuar</p>
        </div>
        <form
          action={async () => {
            'use server';
            await signIn('google', { redirectTo: '/admin' });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <GoogleIcon className="h-5 w-5" />
            Entrar com Google
          </button>
        </form>
      </div>
    </div>
  );
}
