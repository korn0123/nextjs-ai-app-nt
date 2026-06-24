import { getCourses } from "@/services/course-service";
import FeaturesCourse from "@/components/features-course";

export default async function CoursePage() {
  const courses = await getCourses();

  return (
    <main>
      {courses.length > 0 && <FeaturesCourse courses={courses} />}
    </main>
  );
}