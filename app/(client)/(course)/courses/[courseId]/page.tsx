import sanityClient from "@/lib/sanityClient";
import { ErrorMessage } from "./_components/error-message";

interface Chapter {
  _id: string;
  title: string;
  position: number;
  isPublished: boolean;
}

interface Course {
  _id: string;
  title: string;
  isPublished: boolean;
  chapters: Chapter[];
}

const CourseIdPage = async ({
  params
}: {
  params: { courseId: string; }
}) => {
  console.log(`[Course Page] Accessing course with ID: ${params.courseId}`);

  // D'abord, vérifions si le cours existe
  const courseQuery = `*[_type == "course" && _id == "${params.courseId}"][0] {
    _id,
    title,
    isPublished,
    chapters[]-> {
      _id,
      title,
      position,
      isPublished
    }
  }`;

  console.log(`[Course Page] Checking if course exists...`);
  const course = await sanityClient.fetch<Course>(courseQuery);
  console.log(`[Course Page] Course data:`, course);

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

  // Trouvons le premier chapitre publié
  const publishedChapters = course.chapters?.filter((chapter: Chapter) => chapter.isPublished) || [];
  console.log(`[Course Page] Published chapters:`, publishedChapters);

  if (publishedChapters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <ErrorMessage message="Ce cours n'a pas encore de chapitres publiés." />
      </div>
    );
  }

  // Trier les chapitres par position et prendre le premier
  const firstChapter = publishedChapters.sort((a: Chapter, b: Chapter) => a.position - b.position)[0];
  console.log(`[Course Page] First chapter:`, firstChapter);

  // Rediriger vers le premier chapitre
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
        <p className="text-muted-foreground mb-4">
          Redirection vers le premier chapitre...
        </p>
        <meta httpEquiv="refresh" content={`0;url=/courses/${params.courseId}/chapters/${firstChapter._id}`} />
      </div>
    </div>
  );
}

export default CourseIdPage;