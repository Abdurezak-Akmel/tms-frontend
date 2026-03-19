import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  imageNode?: React.ReactNode;
  type?: 'admin' | 'user';
}

export function AuthLayout({ children, title, subtitle, imageNode, type = 'user' }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px]">
        <div className="mx-auto w-full max-w-sm lg:max-w-md lg:px-8">

          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 mb-8 group relative z-10 transition-transform hover:scale-105 active:scale-95 duration-200">
              <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:bg-indigo-700 transition-colors shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">HabeshaTech {type === 'admin' ? 'Admin' : ''}</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {subtitle}
            </p>
          </div>

          <div className="bg-white py-8 px-4 sm:px-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-2xl border border-slate-100">
            {children}
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} EduQuest TMS. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side: Visuals */}
      <div className="hidden lg:block relative w-0 flex-1 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 h-full w-full">
          {imageNode ? imageNode : (
            <div className={`absolute inset-0 bg-gradient-to-br ${type === 'admin' ? 'from-slate-800 via-indigo-900 to-purple-900' : 'from-indigo-600 via-purple-600 to-blue-800'} opacity-90`} />
          )}

          <div className="absolute bottom-12 left-12 right-12 z-10 text-white backdrop-blur-sm bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl transition-all duration-500 hover:bg-white/15">
            <h3 className="text-2xl font-bold mb-2">
              {type === 'admin' ? "Manage your institution efficiently" : "Empower your learning journey"}
            </h3>
            <p className="text-indigo-100/90 text-lg max-w-lg">
              {type === 'admin'
                ? "Access powerful tools designed specifically for educators and administrators to manage curricula seamlessly."
                : "Join thousands of students and discover premium tutorials to advance your career forward today."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
