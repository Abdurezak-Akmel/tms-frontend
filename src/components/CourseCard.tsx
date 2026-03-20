import { useState, type FC, type MouseEvent } from 'react';
import { ChevronDown, ChevronUp, ShoppingCart, Star, Clock, User } from 'lucide-react';
import { Button } from './Button';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  rating: number;
  reviewsCount: number;
  thumbnail: string;
  totalHours: number;
  level: string;
}

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export const CourseCard: FC<CourseCardProps> = ({ course, onClick }) => {
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const handleBuyClick = (e: MouseEvent) => {
    e.stopPropagation();
    // Buy logic here
    console.log(`Bought course ${course.id}`);
  };

  const toggleDescription = (e: MouseEvent) => {
    e.stopPropagation();
    setIsDescriptionOpen(!isDescriptionOpen);
  };

  return (
    <div 
      onClick={onClick}
      className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden cursor-pointer flex-shrink-0 relative"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1.5 z-10">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          {course.rating} <span className="text-slate-500 font-medium">({course.reviewsCount})</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-grow z-10 bg-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-indigo-50/80 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide uppercase">
            {course.level}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
          {course.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-500 mb-5 font-medium">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-400" />
            <span className="truncate max-w-[140px]">{course.instructor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{course.totalHours}h</span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-5 mb-5">
          <span className="text-2xl font-extrabold text-slate-900">${course.price}</span>
        </div>

        {/* Actions Container */}
        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex gap-2">
             <Button 
               variant="primary" 
               className="flex-1 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm h-11" 
               leftIcon={<ShoppingCart className="w-4 h-4" />}
               onClick={handleBuyClick}
             >
               Buy Now
             </Button>
             <Button 
               variant="secondary" 
               onClick={toggleDescription}
               aria-label="Toggle Description"
               className="px-3 md:px-4 h-11 border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
             >
               {isDescriptionOpen ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
             </Button>
          </div>
          
          {/* Collapsible Description */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDescriptionOpen ? 'max-h-64 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100/50">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">About this course</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
