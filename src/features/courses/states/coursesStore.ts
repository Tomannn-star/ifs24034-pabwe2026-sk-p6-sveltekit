import { writable } from "svelte/store";
import courseApi, {
  type Course,
  type CourseContent,
} from "../api/courseApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export interface CoursesState {
  courses: Course[];
  course: Course | null;
  content: CourseContent | null;
  isCourse: boolean;
  isCourseAdd: boolean;
  isCourseAdded: boolean;
  isCourseChange: boolean;
  isCourseChanged: boolean;
  isCourseChangeCover: boolean;
  isCourseChangedCover: boolean;
  isCourseDelete: boolean;
  isCourseDeleted: boolean;
  isCourseDeleteAll: boolean;
  isCourseDeletedAll: boolean;
  isStudentEnroll: boolean;
  isStudentEnrolled: boolean;
  isStudentLeave: boolean;
  isStudentLeft: boolean;
  isRatingSubmit: boolean;
  isRatingSubmitted: boolean;
  isContent: boolean;
  isContentAdd: boolean;
  isContentAdded: boolean;
  isContentChange: boolean;
  isContentChanged: boolean;
  isContentDelete: boolean;
  isContentDeleted: boolean;
  isLearnStatusChange: boolean;
  isLearnStatusChanged: boolean;
}

export function createCoursesStore(preloaded: Partial<CoursesState> = {}) {
  const initial: CoursesState = {
    courses: [],
    course: null,
    content: null,
    isCourse: false,
    isCourseAdd: false,
    isCourseAdded: false,
    isCourseChange: false,
    isCourseChanged: false,
    isCourseChangeCover: false,
    isCourseChangedCover: false,
    isCourseDelete: false,
    isCourseDeleted: false,
    isCourseDeleteAll: false,
    isCourseDeletedAll: false,
    isStudentEnroll: false,
    isStudentEnrolled: false,
    isStudentLeave: false,
    isStudentLeft: false,
    isRatingSubmit: false,
    isRatingSubmitted: false,
    isContent: false,
    isContentAdd: false,
    isContentAdded: false,
    isContentChange: false,
    isContentChanged: false,
    isContentDelete: false,
    isContentDeleted: false,
    isLearnStatusChange: false,
    isLearnStatusChanged: false,
    ...preloaded,
  };

  let currentState = { ...initial };
  const innerStore = writable<CoursesState>(currentState);
  innerStore.subscribe((val) => {
    currentState = val;
  });

  return {
    subscribe: innerStore.subscribe,
    get courses() { return currentState.courses; },
    get course() { return currentState.course; },
    get content() { return currentState.content; },
    get isCourse() { return currentState.isCourse; },
    get isCourseAdd() { return currentState.isCourseAdd; },
    get isCourseAdded() { return currentState.isCourseAdded; },
    get isCourseChange() { return currentState.isCourseChange; },
    get isCourseChanged() { return currentState.isCourseChanged; },
    get isCourseChangeCover() { return currentState.isCourseChangeCover; },
    get isCourseChangedCover() { return currentState.isCourseChangedCover; },
    get isCourseDelete() { return currentState.isCourseDelete; },
    get isCourseDeleted() { return currentState.isCourseDeleted; },
    get isCourseDeleteAll() { return currentState.isCourseDeleteAll; },
    get isCourseDeletedAll() { return currentState.isCourseDeletedAll; },
    get isStudentEnroll() { return currentState.isStudentEnroll; },
    get isStudentEnrolled() { return currentState.isStudentEnrolled; },
    get isStudentLeave() { return currentState.isStudentLeave; },
    get isStudentLeft() { return currentState.isStudentLeft; },
    get isRatingSubmit() { return currentState.isRatingSubmit; },
    get isRatingSubmitted() { return currentState.isRatingSubmitted; },
    get isContent() { return currentState.isContent; },
    get isContentAdd() { return currentState.isContentAdd; },
    get isContentAdded() { return currentState.isContentAdded; },
    get isContentChange() { return currentState.isContentChange; },
    get isContentChanged() { return currentState.isContentChanged; },
    get isContentDelete() { return currentState.isContentDelete; },
    get isContentDeleted() { return currentState.isContentDeleted; },
    get isLearnStatusChange() { return currentState.isLearnStatusChange; },
    get isLearnStatusChanged() { return currentState.isLearnStatusChanged; },
    get $state() { return currentState; },

    reset(state: Partial<CoursesState> = initial) {
      innerStore.set({ ...initial, ...state });
    },
    setCourses(courses: Course[]) {
      innerStore.update((s) => ({ ...s, courses }));
    },
    setCourse(course: Course | null) {
      innerStore.update((s) => ({ ...s, course }));
    },
    setContent(content: CourseContent | null) {
      innerStore.update((s) => ({ ...s, content }));
    },
    setIsCourse(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourse: status }));
    },
    setIsCourseAdd(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseAdd: status }));
    },
    setIsCourseAdded(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseAdded: status }));
    },
    setIsCourseChange(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChange: status }));
    },
    setIsCourseChanged(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChanged: status }));
    },
    setIsCourseChangeCover(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChangeCover: status }));
    },
    setIsCourseChangedCover(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseChangedCover: status }));
    },
    setIsCourseDelete(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDelete: status }));
    },
    setIsCourseDeleted(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDeleted: status }));
    },
    setIsCourseDeleteAll(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDeleteAll: status }));
    },
    setIsCourseDeletedAll(status: boolean) {
      innerStore.update((s) => ({ ...s, isCourseDeletedAll: status }));
    },
    setIsStudentEnroll(status: boolean) {
      innerStore.update((s) => ({ ...s, isStudentEnroll: status }));
    },
    setIsStudentEnrolled(status: boolean) {
      innerStore.update((s) => ({ ...s, isStudentEnrolled: status }));
    },
    setIsStudentLeave(status: boolean) {
      innerStore.update((s) => ({ ...s, isStudentLeave: status }));
    },
    setIsStudentLeft(status: boolean) {
      innerStore.update((s) => ({ ...s, isStudentLeft: status }));
    },
    setIsRatingSubmit(status: boolean) {
      innerStore.update((s) => ({ ...s, isRatingSubmit: status }));
    },
    setIsRatingSubmitted(status: boolean) {
      innerStore.update((s) => ({ ...s, isRatingSubmitted: status }));
    },
    setIsContent(status: boolean) {
      innerStore.update((s) => ({ ...s, isContent: status }));
    },
    setIsContentAdd(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentAdd: status }));
    },
    setIsContentAdded(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentAdded: status }));
    },
    setIsContentChange(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentChange: status }));
    },
    setIsContentChanged(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentChanged: status }));
    },
    setIsContentDelete(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentDelete: status }));
    },
    setIsContentDeleted(status: boolean) {
      innerStore.update((s) => ({ ...s, isContentDeleted: status }));
    },
    setIsLearnStatusChange(status: boolean) {
      innerStore.update((s) => ({ ...s, isLearnStatusChange: status }));
    },
    setIsLearnStatusChanged(status: boolean) {
      innerStore.update((s) => ({ ...s, isLearnStatusChanged: status }));
    },

    // Async actions
    async asyncSetCourses(is_me: string = "", search: string = "") {
      try {
        const courses = await courseApi.getCourses(is_me, search);
        this.setCourses(courses);
      } catch {
        this.setCourses([]);
      }
    },

    async asyncSetCourse(courseId: number | string) {
      try {
        const course = await courseApi.getCourseById(courseId);
        this.setCourse(course);
      } catch {
        this.setCourse(null);
      } finally {
        this.setIsCourse(true);
      }
    },

    async asyncSetIsCourseAdd(title: string, description: string) {
      try {
        await courseApi.postCourse(title, description);
        showSuccessDialog("Kursus berhasil ditambahkan!");
        this.setIsCourseAdded(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseAdded(false);
      } finally {
        this.setIsCourseAdd(true);
      }
    },

    async asyncSetIsCourseChange(courseId: number | string, title: string, description: string) {
      try {
        await courseApi.putCourse(courseId, title, description);
        showSuccessDialog("Kursus berhasil diperbarui!");
        this.setIsCourseChanged(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseChanged(false);
      } finally {
        this.setIsCourseChange(true);
      }
    },

    async asyncSetIsCourseChangeCover(courseId: number | string, file: File) {
      try {
        await courseApi.postCourseCover(courseId, file);
        showSuccessDialog("Cover kursus berhasil diubah!");
        this.setIsCourseChangedCover(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseChangedCover(false);
      } finally {
        this.setIsCourseChangeCover(true);
      }
    },

    async asyncSetIsCourseDelete(courseId: number | string) {
      try {
        await courseApi.deleteCourse(courseId);
        showSuccessDialog("Kursus berhasil dihapus!");
        this.setIsCourseDeleted(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseDeleted(false);
      } finally {
        this.setIsCourseDelete(true);
      }
    },

    async asyncSetIsCourseDeleteAll() {
      try {
        await courseApi.deleteAllCourses();
        showSuccessDialog("Semua kursus berhasil dihapus!");
        this.setIsCourseDeletedAll(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsCourseDeletedAll(false);
      } finally {
        this.setIsCourseDeleteAll(true);
      }
    },

    // Students enrollment
    async asyncSetIsStudentEnroll(courseId: number | string) {
      try {
        await courseApi.postEnrollStudent(courseId);
        showSuccessDialog("Berhasil mendaftar ke kursus!");
        this.setIsStudentEnrolled(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsStudentEnrolled(false);
      } finally {
        this.setIsStudentEnroll(true);
      }
    },

    async asyncSetIsStudentLeave(courseId: number | string) {
      try {
        await courseApi.deleteStudent(courseId);
        showSuccessDialog("Berhasil keluar dari kursus!");
        this.setIsStudentLeft(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsStudentLeft(false);
      } finally {
        this.setIsStudentLeave(true);
      }
    },

    // Rating
    async asyncSetIsRatingSubmit(courseId: number | string, ratings: number, comment: string) {
      try {
        await courseApi.putCourseRating(courseId, ratings, comment);
        showSuccessDialog("Penilaian berhasil disimpan!");
        this.setIsRatingSubmitted(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsRatingSubmitted(false);
      } finally {
        this.setIsRatingSubmit(true);
      }
    },

    // Content
    async asyncSetContent(contentId: number | string) {
      try {
        const content = await courseApi.getCourseContentById(contentId);
        this.setContent(content);
      } catch {
        this.setContent(null);
      } finally {
        this.setIsContent(true);
      }
    },

    async asyncSetIsContentAdd(courseId: number | string, title: string, youtube: string) {
      try {
        await courseApi.postCourseContent(courseId, title, youtube);
        showSuccessDialog("Materi berhasil ditambahkan!");
        this.setIsContentAdded(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsContentAdded(false);
      } finally {
        this.setIsContentAdd(true);
      }
    },

    async asyncSetIsContentChange(contentId: number | string, title: string, youtube: string) {
      try {
        await courseApi.putCourseContent(contentId, title, youtube);
        showSuccessDialog("Materi berhasil diperbarui!");
        this.setIsContentChanged(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsContentChanged(false);
      } finally {
        this.setIsContentChange(true);
      }
    },

    async asyncSetIsContentDelete(contentId: number | string) {
      try {
        await courseApi.deleteCourseContent(contentId);
        showSuccessDialog("Materi berhasil dihapus!");
        this.setIsContentDeleted(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsContentDeleted(false);
      } finally {
        this.setIsContentDelete(true);
      }
    },

    async asyncSetIsLearnStatusChange(contentId: number | string, status: number) {
      try {
        await courseApi.postContentLearnStatus(contentId, status);
        showSuccessDialog("Status belajar berhasil diperbarui!");
        this.setIsLearnStatusChanged(true);
      } catch (error: any) {
        showErrorDialog(error.message);
        this.setIsLearnStatusChanged(false);
      } finally {
        this.setIsLearnStatusChange(true);
      }
    },
  };
}

export const coursesStore = createCoursesStore();
export default coursesStore;

