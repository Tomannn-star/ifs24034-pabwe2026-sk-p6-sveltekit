import { describe, it, expect, vi, beforeEach } from "vitest";
import courseApi from "./courseApi";
import apiHelper from "../../../helpers/apiHelper";

describe("courseApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // postCourse
  it("should post course successfully", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", message: "Kursus berhasil dibuat" }),
    } as any);

    const msg = await courseApi.postCourse("Web Dev", "Belajar web");
    expect(msg).toBe("Kursus berhasil dibuat");
  });

  it("should throw error when post course fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Judul wajib diisi" }),
    } as any);

    await expect(courseApi.postCourse("", "")).rejects.toThrow("Judul wajib diisi");
  });

  it("should throw default error when post course fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.postCourse("a", "b")).rejects.toThrow("Gagal menambahkan kursus");
  });

  // postCourseCover
  it("should post course cover successfully", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", message: "Cover berhasil diubah" }),
    } as any);

    const file = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
    const msg = await courseApi.postCourseCover(1, file);
    expect(msg).toBe("Cover berhasil diubah");
  });

  it("should throw error when post course cover fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "File terlalu besar" }),
    } as any);

    const file = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
    await expect(courseApi.postCourseCover(1, file)).rejects.toThrow("File terlalu besar");
  });

  it("should throw default error when post course cover fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    const file = new File(["dummy"], "cover.jpg", { type: "image/jpeg" });
    await expect(courseApi.postCourseCover(1, file)).rejects.toThrow("Gagal mengubah cover kursus");
  });

  // putCourse
  it("should put course successfully", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", message: "Kursus diperbarui" }),
    } as any);

    const msg = await courseApi.putCourse(1, "New Title", "New Desc");
    expect(msg).toBe("Kursus diperbarui");
  });

  it("should throw error when put course fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Gagal update" }),
    } as any);

    await expect(courseApi.putCourse(1, "T", "D")).rejects.toThrow("Gagal update");
  });

  it("should throw default error when put course fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.putCourse(1, "T", "D")).rejects.toThrow("Gagal mengubah kursus");
  });

  // getCourses
  it("should get courses with parameters and return list", async () => {
    const mockCourses = [{ id: 1, title: "Course 1" }];
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", data: { courses: mockCourses } }),
    } as any);

    const result = await courseApi.getCourses("1", "react");
    expect(result).toEqual(mockCourses);
  });

  it("should get courses with empty parameters and fallback empty list", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", data: {} }),
    } as any);

    const result = await courseApi.getCourses("", "");
    expect(result).toEqual([]);
  });

  it("should throw error when get courses fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Server error" }),
    } as any);

    await expect(courseApi.getCourses()).rejects.toThrow("Server error");
  });

  it("should throw default error when get courses fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.getCourses()).rejects.toThrow("Gagal mengambil data kursus");
  });

  // getCourseById
  it("should get course by id successfully", async () => {
    const mockCourse = { id: 1, title: "Detail Course" };
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", data: { course: mockCourse } }),
    } as any);

    const result = await courseApi.getCourseById(1);
    expect(result).toEqual(mockCourse);
  });

  it("should throw error when get course by id fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Tidak ditemukan" }),
    } as any);

    await expect(courseApi.getCourseById(99)).rejects.toThrow("Tidak ditemukan");
  });

  it("should throw default error when get course by id fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.getCourseById(99)).rejects.toThrow("Gagal mengambil detail kursus");
  });

  // deleteCourse
  it("should delete course successfully", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", message: "Kursus terhapus" }),
    } as any);

    const msg = await courseApi.deleteCourse(1);
    expect(msg).toBe("Kursus terhapus");
  });

  it("should throw error when delete course fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Akses ditolak" }),
    } as any);

    await expect(courseApi.deleteCourse(1)).rejects.toThrow("Akses ditolak");
  });

  it("should throw default error when delete course fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.deleteCourse(1)).rejects.toThrow("Gagal menghapus kursus");
  });

  // deleteAllCourses
  it("should delete all courses successfully", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", message: "Semua kursus dihapus" }),
    } as any);

    const msg = await courseApi.deleteAllCourses();
    expect(msg).toBe("Semua kursus dihapus");
  });

  it("should throw error when delete all courses fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Gagal hapus semua" }),
    } as any);

    await expect(courseApi.deleteAllCourses()).rejects.toThrow("Gagal hapus semua");
  });

  it("should throw default error when delete all courses fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.deleteAllCourses()).rejects.toThrow("Gagal menghapus semua kursus");
  });

  // Students (Peserta)
  it("should enroll student successfully", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", message: "Berhasil mendaftar kursus" }),
    } as any);

    const msg = await courseApi.postEnrollStudent(1);
    expect(msg).toBe("Berhasil mendaftar kursus");
  });

  it("should throw error when enroll student fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Sudah terdaftar" }),
    } as any);

    await expect(courseApi.postEnrollStudent(1)).rejects.toThrow("Sudah terdaftar");
  });

  it("should throw default error when enroll student fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.postEnrollStudent(1)).rejects.toThrow("Gagal mendaftar kursus");
  });

  it("should leave course successfully", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", message: "Berhasil keluar dari kursus" }),
    } as any);

    const msg = await courseApi.deleteStudent(1);
    expect(msg).toBe("Berhasil keluar dari kursus");
  });

  it("should throw error when leave course fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Belum terdaftar" }),
    } as any);

    await expect(courseApi.deleteStudent(1)).rejects.toThrow("Belum terdaftar");
  });

  it("should throw default error when leave course fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.deleteStudent(1)).rejects.toThrow("Gagal keluar dari kursus");
  });

  // Ratings
  it("should submit rating successfully", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", message: "Rating berhasil disimpan" }),
    } as any);

    const msg = await courseApi.putCourseRating(1, 5, "Sangat bagus!");
    expect(msg).toBe("Rating berhasil disimpan");
  });

  it("should throw error when submit rating fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Rating harus 1-5" }),
    } as any);

    await expect(courseApi.putCourseRating(1, 6, "Invalid")).rejects.toThrow("Rating harus 1-5");
  });

  it("should throw default error when submit rating fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.putCourseRating(1, 5, "")).rejects.toThrow("Gagal memberi rating pada kursus");
  });

  // Contents
  it("should post course content successfully", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", message: "Materi berhasil ditambahkan" }),
    } as any);

    const msg = await courseApi.postCourseContent(1, "Pengantar", "https://youtube.com/watch?v=123");
    expect(msg).toBe("Materi berhasil ditambahkan");
  });

  it("should throw error when post course content fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "URL YouTube tidak valid" }),
    } as any);

    await expect(courseApi.postCourseContent(1, "", "")).rejects.toThrow("URL YouTube tidak valid");
  });

  it("should throw default error when post course content fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.postCourseContent(1, "a", "b")).rejects.toThrow("Gagal menambahkan materi kursus");
  });

  it("should put course content successfully", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", message: "Materi berhasil diubah" }),
    } as any);

    const msg = await courseApi.putCourseContent(10, "Updated", "https://youtube.com/watch?v=456");
    expect(msg).toBe("Materi berhasil diubah");
  });

  it("should throw error when put course content fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Gagal update materi" }),
    } as any);

    await expect(courseApi.putCourseContent(10, "a", "b")).rejects.toThrow("Gagal update materi");
  });

  it("should throw default error when put course content fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.putCourseContent(10, "a", "b")).rejects.toThrow("Gagal mengubah materi kursus");
  });

  it("should get course content by id successfully", async () => {
    const mockContent = { id: 10, title: "Materi 1", youtube: "https://youtu.be/xxx" };
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", data: { course_content: mockContent } }),
    } as any);

    const result = await courseApi.getCourseContentById(10);
    expect(result).toEqual(mockContent);
  });

  it("should throw error when get course content by id fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Materi tidak ditemukan" }),
    } as any);

    await expect(courseApi.getCourseContentById(99)).rejects.toThrow("Materi tidak ditemukan");
  });

  it("should throw default error when get course content by id fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.getCourseContentById(99)).rejects.toThrow("Gagal mengambil detail materi kursus");
  });

  it("should delete course content successfully", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", message: "Materi dihapus" }),
    } as any);

    const msg = await courseApi.deleteCourseContent(10);
    expect(msg).toBe("Materi dihapus");
  });

  it("should throw error when delete course content fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Gagal hapus" }),
    } as any);

    await expect(courseApi.deleteCourseContent(10)).rejects.toThrow("Gagal hapus");
  });

  it("should throw default error when delete course content fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.deleteCourseContent(10)).rejects.toThrow("Gagal menghapus materi kursus");
  });

  it("should update content learn status successfully", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "success", message: "Status belajar diperbarui" }),
    } as any);

    const msg = await courseApi.postContentLearnStatus(10, 1);
    expect(msg).toBe("Status belajar diperbarui");
  });

  it("should throw error when update content learn status fails", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail", message: "Status tidak valid" }),
    } as any);

    await expect(courseApi.postContentLearnStatus(10, 3)).rejects.toThrow("Status tidak valid");
  });

  it("should throw default error when update content learn status fails without message", async () => {
    vi.spyOn(apiHelper, "fetchData").mockResolvedValue({
      json: () => Promise.resolve({ status: "fail" }),
    } as any);

    await expect(courseApi.postContentLearnStatus(10, 1)).rejects.toThrow("Gagal memperbarui status pembelajaran");
  });
});

