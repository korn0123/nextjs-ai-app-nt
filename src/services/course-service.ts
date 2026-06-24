import type { Course } from "@/types/course"

interface CourseResponse {
  data: Course[]
}

export async function getCourses(): Promise<Course[]> {
  const res = await fetch('https://api.codingthailand.com/api/course')
  if (!res.ok) throw new Error(`Failed to fetch courses: ${res.status}`)
  const json: CourseResponse = await res.json()
  return json.data
}
