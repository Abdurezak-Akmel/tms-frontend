import React from 'react';
import { Card, CardBody, Badge, Button } from '../ui';
import type { Course } from '../../services/courseService';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: number) => void;
  onView?: (courseId: number) => void;
  loading?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onEnroll, 
  onView,
  loading = false 
}) => {
  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'green';
      case 'intermediate': return 'yellow';
      case 'advanced': return 'orange';
      case 'expert': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Card className="h-full">
      <CardBody>
        <div className="flex flex-col h-full">
          {/* Course Header */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {course.title}
              </h3>
              <Badge variant="primary" size="sm">
                {course.category}
              </Badge>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {course.description}
            </p>
            
            <div className="flex items-center gap-4 mb-4">
              <Badge variant={getLevelColor(course.level || 'beginner') as any} size="sm">
                {course.level || 'Beginner'}
              </Badge>
              <span className="text-sm text-gray-500">
                {course.created_at ? new Date(course.created_at).getFullYear() : 'N/A'}
              </span>
            </div>
            
            {/* Course ID Display */}
            <div className="text-sm text-gray-500 mb-4">
              Course ID: {course.course_id}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 mt-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onView?.(course.course_id)}
              className="flex-1"
            >
              View Details
            </Button>
            {onEnroll && (
              <Button 
                size="sm" 
                onClick={() => onEnroll(course.course_id)}
                loading={loading}
                className="flex-1"
              >
                Enroll
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CourseCard;
