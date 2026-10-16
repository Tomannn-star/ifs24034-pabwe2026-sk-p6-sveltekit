import apiHelper from "../../../helpers/apiHelper";

export interface CourseAuthor {
  name: string;
  photo?: string | null;
}

export interface CourseStudent {
  id: number;
  user_id?: number;
  name?: string;
  email?: string;
  photo?: string | null;
  [key: string]: any;
}

export interface CourseRating {
  id?: number;
  user_id?: number;
  ratings?: number;
  comment?: string;
  author?: CourseAuthor;
  [key: string]: any;
}

export interface CourseContent {
  id: number;
  course_id?: number;
  title: string;
  youtube: string;
  status?: number; // 0 or 1
  learn?: {
    id?: number;
    user_id?: number;
    course_content_id?: number;
    status: number;
    [key: string]: any;
  } | null;
  created_at?: string;
  updated_at?: string;
}

export interface Course {
  id: number;
  user_id: number;
  title: string;
  description: string;
  cover?: string | null;
  author?: CourseAuthor;
  students?: CourseStudent[];
  total_students?: number;
  ratings?: CourseRating[];
  rating?: number | null;
  avg_ratings?: number | null;
  total_ratings?: number;
  contents?: CourseContent[];
  course_contents?: CourseContent[];
  total_contents?: number;
  created_at?: string;
  updated_at?: string;
}

declare const DELCOM_BASEURL: string;

const courseApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/courses`;

  const _url = (path: string) => `${BASE_URL}${path}`;

  async function postCourse(title: string, description: string): Promise<string> {
    const response = await apiHelper.fetchData(_url(""), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambahkan kursus");
    }

    return result.message;
  }

  async function postCourseCover(courseId: number | string, coverFile: File): Promise<string> {
    const formData = new FormData();
    formData.append("cover", coverFile);

    const response = await apiHelper.fetchData(_url(`/${courseId}/cover`), {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah cover kursus");
    }

    return result.message;
  }

  async function putCourse(courseId: number | string, title: string, description: string): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah kursus");
    }

    return result.message;
  }

  async function getCourses(is_me: string = "", search: string = ""): Promise<Course[]> {
    const params = new URLSearchParams();
    if (is_me !== "" && is_me !== null && is_me !== undefined) {
      params.append("is_me", is_me);
    }
    if (search !== "" && search !== null && search !== undefined) {
      params.append("search", search);
    }

    const qs = params.toString() ? `?${params.toString()}` : "";
    const response = await apiHelper.fetchData(_url(qs), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil data kursus");
    }

    return result.data?.courses || [];
  }

  async function getCourseById(courseId: number | string): Promise<Course> {
    const response = await apiHelper.fetchData(_url(`/${courseId}`), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail kursus");
    }

    return result.data?.course;
  }

  async function deleteCourse(courseId: number | string): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus kursus");
    }

    return result.message;
  }

  async function deleteAllCourses(): Promise<string> {
    const response = await apiHelper.fetchData(_url(""), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus semua kursus");
    }

    return result.message;
  }

  // Students (Peserta)
  async function postEnrollStudent(courseId: number | string): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/students`), {
      method: "POST",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mendaftar kursus");
    }

    return result.message;
  }

  async function deleteStudent(courseId: number | string): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/students`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal keluar dari kursus");
    }

    return result.message;
  }

  // Ratings
  async function putCourseRating(
    courseId: number | string,
    ratings: number,
    comment: string
  ): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/students/ratings`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ratings, comment }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal memberi rating pada kursus");
    }

    return result.message;
  }

  // Contents
  async function postCourseContent(
    courseId: number | string,
    title: string,
    youtube: string
  ): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/${courseId}/contents`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, youtube }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menambahkan materi kursus");
    }

    return result.message;
  }

  async function putCourseContent(
    contentId: number | string,
    title: string,
    youtube: string
  ): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/-/contents/${contentId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, youtube }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengubah materi kursus");
    }

    return result.message;
  }

  async function getCourseContentById(contentId: number | string): Promise<CourseContent> {
    const response = await apiHelper.fetchData(_url(`/-/contents/${contentId}`), {
      method: "GET",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal mengambil detail materi kursus");
    }

    return result.data?.course_content;
  }

  async function deleteCourseContent(contentId: number | string): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/-/contents/${contentId}`), {
      method: "DELETE",
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal menghapus materi kursus");
    }

    return result.message;
  }

  async function postContentLearnStatus(
    contentId: number | string,
    status: number
  ): Promise<string> {
    const response = await apiHelper.fetchData(_url(`/-/contents/${contentId}/learns`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    const result = await response.json();
    if (result.status !== "success" && !result.success) {
      throw new Error(result.message || "Gagal memperbarui status pembelajaran");
    }

    return result.message;
  }

  return {
    postCourse,
    postCourseCover,
    putCourse,
    getCourses,
    getCourseById,
    deleteCourse,
    deleteAllCourses,
    postEnrollStudent,
    deleteStudent,
    putCourseRating,
    postCourseContent,
    putCourseContent,
    getCourseContentById,
    deleteCourseContent,
    postContentLearnStatus,
  };
})();

export default courseApi;

