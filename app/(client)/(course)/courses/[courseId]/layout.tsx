import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getProgress } from "@/actions/get-progress";

import { CourseSidebar } from "./_components/course-sidebar";
import { CourseNavbar } from "./_components/course-navbar";
import { getCourse } from "@/lib/apis";
import { ErrorMessage } from "./_components/error-message";

const CourseLayout = async ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  console.log(`[Course Layout] Initializing layout for course: ${params.courseId}`);

  const { userId } = auth();
  const { courseId } = params;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-full">
        <ErrorMessage message="Vous devez être connecté pour accéder à ce cours." />
      </div>
    );
  }

  try {
    console.log(`[Course Layout] Fetching course data for course: ${courseId}`);
    const course = await getCourse(courseId);
    console.log(`[Course Layout] Course data:`, course);

    if (!course) {
      return (
        <div className="flex items-center justify-center h-full">
          <ErrorMessage message="Ce cours n'existe pas." />
        </div>
      );
    }

    if (!course.isPublished) {
      return (
        <div className="flex items-center justify-center h-full">
          <ErrorMessage message="Ce cours n'est pas encore publié." />
        </div>
      );
    }

    // Vérifier si l'utilisateur a acheté le cours
    const hasPurchased = course.purchases?.some(purchase => purchase.userId === userId);
    console.log(`[Course Layout] User has purchased course: ${hasPurchased}`);

    console.log(`[Course Layout] Fetching progress for course: ${courseId}`);
    const progressCount = await getProgress(userId, course._id);
    console.log(`[Course Layout] Progress count: ${progressCount}`);

    return (
      <div className="h-full">
        <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
          <CourseNavbar
            course={course}
            progressCount={progressCount}
          />
        </div>
        <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
          <CourseSidebar
            course={course}
            progressCount={progressCount}
          />
        </div>
        <main className="md:pl-80 pt-[80px] h-full">
          {children}
        </main>
      </div>
    )
  } catch (error) {
    console.error(`[Course Layout] Error:`, error);
    return (
      <div className="flex items-center justify-center h-full">
        <ErrorMessage message="Une erreur est survenue lors du chargement du cours." />
      </div>
    );
  }
}

export default CourseLayout